
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-tender-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-full flex justify-start mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="rounded-full"
              aria-label="Zurück zur Startseite"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <Link to="/" className="inline-flex items-center gap-2">
            <img 
              src="/lovable-uploads/4ad70f59-6fd4-4e3e-9697-a48b2eb8680b.png" 
              alt="Bieter.Coach" 
              className="h-12" 
            />
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('auth.login') || 'Anmelden'}</CardTitle>
            <CardDescription>
              {t('auth.loginDescription') || 'Melden Sie sich an, um auf Ihr Konto zuzugreifen'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t('auth.email') || 'E-Mail'}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre.email@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    {t('auth.password') || 'Passwort'}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    {t('auth.forgotPassword') || 'Passwort vergessen?'}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  t('auth.loggingIn') || 'Anmeldung läuft...'
                ) : (
                  t('auth.login') || 'Anmelden'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-tender-600">
              {t('auth.noAccount') || 'Noch kein Konto?'}{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                {t('auth.signup') || 'Registrieren'}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
