'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi d'email avec Supabase Auth + Resend
    console.log('Forgot password:', { email });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10">
        <CardHeader className="text-center space-y-4">
          <div className="text-3xl font-bold text-cyan-400">GEO Scout</div>
          <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
          <CardDescription className="text-gray-400">
            {submitted
              ? 'Vérifiez votre boîte mail'
              : 'Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-center">
                <p className="text-cyan-400">
                  Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
                </p>
              </div>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5"
                >
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
              >
                Envoyer le lien
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
