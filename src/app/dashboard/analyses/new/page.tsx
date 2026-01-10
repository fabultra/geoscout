'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rocket } from 'lucide-react';

export default function NewAnalysisPage() {
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Valider l'URL
      new URL(url);
    } catch {
      setError('URL invalide. Exemple: https://monsite.com');
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    // Créer l'analyse
    const { data: analysis, error: insertError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        url: url,
        brand_name: brandName || null,
        status: 'pending',
        progress: 0,
      })
      .select()
      .single();

    if (insertError) {
      setError('Erreur lors de la création de l\'analyse');
      setLoading(false);
      return;
    }

    // Rediriger vers la page de progression
    router.push(`/dashboard/analyses/${analysis.id}/progress`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
            <Rocket className="w-8 h-8 text-cyan-400" />
          </div>
          <CardTitle className="text-white text-2xl">Nouvelle analyse</CardTitle>
          <CardDescription className="text-gray-400">
            Entrez l'URL du site à analyser pour découvrir votre visibilité IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-white">URL du site *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://monsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandName" className="text-white">Nom de la marque (optionnel)</Label>
              <Input
                id="brandName"
                type="text"
                placeholder="Ma Marque"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-gray-500">Aide à identifier les mentions de votre marque</p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
              disabled={loading}
            >
              {loading ? 'Lancement...' : 'Lancer l\'analyse'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
