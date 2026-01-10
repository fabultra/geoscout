import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function AnalysesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: analyses } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Mes analyses</h1>
        <Link href="/dashboard/analyses/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nouvelle analyse
          </Button>
        </Link>
      </div>

      {analyses && analyses.length > 0 ? (
        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <Link 
              key={analysis.id} 
              href={`/dashboard/analyses/${analysis.id}`}
              className="block"
            >
              <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="font-medium text-white text-lg">{analysis.url}</p>
                    <p className="text-sm text-gray-400">
                      {analysis.brand_name && `${analysis.brand_name} • `}
                      {new Date(analysis.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    {analysis.status === 'completed' ? (
                      <div>
                        <span className="text-3xl font-bold text-cyan-400">{analysis.score}</span>
                        <span className="text-gray-400">/100</span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                        {analysis.status}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="text-center py-12">
            <p className="text-gray-400 mb-4">Vous n'avez pas encore d'analyse</p>
            <Link href="/dashboard/analyses/new">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black">
                Lancer ma première analyse
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
