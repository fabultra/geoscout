import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { crawlWebsite } from '@/lib/firecrawl';
import { queryAllLLMs, LLM_CONFIG, LLMProvider } from '@/lib/llm';
import { analyzeWebsite, generateContextualQuestions, identifyCompetitors } from '@/lib/analysis/website-analyzer';
import { analyzeLLMResponse, calculateScore, calculateProviderScore, AnalysisResult } from '@/lib/analysis/scoring';
import { generateTechnicalRecommendations } from '@/lib/analysis/technical-recommendations';

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

    // Get user plan for limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', analysis.user_id)
      .single();

    const plan = profile?.plan || 'free';
    const maxPages = plan === 'free' ? 5 : plan === 'basic' ? 20 : plan === 'pro' ? 100 : 200;
    const maxRecommendations = plan === 'free' ? 3 : plan === 'basic' ? 5 : 8;

    // Update status to crawling
    await supabase
      .from('analyses')
      .update({ status: 'crawling', progress: 5, current_step: 'Exploration du site...' })
      .eq('id', id);

    // Step 1: Crawl website
    const pages = await crawlWebsite(analysis.url, maxPages);
    
    if (pages.length === 0) {
      throw new Error('Impossible de crawler le site web');
    }

    await supabase
      .from('analyses')
      .update({ 
        status: 'analyzing', 
        progress: 15,
        pages_crawled: pages.length,
        current_step: 'Analyse du site web...'
      })
      .eq('id', id);

    // Step 2: Analyze website with AI
    const websiteAnalysis = await analyzeWebsite(pages, analysis.brand_name);

    await supabase
      .from('analyses')
      .update({ 
        progress: 25,
        current_step: 'Génération des questions...'
      })
      .eq('id', id);

    // Step 3: Generate contextual questions
    const questions = await generateContextualQuestions(websiteAnalysis);
    
    await supabase
      .from('analyses')
      .update({ 
        progress: 35,
        questions_generated: questions.length,
        current_step: 'Interrogation des IA...'
      })
      .eq('id', id);

    // Step 4: Query all LLMs
    const allResults: AnalysisResult[] = [];
    const allResponses: Record<string, string> = {
      openai: '',
      anthropic: '',
      google: '',
      perplexity: '',
    };

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const responses = await queryAllLLMs(question);

      for (const [provider, response] of Object.entries(responses)) {
        allResponses[provider] += '\n' + response;
        
        const analysisResult = analyzeLLMResponse(
          response, 
          websiteAnalysis.companyName || analysis.brand_name || '', 
          []
        );
        
        allResults.push({
          provider: provider as LLMProvider,
          question,
          response,
          ...analysisResult,
        });

        // Save LLM response
        await supabase.from('llm_responses').insert({
          analysis_id: id,
          provider_id: provider,
          question,
          answer: response,
          mentions_brand: analysisResult.mentionsBrand,
          competitors_mentioned: analysisResult.competitorsMentioned,
          sentiment: analysisResult.sentiment,
        });
      }

      // Update progress
      const progress = 35 + Math.round((i / questions.length) * 35);
      await supabase
        .from('analyses')
        .update({ progress, current_step: `Question ${i + 1}/${questions.length}...` })
        .eq('id', id);
    }

    await supabase
      .from('analyses')
      .update({ 
        status: 'scoring', 
        progress: 75,
        current_step: 'Identification des concurrents...'
      })
      .eq('id', id);

    // Step 5: Identify real competitors
    const competitors = await identifyCompetitors(websiteAnalysis, allResponses);

    for (const competitor of competitors) {
      // Count mentions in responses
      let mentionCount = 0;
      const providers: string[] = [];
      
      for (const [provider, response] of Object.entries(allResponses)) {
        if (response.toLowerCase().includes(competitor.name.toLowerCase())) {
          mentionCount++;
          providers.push(provider);
        }
      }

      await supabase.from('competitors').insert({
        analysis_id: id,
        name: competitor.name,
        mention_count: mentionCount,
        providers: providers,
        is_validated: competitor.relevanceScore > 70,
      });
    }

    await supabase
      .from('analyses')
      .update({ 
        progress: 85,
        current_step: 'Calcul des scores...'
      })
      .eq('id', id);

    // Step 6: Calculate scores
    const overallScore = calculateScore(allResults);
    const mentionRate = allResults.filter(r => r.mentionsBrand).length / allResults.length;

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

    await supabase
      .from('analyses')
      .update({ 
        progress: 92,
        current_step: 'Génération des recommandations...'
      })
      .eq('id', id);

    // Step 7: Generate technical recommendations
    const recommendations = await generateTechnicalRecommendations(
      pages,
      websiteAnalysis,
      overallScore,
      mentionRate,
      maxRecommendations
    );

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
        current_step: 'Analyse terminée!',
        completed_at: new Date().toISOString(),
      })
      .eq('id', id);

    return NextResponse.json({ success: true, score: overallScore });

  } catch (error) {
    console.error('Analysis error:', error);
    
    await supabase
      .from('analyses')
      .update({ 
        status: 'failed',
        current_step: 'Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
      })
      .eq('id', id);

    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
