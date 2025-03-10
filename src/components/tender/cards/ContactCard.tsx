
import { Tender } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ContactCardProps {
  tender: Tender;
  onOpenContactDialog?: () => void;
}

export function ContactCard({ tender, onOpenContactDialog }: ContactCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>{t("tenderDetails.contactVergabe", "Kontakt & Vergabe")}</CardTitle>
        </div>
        {onOpenContactDialog && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenContactDialog}
            className="h-8 w-8"
            title={t("tenderDetails.editContact", "Kontaktinformationen bearbeiten")}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {tender.contactPerson && (
            <div>
              <div className="text-sm font-medium">{t("tender.contactPerson")}</div>
              <div className="text-sm">{tender.contactPerson}</div>
            </div>
          )}
          {tender.contactEmail && (
            <div>
              <div className="text-sm font-medium">{t("tenderDetails.email")}</div>
              <div className="text-sm">
                <a href={`mailto:${tender.contactEmail}`} className="text-primary hover:underline">
                  {tender.contactEmail}
                </a>
              </div>
            </div>
          )}
          {tender.contactPhone && (
            <div>
              <div className="text-sm font-medium">{t("tenderDetails.phone")}</div>
              <div className="text-sm">
                <a href={`tel:${tender.contactPhone}`} className="text-primary hover:underline">
                  {tender.contactPhone}
                </a>
              </div>
            </div>
          )}
          {tender.beraterVergabestelle && (
            <div>
              <div className="text-sm font-medium">{t("tender.beraterVergabestelle", "Berater Vergabestelle")}</div>
              <div className="text-sm">{tender.beraterVergabestelle}</div>
            </div>
          )}
          {tender.budget && (
            <div>
              <div className="text-sm font-medium">{t("tender.budget")}</div>
              <div className="text-sm">{tender.budget.toLocaleString()} €</div>
            </div>
          )}
          {!tender.contactPerson && !tender.contactEmail && !tender.contactPhone && !tender.beraterVergabestelle && !tender.budget && (
            <div className="text-sm text-muted-foreground">
              {t("tenderDetails.noContactInfo")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
