
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useTranslation(['auth', 'general']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const success = await resetPassword(email);
    setIsSubmitting(false);
    
    if (success) {
      setIsSuccess(true);
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
              onClick={() => window.history.back()}
              className="rounded-full"
              aria-label="Zurück"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <Link to="/" className="inline-flex items-center gap-2">
            <img 
              src="/lovable-uploads/67014d21-d261-48c8-94e3-06a85e6b7dac.png" 
              alt="Bieter.Coach" 
              className="h-24" 
            />
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('auth:forgotPassword', 'Passwort vergessen')}</CardTitle>
            <CardDescription>
              {isSuccess 
                ? t('auth:resetPasswordEmailSent', 'Wir haben Ihnen eine E-Mail gesendet. Bitte prüfen Sie Ihr Postfach.') 
                : t('auth:resetPasswordDescription', 'Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen')}
            </CardDescription>
          </CardHeader>
          
          {!isSuccess ? (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t('auth:email', 'E-Mail')}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre.email@beispiel.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    t('auth:sendingResetLink', 'Link wird gesendet...')
                  ) : (
                    t('auth:sendResetLink', 'Zurücksetzungslink senden')
                  )}
                </Button>
              </form>
            </CardContent>
          ) : (
            <CardContent className="text-center py-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-tender-600 mb-6">
                {t('auth:checkEmailForReset', 'Überprüfen Sie Ihre E-Mail für einen Link zum Zurücksetzen Ihres Passworts. Wenn Sie keine E-Mail erhalten haben, überprüfen Sie Ihren Spam-Ordner.')}
              </p>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-tender-600">
              {t('auth:rememberPassword', 'Passwort wieder eingefallen?')}{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                {t('auth:login', 'Anmelden')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
