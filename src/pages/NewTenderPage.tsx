
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TenderCreationForm } from "@/components/tender/TenderCreationForm";

export default function NewTenderPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Layout title={t('general.createNewTender')}>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => navigate("/tenders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('tenders.backToTenders')}
        </Button>

        <TenderCreationForm />
      </div>
    </Layout>
  );
}
