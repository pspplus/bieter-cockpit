
import { format } from "date-fns";
import { Tender, Vertragsart, Zertifikat } from "@/types/tender";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, FileText, User, Building, ClipboardCheck, CreditCard, BriefcaseBusiness, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { statusDisplayMap } from "@/utils/statusUtils";

interface TenderDetailsProps {
  tender: Tender;
  onOpenDetailsDialog?: () => void;
  onOpenContactDialog?: () => void;
}

const displayZertifikate = (zertifikate?: Zertifikat[]) => {
  if (!zertifikate || zertifikate.length === 0) return "-";
  
  return zertifikate.map(zertifikat => {
    switch(zertifikat) {
      case 'din_iso_9001': return "DIN ISO 9001";
      case 'din_iso_14001': return "DIN ISO 14001";
      case 'din_iso_45001': return "DIN ISO 45001";
      default: return zertifikat;
    }
  }).join(", ");
};

const displayObjektarten = (objektarten?: string[]) => {
  if (!objektarten || objektarten.length === 0) return "-";
  
  return objektarten.map(objektart => {
    switch(objektart) {
      case 'grundschule': return "Grundschule";
      case 'kindergarten': return "Kindergarten";
      case 'buero': return "Büro";
      default: return objektart;
    }
  }).join(", ");
};

const displayVertragsart = (vertragsart?: Vertragsart) => {
  if (!vertragsart) return "-";
  
  switch(vertragsart) {
    case 'werkvertrag': return "Werkvertrag";
    case 'dienstleistungsvertrag': return "Dienstleistungsvertrag";
    case 'mischvertrag': return "Mischvertrag";
    default: return vertragsart;
  }
};

export function TenderDetails({ tender, onOpenDetailsDialog, onOpenContactDialog }: TenderDetailsProps) {
  const { t } = useTranslation();
  const formattedCreatedAt = format(new Date(tender.createdAt), "PP");
  const formattedDueDate = format(new Date(tender.dueDate), "PP");
  const formattedBindingPeriodDate = tender.bindingPeriodDate 
    ? format(new Date(tender.bindingPeriodDate), "PP") 
    : null;

  return (
    <div className="space-y-6">
      {/* Information Cards in a Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basisinformationen */}
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

        {/* Hauptinformationen */}
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

        {/* Objektinformationen Card */}
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
        
        {/* Anforderungen Card */}
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

        {/* Kontakt & Vergabe Card */}
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
        
        {/* Notizen Card */}
        {tender.notes && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>{t("tender.notes", "Notizen")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{tender.notes}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
