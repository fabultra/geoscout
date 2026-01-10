import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/register">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Conditions d'utilisation</h1>
        
        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
          <p className="text-sm text-gray-500">Dernière mise à jour: Janvier 2025</p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant GEO Scout, vous acceptez d'être lié par ces conditions d'utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">2. Description du service</h2>
          <p>
            GEO Scout est un outil d'analyse de visibilité qui évalue la présence de votre marque 
            dans les réponses des intelligences artificielles génératives (ChatGPT, Claude, Gemini, Perplexity).
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">3. Compte utilisateur</h2>
          <p>
            Vous êtes responsable de maintenir la confidentialité de votre compte et mot de passe. 
            Vous acceptez de nous notifier immédiatement de toute utilisation non autorisée de votre compte.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">4. Utilisation acceptable</h2>
          <p>Vous vous engagez à ne pas:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Utiliser le service à des fins illégales</li>
            <li>Tenter de compromettre la sécurité du service</li>
            <li>Revendre ou redistribuer le service sans autorisation</li>
            <li>Surcharger intentionnellement nos serveurs</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mt-8">5. Propriété intellectuelle</h2>
          <p>
            GEO Scout et son contenu original, fonctionnalités et fonctionnalités sont la propriété 
            de SEKOIA et sont protégés par les lois internationales sur le droit d'auteur.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">6. Limitation de responsabilité</h2>
          <p>
            GEO Scout est fourni "tel quel" sans garantie d'aucune sorte. Nous ne garantissons pas 
            que le service sera ininterrompu ou exempt d'erreurs.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">7. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. 
            Les modifications entrent en vigueur dès leur publication sur cette page.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">8. Contact</h2>
          <p>
            Pour toute question concernant ces conditions, contactez-nous à: 
            <a href="mailto:contact@sekoia.ca" className="text-cyan-400 hover:underline ml-1">
              contact@sekoia.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
