
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError(t('auth.passwordMismatch') || "Passwörter stimmen nicht überein");
      return false;
    }
    if (password.length < 6) {
      setPasswordError(t('auth.passwordTooShort') || "Passwort muss mindestens 6 Zeichen lang sein");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;
    
    if (!validatePassword()) return;

    setIsSubmitting(true);
    const success = await signup(email, password, name);
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
              className="h-24" 
            />
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('auth.signup') || 'Registrieren'}</CardTitle>
            <CardDescription>
              {t('auth.signupDescription') || 'Erstellen Sie ein Konto, um loszulegen'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t('auth.name') || 'Name'}
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Max Mustermann"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <label htmlFor="password" className="text-sm font-medium">
                  {t('auth.password') || 'Passwort'}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t('auth.confirmPassword') || 'Passwort bestätigen'}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-xs text-destructive">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  t('auth.creatingAccount') || 'Konto wird erstellt...'
                ) : (
                  t('auth.createAccount') || 'Konto erstellen'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-tender-600">
              {t('auth.haveAccount') || 'Bereits ein Konto?'}{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                {t('auth.login') || 'Anmelden'}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
