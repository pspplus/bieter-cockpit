
import { format } from "date-fns";
import { Tender } from "@/types/tender";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BaseInfoCardProps {
  tender: Tender;
}

export function BaseInfoCard({ tender }: BaseInfoCardProps) {
  const { t } = useTranslation();
  const formattedCreatedAt = format(new Date(tender.createdAt), "PP");
  const formattedDueDate = format(new Date(tender.dueDate), "PP");
  const formattedBindingPeriodDate = tender.bindingPeriodDate 
    ? format(new Date(tender.bindingPeriodDate), "PP") 
    : null;

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>{t("tenderDetails.baseInformation", "Basisinformationen")}</CardTitle>
            <CardDescription>{t("tenderDetails.created")}: {formattedCreatedAt}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">{t("tender.internalReference")}</div>
            <div className="text-sm">{tender.internalReference}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tenderDetails.updated")}</div>
            <div className="text-sm">{format(new Date(tender.updatedAt), "PP")}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tenderDetails.due")}</div>
            <div className="text-sm">{formattedDueDate}</div>
          </div>
          {formattedBindingPeriodDate && (
            <div>
              <div className="text-sm font-medium">{t("tender.bindingPeriodDate")}</div>
              <div className="text-sm">{formattedBindingPeriodDate}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
