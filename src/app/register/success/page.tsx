import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10 text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-cyan-400" />
          </div>
          <CardTitle className="text-white">Vérifiez votre email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400">
            Nous avons envoyé un lien de confirmation à votre adresse email. 
            Cliquez sur le lien pour activer votre compte.
          </p>
          <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Link href="/login">Retour à la connexion</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
