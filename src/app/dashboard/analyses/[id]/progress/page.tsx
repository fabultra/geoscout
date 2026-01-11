'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  { id: 1, name: 'Exploration du site', minProgress: 0 },
  { id: 2, name: 'Analyse sémantique', minProgress: 20 },
  { id: 3, name: 'Génération questions', minProgress: 35 },
  { id: 4, name: 'Test des LLMs', minProgress: 45 },
  { id: 5, name: 'Détection concurrents', minProgress: 75 },
  { id: 6, name: 'Calcul scores', minProgress: 90 },
];

export default function AnalysisProgressPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const startAnalysis = async () => {
      if (started) return;
      setStarted(true);

      // Start the analysis
      try {
        const response = await fetch(`/api/analyses/${params.id}/start`, {
          method: 'POST',
        });
        
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Une erreur est survenue');
        }
      } catch (err) {
        setError('Impossible de démarrer l\'analyse');
      }
    };

    startAnalysis();
  }, [params.id, started]);

  useEffect(() => {
    // Poll for updates
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (data) {
        setAnalysis(data);
        
        if (data.status === 'completed') {
          clearInterval(interval);
          setTimeout(() => {
            router.push(`/dashboard/analyses/${params.id}`);
          }, 1000);
        }
        
        if (data.status === 'failed') {
          clearInterval(interval);
          setError('L\'analyse a échoué. Veuillez réessayer.');
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [params.id, router, supabase]);

  const progress = analysis?.progress || 0;
  const currentStepIndex = STEPS.findIndex((step, index) => {
    const nextStep = STEPS[index + 1];
    return progress >= step.minProgress && (!nextStep || progress < nextStep.minProgress);
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Analyse en cours</h1>
            <p className="text-gray-400">{analysis?.url}</p>
          </div>

          {error ? (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => router.push('/dashboard/analyses/new')}>
                Réessayer
              </Button>
            </div>
          ) : (
            <>
              <Progress value={progress} className="mb-8" />

              <div className="space-y-4">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      progress >= (STEPS[index + 1]?.minProgress || 100)
                        ? 'bg-cyan-500 text-black' 
                        : index === currentStepIndex 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-white/5 text-gray-500'
                    }`}>
                      {progress >= (STEPS[index + 1]?.minProgress || 100) ? (
                        <Check className="w-4 h-4" />
                      ) : index === currentStepIndex ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className={progress >= step.minProgress ? 'text-white' : 'text-gray-500'}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>

              {analysis?.status === 'completed' && (
                <div className="mt-8 text-center">
                  <p className="text-cyan-400 font-medium">Analyse terminée!</p>
                  <p className="text-gray-400">Redirection vers les résultats...</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
