'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Le mot de passe doit contenir au moins une majuscule';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    return null;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setErrors((prev) => ({ ...prev, password: error || undefined }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Les mots de passe ne correspondent pas' }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors((prev) => ({ ...prev, password: passwordError }));
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Les mots de passe ne correspondent pas' }));
      return;
    }

    if (!acceptTerms) {
      alert('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    // TODO: Implémenter la logique d'inscription avec Supabase
    console.log('Register:', { email, password });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10">
        <CardHeader className="text-center space-y-4">
          <div className="text-3xl font-bold text-cyan-400">GEO Scout</div>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription className="text-gray-400">
            Commencez votre essai gratuit
          </CardDescription>
        </CardHeader>
        <CardContent>
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

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500"
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500">
                Min. 8 caractères, 1 majuscule, 1 chiffre
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 mt-1"
                required
              />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-400 cursor-pointer"
              >
                J'accepte les{' '}
                <Link
                  href="/terms"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  conditions d'utilisation
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
            >
              Créer mon compte
            </Button>

            <div className="text-center text-sm text-gray-400">
              Déjà un compte?{' '}
              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
