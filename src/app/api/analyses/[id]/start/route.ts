import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { crawlWebsite } from '@/lib/firecrawl';
import { queryAllLLMs, LLM_CONFIG, LLMProvider } from '@/lib/llm';
import { generateQuestions, extractKeywords, detectIndustry } from '@/lib/analysis/questions';
import { analyzeLLMResponse, calculateScore, calculateProviderScore, AnalysisResult } from '@/lib/analysis/scoring';
import { extractCompetitorsFromResponses } from '@/lib/analysis/competitors';
import { generateRecommendations } from '@/lib/analysis/recommendations';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    // Get analysis
    const { data: analysis, error: fetchError } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Update status to crawling
    await supabase
      .from('analyses')
      .update({ status: 'crawling', progress: 10 })
      .eq('id', id);

    // Step 1: Crawl website
    const pages = await crawlWebsite(analysis.url, 5);
    const allContent = pages.map(p => p.content).join('\n');
    
    await supabase
      .from('analyses')
      .update({ 
        status: 'analyzing', 
        progress: 25,
        pages_crawled: pages.length 
      })
      .eq('id', id);

    // Step 2: Extract keywords and detect industry
    const keywords = extractKeywords(allContent);
    const industry = detectIndustry(allContent, keywords);

    // Step 3: Generate questions
    const questions = generateQuestions(analysis.brand_name || '', keywords, industry);
    
    await supabase
      .from('analyses')
      .update({ 
        progress: 40,
        questions_generated: questions.length 
      })
      .eq('id', id);

    // Step 4: Query all LLMs
    const allResults: AnalysisResult[] = [];
    const allResponses: Record<string, string> = {};

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const responses = await queryAllLLMs(question);

      // Store responses for competitor analysis
      for (const [provider, response] of Object.entries(responses)) {
        allResponses[provider] = (allResponses[provider] || '') + '\n' + response;
        
        const analysis_result = analyzeLLMResponse(response, analysis.brand_name || '', []);
        allResults.push({
          provider: provider as LLMProvider,
          question,
          response,
          ...analysis_result,
        });

        // Save LLM response
        await supabase.from('llm_responses').insert({
          analysis_id: id,
          provider_id: provider,
          question,
          answer: response,
          mentions_brand: analysis_result.mentionsBrand,
          competitors_mentioned: analysis_result.competitorsMentioned,
          sentiment: analysis_result.sentiment,
        });
      }

      // Update progress
      const progress = 40 + Math.round((i / questions.length) * 35);
      await supabase
        .from('analyses')
        .update({ progress })
        .eq('id', id);
    }

    // Step 5: Extract competitors
    await supabase
      .from('analyses')
      .update({ status: 'scoring', progress: 80 })
      .eq('id', id);

    const competitors = await extractCompetitorsFromResponses(
      allResponses, 
      analysis.brand_name || '', 
      industry
    );

    // Save competitors
    for (const competitor of competitors) {
      await supabase.from('competitors').insert({
        analysis_id: id,
        name: competitor.name,
        domain: competitor.domain,
        mention_count: competitor.mentionCount,
        providers: competitor.providers,
      });
    }

    // Step 6: Calculate scores
    const overallScore = calculateScore(allResults);
    
    // Save provider scores
    for (const provider of Object.keys(LLM_CONFIG) as LLMProvider[]) {
      const providerScore = calculateProviderScore(allResults, provider);
      const config = LLM_CONFIG[provider];
      const mentions = allResults.filter(r => r.provider === provider && r.mentionsBrand).length;

      await supabase.from('provider_scores').insert({
        analysis_id: id,
        provider_id: provider,
        provider_name: config.name,
        score: providerScore,
        mentions,
        color: config.color,
      });
    }

    // Step 7: Generate recommendations
    const mentionRate = allResults.filter(r => r.mentionsBrand).length / allResults.length;
    const hasNegative = allResults.some(r => r.sentiment === 'negative');
    const recommendations = generateRecommendations(overallScore, mentionRate, competitors.length, hasNegative);

    for (const rec of recommendations) {
      await supabase.from('recommendations').insert({
        analysis_id: id,
        priority: rec.priority,
        title: rec.title,
        description: rec.description,
        impact: rec.impact,
        category: rec.category,
      });
    }

    // Update final status
    await supabase
      .from('analyses')
      .update({ 
        status: 'completed', 
        progress: 100,
        score: overallScore,
        completed_at: new Date().toISOString(),
      })
      .eq('id', id);

    return NextResponse.json({ success: true, score: overallScore });

  } catch (error) {
    console.error('Analysis error:', error);
    
    await supabase
      .from('analyses')
      .update({ status: 'failed' })
      .eq('id', id);

    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
