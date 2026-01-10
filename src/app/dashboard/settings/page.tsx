import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/lib/constants';
import { Check } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const currentPlan = profile?.plan || 'free';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Paramètres</h1>
        <p className="text-gray-400 mt-1">Gérez votre compte et votre abonnement</p>
      </div>

      {/* Account info */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-white">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Plan actuel</p>
            <p className="text-white capitalize">{currentPlan}</p>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Changer de plan</CardTitle>
          <CardDescription className="text-gray-400">
            Choisissez le plan adapté à vos besoins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(PLANS).map((plan) => (
              <div 
                key={plan.id} 
                className={`p-4 rounded-lg border ${
                  plan.id === currentPlan 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <h3 className="font-bold text-white">{plan.name}</h3>
                <p className="text-2xl font-bold text-white mt-2">
                  ${plan.price}<span className="text-sm text-gray-400">/mois</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-400">
                    <Check className="w-4 h-4 text-cyan-400" />
                    {plan.analysesPerMonth === -1 ? 'Illimité' : plan.analysesPerMonth} analyses
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <Check className="w-4 h-4 text-cyan-400" />
                    {plan.urlsPerAnalysis} URLs
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <Check className="w-4 h-4 text-cyan-400" />
                    {plan.llmCount} LLMs
                  </li>
                </ul>
                {plan.id !== currentPlan && (
                  <Button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white">
                    Choisir
                  </Button>
                )}
                {plan.id === currentPlan && (
                  <div className="mt-4 text-center text-cyan-400 text-sm">Plan actuel</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
