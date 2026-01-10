import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, TrendingUp, FileSearch, Target } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Récupérer les analyses de l'utilisateur
  const { data: analyses } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const analysesCount = analyses?.length || 0;
  const avgScore = analyses?.length 
    ? Math.round(analyses.filter(a => a.score).reduce((sum, a) => sum + (a.score || 0), 0) / analyses.filter(a => a.score).length)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
          <p className="text-gray-400 mt-1">Bienvenue, {user?.email}</p>
        </div>
        <Link href="/dashboard/analyses/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nouvelle analyse
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Score moyen</CardTitle>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{avgScore || '-'}</div>
            <p className="text-xs text-gray-500">sur 100</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Analyses ce mois</CardTitle>
            <FileSearch className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{profile?.analyses_this_month || 0}</div>
            <p className="text-xs text-gray-500">sur {profile?.plan === 'free' ? 1 : profile?.plan === 'basic' ? 3 : 10}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Plan actuel</CardTitle>
            <Target className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white capitalize">{profile?.plan || 'Free'}</div>
            <Link href="/dashboard/settings" className="text-xs text-cyan-400 hover:underline">Changer de plan</Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent analyses */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Analyses récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {analyses && analyses.length > 0 ? (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <Link 
                  key={analysis.id} 
                  href={`/dashboard/analyses/${analysis.id}`}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                  <div>
                    <p className="font-medium text-white">{analysis.url}</p>
                    <p className="text-sm text-gray-400">{new Date(analysis.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    {analysis.status === 'completed' ? (
                      <span className="text-2xl font-bold text-cyan-400">{analysis.score}</span>
                    ) : (
                      <span className="text-sm text-yellow-400">{analysis.status}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Aucune analyse pour le moment</p>
              <Link href="/dashboard/analyses/new">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-black">
                  Lancer ma première analyse
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
