import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Politique de confidentialité</h1>
        
        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
          <p className="text-sm text-gray-500">Dernière mise à jour: Janvier 2025</p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">1. Collecte des données</h2>
          <p>Nous collectons les informations suivantes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Adresse email (pour l'authentification)</li>
            <li>URLs des sites analysés</li>
            <li>Résultats des analyses</li>
            <li>Données d'utilisation anonymisées</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mt-8">2. Utilisation des données</h2>
          <p>Vos données sont utilisées pour:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fournir et améliorer nos services</li>
            <li>Vous envoyer des communications relatives à votre compte</li>
            <li>Analyser l'utilisation du service</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mt-8">3. Protection des données</h2>
          <p>
            Nous utilisons des mesures de sécurité conformes aux standards de l'industrie 
            pour protéger vos données personnelles, incluant le chiffrement SSL et 
            le stockage sécurisé des mots de passe.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">4. Partage des données</h2>
          <p>
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager des données 
            avec des fournisseurs de services tiers uniquement pour opérer notre service 
            (hébergement, emails transactionnels).
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">5. Cookies</h2>
          <p>
            Nous utilisons des cookies essentiels pour le fonctionnement du service 
            (authentification, préférences). Aucun cookie publicitaire n'est utilisé.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8">6. Vos droits</h2>
          <p>Vous avez le droit de:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Accéder à vos données personnelles</li>
            <li>Corriger vos données</li>
            <li>Supprimer votre compte et vos données</li>
            <li>Exporter vos données</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-white mt-8">7. Contact</h2>
          <p>
            Pour toute question sur cette politique, contactez-nous à:
            <a href="mailto:privacy@sekoia.ca" className="text-cyan-400 hover:underline ml-1">
              privacy@sekoia.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
