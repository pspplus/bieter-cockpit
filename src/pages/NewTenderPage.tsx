
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TenderCreationForm } from "@/components/tender/TenderCreationForm";
import { useTranslation } from "react-i18next";

export default function NewTenderPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Layout title={t("tender.createNewTender")}>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => navigate("/tenders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("backToTenders")}
        </Button>

        <TenderCreationForm />
      </div>
    </Layout>
  );
}
