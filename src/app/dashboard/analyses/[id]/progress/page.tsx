'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Exploration du site', key: 'crawling' },
  { id: 2, name: 'Analyse sémantique', key: 'analyzing' },
  { id: 3, name: 'Génération questions', key: 'generating' },
  { id: 4, name: 'Test des LLMs', key: 'testing' },
  { id: 5, name: 'Détection concurrents', key: 'detecting' },
  { id: 6, name: 'Calcul scores', key: 'scoring' },
];

export default function AnalysisProgressPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchAnalysis = async () => {
      const { data } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (data) {
        setAnalysis(data);
        setProgress(data.progress || 0);
        
        if (data.status === 'completed') {
          router.push(`/dashboard/analyses/${params.id}`);
        }
      }
    };

    fetchAnalysis();

    // Simuler la progression (en attendant le vrai backend)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          router.push(`/dashboard/analyses/${params.id}`);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [params.id, router, supabase]);

  const currentStepIndex = Math.floor((progress / 100) * STEPS.length);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Analyse en cours</h1>
            <p className="text-gray-400">{analysis?.url}</p>
          </div>

          <Progress value={progress} className="mb-8" />

          <div className="space-y-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStepIndex 
                    ? 'bg-cyan-500 text-black' 
                    : index === currentStepIndex 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'bg-white/5 text-gray-500'
                }`}>
                  {index < currentStepIndex ? (
                    <Check className="w-4 h-4" />
                  ) : index === currentStepIndex ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className={index <= currentStepIndex ? 'text-white' : 'text-gray-500'}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
