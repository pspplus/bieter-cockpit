
import { Tender } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { displayZertifikate } from "../utils/DisplayFormatters";

interface RequirementsCardProps {
  tender: Tender;
}

export function RequirementsCard({ tender }: RequirementsCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          <CardTitle>{t("tenderDetails.requirements", "Anforderungen")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="text-sm font-medium">{t("tender.erforderlicheZertifikate", "Erforderliche Zertifikate")}</div>
            <div className="text-sm">{displayZertifikate(tender.erforderlicheZertifikate)}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.conceptRequired")}</div>
            <div className="text-sm">{tender.conceptRequired ? t("yes") : t("no")}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.tariflohn", "Tariflohn")}</div>
            <div className="text-sm">{tender.tariflohn ? t("yes") : t("no")}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.qualitaetskontrollen", "Qualitätskontrollen")}</div>
            <div className="text-sm">{tender.qualitaetskontrollen ? t("yes") : t("no")}</div>
          </div>
          {tender.stundenvorgaben && (
            <div>
              <div className="text-sm font-medium">{t("tender.stundenvorgaben", "Stundenvorgaben")}</div>
              <div className="text-sm">{tender.stundenvorgaben}</div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium">{t("tender.leistungswertvorgaben", "Leistungswertvorgaben")}</div>
            <div className="text-sm">{tender.leistungswertvorgaben ? t("yes") : t("no")}</div>
          </div>
          {tender.mindestanforderungen && (
            <div>
              <div className="text-sm font-medium">{t("tender.mindestanforderungen", "Mindestanforderungen")}</div>
              <div className="text-sm whitespace-pre-wrap">{tender.mindestanforderungen}</div>
            </div>
          )}
          {tender.evaluationScheme && (
            <div>
              <div className="text-sm font-medium">{t("tender.evaluationScheme")}</div>
              <div className="text-sm whitespace-pre-wrap">{tender.evaluationScheme}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
