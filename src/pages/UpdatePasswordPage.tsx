
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle } from "lucide-react";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { updatePassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['auth', 'general']);

  useEffect(() => {
    // Check if the user came from a password reset email
    const hash = window.location.hash;
    if (!hash && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError(t('auth:passwordMismatch', "Passwörter stimmen nicht überein"));
      return false;
    }
    if (password.length < 8) {
      setPasswordError(t('auth:passwordTooShort', "Passwort muss mindestens 8 Zeichen lang sein"));
      return false;
    }
    
    // Check for stronger password (at least one uppercase, one lowercase, one number, one special character)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      setPasswordError(t('auth:passwordNotStrong', "Passwort muss Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen enthalten"));
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    
    if (!validatePassword()) return;

    setIsSubmitting(true);
    const success = await updatePassword(password);
    setIsSubmitting(false);
    
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              src="/lovable-uploads/67014d21-d261-48c8-94e3-06a85e6b7dac.png" 
              alt="Bieter.Coach" 
              className="h-24" 
            />
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('auth:updatePassword', 'Passwort aktualisieren')}</CardTitle>
            <CardDescription>
              {isSuccess 
                ? t('auth:passwordUpdatedSuccess', 'Ihr Passwort wurde erfolgreich aktualisiert.') 
                : t('auth:updatePasswordDescription', 'Erstellen Sie ein neues, sicheres Passwort für Ihr Konto')}
            </CardDescription>
          </CardHeader>
          
          {!isSuccess ? (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    {t('auth:newPassword', 'Neues Passwort')}
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tender-500 hover:text-tender-700"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password && <PasswordStrengthMeter password={password} />}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    {t('auth:confirmPassword', 'Passwort bestätigen')}
                  </label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  {passwordError && (
                    <p className="text-xs text-destructive">{passwordError}</p>
                  )}
                </div>
                
                <div className="text-xs text-tender-600 space-y-1">
                  <p>{t('auth:passwordRequirements', 'Ihr Passwort muss folgendes enthalten:')}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('auth:passwordReqLength', 'Mindestens 8 Zeichen')}</li>
                    <li>{t('auth:passwordReqUppercase', 'Mindestens ein Großbuchstabe')}</li>
                    <li>{t('auth:passwordReqLowercase', 'Mindestens ein Kleinbuchstabe')}</li>
                    <li>{t('auth:passwordReqNumber', 'Mindestens eine Zahl')}</li>
                    <li>{t('auth:passwordReqSpecial', 'Mindestens ein Sonderzeichen')}</li>
                  </ul>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    t('auth:updatingPassword', 'Passwort wird aktualisiert...')
                  ) : (
                    t('auth:updatePassword', 'Passwort aktualisieren')
                  )}
                </Button>
              </form>
            </CardContent>
          ) : (
            <CardContent className="text-center py-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-tender-600 mb-6">
                {t('auth:redirectingToDashboard', 'Ihr Passwort wurde aktualisiert. Sie werden zum Dashboard weitergeleitet...')}
              </p>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-tender-600">
              <Link to="/dashboard" className="text-primary font-medium hover:underline">
                {t('general:backToDashboard', 'Zurück zum Dashboard')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
