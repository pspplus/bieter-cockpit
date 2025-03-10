
import { Tender } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import { displayObjektarten } from "../utils/DisplayFormatters";

interface ObjectInfoCardProps {
  tender: Tender;
}

export function ObjectInfoCard({ tender }: ObjectInfoCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <CardTitle>{t("tenderDetails.objectInformation", "Objektinformationen")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {tender.location && (
            <div>
              <div className="text-sm font-medium">{t("tender.location")}</div>
              <div className="text-sm">{tender.location}</div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium">{t("tender.objektart", "Objektart")}</div>
            <div className="text-sm">{displayObjektarten(tender.objektart)}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.objektbesichtigung", "Objektbesichtigung erforderlich")}</div>
            <div className="text-sm">{tender.objektbesichtigungErforderlich ? t("yes") : t("no")}</div>
          </div>
          {tender.jahresreinigungsflaeche && (
            <div>
              <div className="text-sm font-medium">{t("tender.jahresreinigungsflaeche", "Jahresreinigungsfläche")}</div>
              <div className="text-sm">{tender.jahresreinigungsflaeche.toLocaleString()} m²</div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium">{t("tender.raumgruppentabelle", "Raumgruppentabelle")}</div>
            <div className="text-sm">{tender.raumgruppentabelle ? t("yes") : t("no")}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.waschmaschine", "Waschmaschine")}</div>
            <div className="text-sm">{tender.waschmaschine ? t("yes") : t("no")}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
