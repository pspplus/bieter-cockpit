import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, CheckCircle, Smile } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-tender-100 bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Smile className="h-9 w-9 text-yellow-400" />
            <span className="text-xl font-semibold">{t('general.appName')}</span>
          </div>
          <Button onClick={() => navigate("/dashboard")} className="rounded-full">
            {t('general.getStarted')}
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 animate-fade-in">
              {t('general.slogan')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 animate-slide-up">
              {t('landing.headline')}
            </h1>
            <p className="text-lg text-tender-600 mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
              {t('landing.subheadline')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Button 
                size="lg" 
                onClick={() => navigate("/dashboard")}
                className="rounded-full"
              >
                {t('general.getStarted')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
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
        
        <section className="py-16 bg-tender-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">Comprehensive Milestone Tracking</h2>
              <p className="text-tender-600 max-w-2xl mx-auto">
                Follow every step of your tender process with our milestone-based project management system.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="tender-card animate-scale-in" style={{ animationDelay: "0ms" }}>
                <div className="rounded-full w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Document Management</h3>
                <p className="text-tender-600">
                  Organize and review all tender documents efficiently from initial check to final submission.
                </p>
              </div>
              
              <div className="tender-card animate-scale-in" style={{ animationDelay: "100ms" }}>
                <div className="rounded-full w-12 h-12 bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
                  <Smile className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Strategic Planning</h3>
                <p className="text-tender-600">
                  Develop winning strategies and comprehensive tender concepts that stand out.
                </p>
              </div>
              
              <div className="tender-card animate-scale-in" style={{ animationDelay: "200ms" }}>
                <div className="rounded-full w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Implementation</h3>
                <p className="text-tender-600">
                  Seamlessly transition from successful tender to project implementation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-tender-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Smile className="h-8 w-8 text-yellow-400" />
              <span className="text-lg font-semibold">{t('general.appName')}</span>
            </div>
            <p className="text-tender-500 text-sm">
              © 2023 {t('general.appName')}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
