
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
        <h2 className="text-2xl font-medium mb-4">Seite nicht gefunden</h2>
        <p className="text-tender-600 mb-8">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="rounded-full flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Zurück zur Startseite
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
