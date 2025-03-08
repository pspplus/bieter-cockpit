
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-7xl font-bold text-primary mb-6">404</h1>
        <h2 className="text-2xl font-medium mb-4">{t('general.pageNotFound')}</h2>
        <p className="text-tender-600 mb-8">
          {t('general.pageNotFoundDescription')}
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="rounded-full flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          {t('general.returnToHome')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
