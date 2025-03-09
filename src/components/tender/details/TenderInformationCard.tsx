
import { Tender } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, CreditCard, MapPin, ClipboardCheck, Award } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface TenderInformationCardProps {
  tender: Tender;
}

export function TenderInformationCard({ tender }: TenderInformationCardProps) {
  const { t } = useTranslation();
  
  // Format dates
  const createdAtFormatted = format(new Date(tender.createdAt), "MMMM d, yyyy");
  const bindingPeriodDateFormatted = tender.bindingPeriodDate 
    ? format(new Date(tender.bindingPeriodDate), "MMMM d, yyyy") 
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('tenderDetails.tenderInformation')}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <dt className="text-tender-500">{t('tender.client')}</dt>
          <dd className="font-medium flex items-center gap-1.5">
            <Building className="h-4 w-4 text-tender-400" />
            {tender.client}
          </dd>
          
          <dt className="text-tender-500">{t('tenderDetails.created')}</dt>
          <dd>{createdAtFormatted}</dd>
          
          {bindingPeriodDateFormatted && (
            <>
              <dt className="text-tender-500">{t('tender.bindingPeriodDate', 'Bindefrist')}</dt>
              <dd className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-tender-400" />
                {bindingPeriodDateFormatted}
              </dd>
            </>
          )}
          
          {tender.location && (
            <>
              <dt className="text-tender-500">{t('tender.location')}</dt>
              <dd className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-tender-400" />
                {tender.location}
              </dd>
            </>
          )}
          
          {tender.budget && (
            <>
              <dt className="text-tender-500">{t('tender.budget')}</dt>
              <dd className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-tender-400" />
                ${tender.budget.toLocaleString()}
              </dd>
            </>
          )}
          
          {tender.conceptRequired !== undefined && (
            <>
              <dt className="text-tender-500">{t('tender.conceptRequired', 'Konzept erforderlich')}</dt>
              <dd className="flex items-center gap-1.5">
                <ClipboardCheck className="h-4 w-4 text-tender-400" />
                {tender.conceptRequired 
                  ? t('general.yes', 'Ja') 
                  : t('general.no', 'Nein')}
              </dd>
            </>
          )}
        </dl>
        
        {tender.description && (
          <div className="mt-4 pt-4 border-t border-tender-100">
            <h4 className="font-medium mb-2">{t('tender.description')}</h4>
            <p className="text-tender-600">{tender.description}</p>
          </div>
        )}
        
        {tender.evaluationScheme && (
          <div className="mt-4 pt-4 border-t border-tender-100">
            <h4 className="font-medium mb-2">{t('tender.evaluationScheme', 'Wertungsschema')}</h4>
            <div className="text-tender-600 bg-tender-50 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <Award className="h-4 w-4 mt-1 text-tender-400" />
                <p className="whitespace-pre-line">{tender.evaluationScheme}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
