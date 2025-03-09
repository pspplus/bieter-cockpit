
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TenderCreationForm } from "@/components/tender/TenderCreationForm";

export default function NewTenderPage() {
  const navigate = useNavigate();

  return (
    <Layout title="Ausschreibung erstellen">
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => navigate("/tenders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu Ausschreibungen
        </Button>

        <TenderCreationForm />
      </div>
    </Layout>
  );
}
