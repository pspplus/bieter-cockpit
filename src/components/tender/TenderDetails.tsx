import { format } from "date-fns";
import { Tender, Vertragsart, Zertifikat } from "@/types/tender";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MilestoneProcess } from "@/components/tender/MilestoneProcess";
import { FileText, User, Building, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { statusDisplayMap } from "@/utils/statusUtils";
import { InlineEdit } from "./InlineEdit";
import { toast } from "sonner";
import { useTender } from "@/hooks/useTender";

interface TenderDetailsProps {
  tender: Tender;
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

export function TenderDetails({ tender }: TenderDetailsProps) {
  const { t } = useTranslation();
  const { updateTender } = useTender();
  const formattedCreatedAt = format(new Date(tender.createdAt), "PP");
  const formattedDueDate = format(new Date(tender.dueDate), "PP");
  const formattedBindingPeriodDate = tender.bindingPeriodDate 
    ? format(new Date(tender.bindingPeriodDate), "PP") 
    : null;

  const handleFieldUpdate = async (field: keyof Tender, value: any) => {
    try {
      await updateTender(tender.id, { [field]: value });
      toast.success(t("notifications.fieldUpdated"));
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error(t("errorMessages.couldNotUpdateField"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Card - Keeping it unchanged at the top */}
      <Card className="min-h-[180px]">
        <CardHeader className="pb-3">
          <CardTitle>{t("milestones.progress")}</CardTitle>
        </CardHeader>
        <CardContent>
          <MilestoneProcess milestones={tender.milestones} tenderId={tender.id} />
        </CardContent>
      </Card>

      {/* Information Cards in a 2x2 Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Hauptinformationen */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>{t("tenderDetails.mainInformation")}</CardTitle>
                <CardDescription>{t("tenderDetails.created")}: {formattedCreatedAt}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="text-sm font-medium">{t("tender.title")}</div>
                <div className="text-sm mt-1">{tender.title}</div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("tender.externalReference")}</div>
                <div className="text-sm mt-1">
                  <InlineEdit
                    value={tender.externalReference}
                    onSave={(value) => handleFieldUpdate("externalReference", value)}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("tender.client")}</div>
                <div className="text-sm mt-1">
                  <InlineEdit
                    value={tender.client || ""}
                    onSave={(value) => handleFieldUpdate("client", value)}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("Status")}</div>
                <div className="text-sm mt-1">
                  <Badge variant="outline">{statusDisplayMap[tender.status]}</Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("tender.description")}</div>
                <div className="text-sm mt-1">
                  <InlineEdit
                    value={tender.description || ""}
                    onSave={(value) => handleFieldUpdate("description", value)}
                    isTextArea
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objektinformationen Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle>{t("tenderDetails.objectInformation")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="text-sm font-medium">{t("tender.location")}</div>
                <div className="text-sm mt-1">
                  <InlineEdit
                    value={tender.location || ""}
                    onSave={(value) => handleFieldUpdate("location", value)}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("tender.jahresreinigungsflaeche")}</div>
                <div className="text-sm mt-1">
                  <InlineEdit
                    value={tender.jahresreinigungsflaeche?.toString() || ""}
                    onSave={(value) => handleFieldUpdate("jahresreinigungsflaeche", parseFloat(value))}
                  />
                </div>
              </div>
              {/* Add other object information fields with InlineEdit */}
            </div>
          </CardContent>
        </Card>
        
        {/* Anforderungen Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <CardTitle>{t("tenderDetails.requirements")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="text-sm font-medium">{t("tender.mindestanforderungen")}</div>
                <div className="text-sm mt-1">
                  <InlineEdit
                    value={tender.mindestanforderungen || ""}
                    onSave={(value) => handleFieldUpdate("mindestanforderungen", value)}
                    isTextArea
                  />
                </div>
              </div>
              {/* Add other requirements fields with InlineEdit */}
            </div>
          </CardContent>
        </Card>

        {/* Kontakt & Vergabe Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>{t("tenderDetails.contactVergabe")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="text-sm font-medium">{t("tender.contactPerson")}</div>
                <div className="text-sm mt-1">
                  <InlineEdit
                    value={tender.contactPerson || ""}
                    onSave={(value) => handleFieldUpdate("contactPerson", value)}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("tender.contactEmail")}</div>
                <div className="text-sm mt-1">
                  <InlineEdit
                    value={tender.contactEmail || ""}
                    onSave={(value) => handleFieldUpdate("contactEmail", value)}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("tender.contactPhone")}</div>
                <div className="text-sm mt-1">
                  <InlineEdit
                    value={tender.contactPhone || ""}
                    onSave={(value) => handleFieldUpdate("contactPhone", value)}
                  />
                </div>
              </div>
              {/* Add other contact fields with InlineEdit */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
