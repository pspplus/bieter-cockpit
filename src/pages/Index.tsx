import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";

export default function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-tender-100 dark:border-tender-800 bg-white dark:bg-tender-950">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/4ad70f59-6fd4-4e3e-9697-a48b2eb8680b.png" 
              alt="Bieter Cockpit" 
              className="h-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="rounded-full">
                {t('general.getStarted')}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login')}
                  className="rounded-full"
                >
                  {t('auth.login') || 'Anmelden'}
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="rounded-full"
                >
                  {t('auth.signup') || 'Registrieren'}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 animate-fade-in">
              {t('general.slogan')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 animate-slide-up text-bieter-blue">
              {t('landing.headline')}
            </h1>
            <p className="text-lg text-tender-600 dark:text-tender-300 mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
              {t('landing.subheadline')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/dashboard")}
                  className="rounded-full"
                >
                  {t('general.getStarted')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/signup")}
                  className="rounded-full"
                >
                  {t('auth.createAccount') || 'Konto erstellen'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/tenders")}
                className="rounded-full"
              >
                {t('general.viewTenders')}
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-tender-50 dark:bg-tender-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4 text-bieter-blue">{t('landing.featureHeading')}</h2>
              <p className="text-tender-600 dark:text-tender-300 max-w-2xl mx-auto">
                {t('landing.featureSubheading')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="tender-card dark:bg-tender-800 dark:border-tender-700 animate-scale-in" style={{ animationDelay: "0ms" }}>
                <div className="rounded-full w-12 h-12 bg-bieter-blue/10 dark:bg-bieter-blue/20 text-bieter-blue flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-bieter-blue">{t('landing.feature1Title')}</h3>
                <p className="text-tender-600 dark:text-tender-300">
                  {t('landing.feature1Description')}
                </p>
              </div>
              
              <div className="tender-card dark:bg-tender-800 dark:border-tender-700 animate-scale-in" style={{ animationDelay: "100ms" }}>
                <div className="rounded-full w-12 h-12 bg-bieter-blue/10 dark:bg-bieter-blue/20 text-bieter-blue flex items-center justify-center mb-4">
                  <img 
                    src="/lovable-uploads/8d9b2e36-d9ae-456f-9e6b-28d57ee1e7e1.png" 
                    alt="Bieter Cockpit" 
                    className="h-6 w-6"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2 text-bieter-blue">{t('landing.feature2Title')}</h3>
                <p className="text-tender-600 dark:text-tender-300">
                  {t('landing.feature2Description')}
                </p>
              </div>
              
              <div className="tender-card dark:bg-tender-800 dark:border-tender-700 animate-scale-in" style={{ animationDelay: "200ms" }}>
                <div className="rounded-full w-12 h-12 bg-bieter-blue/10 dark:bg-bieter-blue/20 text-bieter-blue flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-bieter-blue">{t('landing.feature3Title')}</h3>
                <p className="text-tender-600 dark:text-tender-300">
                  {t('landing.feature3Description')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white dark:bg-tender-950 border-t border-tender-100 dark:border-tender-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/4ad70f59-6fd4-4e3e-9697-a48b2eb8680b.png" 
                alt="Bieter Cockpit" 
                className="h-10"
              />
            </div>
            <p className="text-tender-500 dark:text-tender-400 text-sm">
              © 2023 Bieter Cockpit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
