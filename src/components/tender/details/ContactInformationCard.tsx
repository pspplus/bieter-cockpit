
import { Tender } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ContactInformationCardProps {
  tender: Tender;
}

export function ContactInformationCard({ tender }: ContactInformationCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('tenderDetails.contactInformation')}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {tender.contactPerson ? (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <dt className="text-tender-500">{t('tender.contactPerson')}</dt>
            <dd className="font-medium flex items-center gap-1.5">
              <User className="h-4 w-4 text-tender-400" />
              {tender.contactPerson}
            </dd>
            
            {tender.contactEmail && (
              <>
                <dt className="text-tender-500">{t('tenderDetails.email')}</dt>
                <dd className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-tender-400" />
                  <a 
                    href={`mailto:${tender.contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {tender.contactEmail}
                  </a>
                </dd>
              </>
            )}
            
            {tender.contactPhone && (
              <>
                <dt className="text-tender-500">{t('tenderDetails.phone')}</dt>
                <dd className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-tender-400" />
                  <a 
                    href={`tel:${tender.contactPhone}`}
                    className="text-primary hover:underline"
                  >
                    {tender.contactPhone}
                  </a>
                </dd>
              </>
            )}
          </dl>
        ) : (
          <p className="text-tender-500 italic">{t('tenderDetails.noContactInfo')}</p>
        )}
      </CardContent>
    </Card>
  );
}
