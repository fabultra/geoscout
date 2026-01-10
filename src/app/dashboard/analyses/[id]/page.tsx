import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AnalysisResultPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (!analysis) {
    notFound();
  }

  const { data: competitors } = await supabase
    .from('competitors')
    .select('*')
    .eq('analysis_id', id);

  const { data: recommendations } = await supabase
    .from('recommendations')
    .select('*')
    .eq('analysis_id', id)
    .order('priority');

  const { data: providerScores } = await supabase
    .from('provider_scores')
    .select('*')
    .eq('analysis_id', id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{analysis.url}</h1>
          <p className="text-gray-400">{analysis.brand_name || 'Analyse GEO'}</p>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-cyan-400">{analysis.score || '-'}</div>
          <p className="text-gray-400">Score GEO</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="competitors">Concurrents</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {providerScores?.map((provider) => (
              <Card key={provider.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <p className="text-gray-400 text-sm">{provider.provider_name}</p>
                  <p className="text-3xl font-bold text-white mt-2">{provider.score}</p>
                  <p className="text-xs text-gray-500">{provider.mentions} mentions</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitors">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Concurrents détectés</CardTitle>
            </CardHeader>
            <CardContent>
              {competitors && competitors.length > 0 ? (
                <div className="space-y-4">
                  {competitors.map((competitor) => (
                    <div key={competitor.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{competitor.name}</p>
                        {competitor.domain && <p className="text-sm text-gray-400">{competitor.domain}</p>}
                      </div>
                      <Badge variant="secondary">{competitor.mention_count} mentions</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Aucun concurrent détecté</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations && recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={
                          rec.priority === 'P0' ? 'bg-red-500/20 text-red-400' :
                          rec.priority === 'P1' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }>
                          {rec.priority}
                        </Badge>
                        <span className="font-medium text-white">{rec.title}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{rec.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Aucune recommandation disponible</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
