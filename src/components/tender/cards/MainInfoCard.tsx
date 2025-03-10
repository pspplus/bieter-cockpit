
import { format } from "date-fns";
import { Tender } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { displayVertragsart } from "../utils/DisplayFormatters";

interface MainInfoCardProps {
  tender: Tender;
  onOpenDetailsDialog?: () => void;
}

export function MainInfoCard({ tender, onOpenDetailsDialog }: MainInfoCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>{t("tenderDetails.mainInformation", "Hauptinformationen")}</CardTitle>
          </div>
        </div>
        {onOpenDetailsDialog && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenDetailsDialog} 
            className="h-8 w-8"
            title={t("tenderDetails.editDetails", "Ausschreibungsdetails bearbeiten")}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">{t("tender.title")}</div>
            <div className="text-sm">{tender.title}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.externalReference")}</div>
            <div className="text-sm">{tender.externalReference}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.client")}</div>
            <div className="text-sm">{tender.client}</div>
          </div>
          {tender.vergabeplattform && (
            <div>
              <div className="text-sm font-medium">{t("tender.vergabeplattform", "Vergabeplattform")}</div>
              <div className="text-sm">{tender.vergabeplattform}</div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium">{t("tender.vertragsart", "Vertragsart")}</div>
            <div className="text-sm">{displayVertragsart(tender.vertragsart)}</div>
          </div>
        </div>
        
        {/* Fields that take more space stay in one column */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          {tender.description && (
            <div>
              <div className="text-sm font-medium">{t("tender.description")}</div>
              <div className="text-sm whitespace-pre-wrap">{tender.description}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
