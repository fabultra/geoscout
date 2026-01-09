'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Target, 
  Gauge, 
  Lightbulb, 
  TrendingUp, 
  Download,
  Rocket,
  AlertTriangle,
  Users,
  Check,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { PLANS } from '@/lib/constants';

export default function LandingPage() {
  const [billingAnnual, setBillingAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-cyan-400">GEO Scout</div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition">Fonctionnalités</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition">Tarifs</a>
            <a href="#faq" className="text-gray-400 hover:text-white transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-400 hover:text-white">Connexion</Button>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium">Essai gratuit</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
          <Rocket className="w-4 h-4 mr-2" />
          Nouveau: Analyse Perplexity disponible
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Dominez les Réponses IA
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Analysez votre visibilité sur ChatGPT, Claude, Gemini et Perplexity. 
          Découvrez ce que les LLMs disent de votre marque.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium text-lg px-8">
            Analyser mon site gratuitement
          </Button>
          <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-white/5">
            Voir la démo
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-gray-500">
          <span>✓ 98% satisfaction</span>
          <span>✓ 4 LLMs analysés</span>
          <span>✓ 10K+ analyses</span>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Vos clients utilisent ChatGPT pour vous trouver.
        </h2>
        <p className="text-xl text-cyan-400 text-center mb-16">Êtes-vous visible?</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: TrendingUp, title: "70%", desc: "des recherches B2B passent par l'IA" },
            { icon: Users, title: "Concurrents", desc: "Les LLMs recommandent vos concurrents" },
            { icon: AlertTriangle, title: "Invisible", desc: "Vous perdez des clients sans le savoir" },
          ].map((item, i) => (
            <Card key={i} className="bg-white/5 border-white/10 text-center p-8">
              <CardContent className="pt-6">
                <item.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <div className="text-2xl font-bold mb-2">{item.title}</div>
                <p className="text-gray-400">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Fonctionnalités</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Layers, title: "Analyse Multi-LLM", desc: "Testez votre visibilité sur ChatGPT, Claude, Gemini et Perplexity simultanément" },
            { icon: Target, title: "Détection Concurrents", desc: "Identifiez qui les LLMs recommandent à votre place" },
            { icon: Gauge, title: "Score GEO", desc: "Obtenez un score de visibilité IA de 0 à 100" },
            { icon: Lightbulb, title: "Recommandations", desc: "Recevez des actions concrètes pour améliorer" },
            { icon: TrendingUp, title: "Suivi Temporel", desc: "Mesurez vos progrès dans le temps" },
            { icon: Download, title: "Export Pro", desc: "Générez des rapports PDF et Markdown" },
          ].map((item, i) => (
            <Card key={i} className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-all hover:scale-105 p-6">
              <CardContent className="pt-6">
                <item.icon className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Comment ça marche</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            "Entrez votre URL",
            "Nous analysons sur 4 LLMs",
            "Recevez votre score GEO",
            "Appliquez les recommandations"
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-cyan-500 text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {i + 1}
              </div>
              <p className="text-lg">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Tarifs</h2>
        <p className="text-gray-400 text-center mb-8">Choisissez le plan adapté à vos besoins</p>
        
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={billingAnnual ? 'text-gray-500' : 'text-white'}>Mensuel</span>
          <button
            onClick={() => setBillingAnnual(!billingAnnual)}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${billingAnnual ? 'bg-cyan-500' : 'bg-gray-700'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${billingAnnual ? 'translate-x-6' : ''}`} />
          </button>
          <span className={billingAnnual ? 'text-white' : 'text-gray-500'}>Annuel</span>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">-20%</Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.values(PLANS).map((plan) => (
            <Card 
              key={plan.id} 
              className={`bg-white/5 border-white/10 p-6 relative ${plan.id === 'pro' ? 'border-cyan-500 scale-105' : ''}`}
            >
              {plan.id === 'pro' && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-black">Populaire</Badge>
              )}
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-4">
                  ${billingAnnual ? plan.priceAnnual : plan.price}
                  <span className="text-lg text-gray-400">/mois</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    {plan.analysesPerMonth === -1 ? 'Illimité' : plan.analysesPerMonth} analyses/mois
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    {plan.urlsPerAnalysis} URLs/analyse
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" />
                    {plan.llmCount} LLMs
                  </li>
                </ul>
                <Button 
                  className={`w-full ${plan.id === 'pro' ? 'bg-cyan-500 hover:bg-cyan-600 text-black' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {plan.price === 0 ? 'Commencer gratuitement' : 'Choisir ce plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Questions fréquentes</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { q: "Qu'est-ce que le GEO (Generative Engine Optimization)?", a: "Le GEO est l'optimisation de votre présence dans les réponses des intelligences artificielles génératives comme ChatGPT, Claude ou Gemini." },
            { q: "Comment fonctionne l'analyse?", a: "Nous crawlons votre site, extrayons les informations clés, puis interrogeons 4 LLMs avec des questions pertinentes pour votre secteur." },
            { q: "Quels LLMs sont analysés?", a: "ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google) et Perplexity." },
            { q: "Combien de temps prend une analyse?", a: "Entre 2 et 10 minutes selon la taille du site et le nombre de pages analysées." },
            { q: "Mes données sont-elles sécurisées?", a: "Oui, nous utilisons le chiffrement SSL et ne stockons aucune donnée sensible. Vos analyses sont privées." },
            { q: "Puis-je annuler mon abonnement?", a: "Oui, vous pouvez annuler à tout moment. Aucun engagement, aucun frais caché." },
          ].map((item, i) => (
            <details key={i} className="group bg-white/5 border border-white/10 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <span className="font-medium">{item.q}</span>
                <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-4 pb-4 text-gray-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold text-cyan-400 mb-4">GEO Scout</div>
              <p className="text-gray-400">Dominez les réponses IA</p>
            </div>
            <div>
              <div className="font-semibold mb-4">Produit</div>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white">Tarifs</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-4">Ressources</div>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-4">Légal</div>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Conditions</a></li>
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500">
            © 2025 GEO Scout by SEKOIA. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
