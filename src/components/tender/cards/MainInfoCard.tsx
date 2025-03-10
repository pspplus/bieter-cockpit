
import { Tender, Vertragsart } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, FileText, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { displayVertragsart } from "../utils/DisplayFormatters";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MainInfoCardProps {
  tender: Tender;
  onOpenDetailsDialog?: () => void;
  onUpdateTender: (updates: Partial<Tender>) => Promise<void>;
}

export function MainInfoCard({ tender, onOpenDetailsDialog, onUpdateTender }: MainInfoCardProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(tender.title);
  const [externalReference, setExternalReference] = useState(tender.externalReference);
  const [client, setClient] = useState(tender.client);
  const [vertragsart, setVertragsart] = useState<Vertragsart>(tender.vertragsart || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateTender({
        title,
        externalReference,
        client,
        vertragsart
      });
      setEditing(false);
      toast.success(t("notifications.tenderUpdated", "Änderungen gespeichert"));
    } catch (error) {
      console.error("Error updating tender:", error);
      toast.error(t("errorMessages.couldNotUpdateTender", "Fehler beim Speichern"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle(tender.title);
    setExternalReference(tender.externalReference);
    setClient(tender.client);
    setVertragsart(tender.vertragsart || "");
    setEditing(false);
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>{t("tenderDetails.mainInformation", "Hauptinformationen")}</CardTitle>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setEditing(true)} 
              className="h-8 w-8"
              title={t("edit", "Bearbeiten")}
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancel}
                className="h-8 w-8"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSave}
                className="h-8 w-8"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
              </Button>
            </>
          )}
          {onOpenDetailsDialog && !editing && (
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">{t("tender.title")}</div>
            {editing ? (
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="text-sm">{tender.title}</div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.externalReference")}</div>
            {editing ? (
              <Input 
                value={externalReference} 
                onChange={(e) => setExternalReference(e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="text-sm">{tender.externalReference}</div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.client")}</div>
            {editing ? (
              <Input 
                value={client} 
                onChange={(e) => setClient(e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="text-sm">{tender.client}</div>
            )}
          </div>
          {tender.vergabeplattform && !editing && (
            <div>
              <div className="text-sm font-medium">{t("tender.vergabeplattform", "Vergabeplattform")}</div>
              <div className="text-sm">{tender.vergabeplattform}</div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium">{t("tender.vertragsart", "Vertragsart")}</div>
            {editing ? (
              <Select
                value={vertragsart}
                onValueChange={(value) => setVertragsart(value as Vertragsart)}
                className="mt-1"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("tender.selectVertragsart", "Vertragsart auswählen")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="werkvertrag">Werkvertrag</SelectItem>
                  <SelectItem value="dienstleistungsvertrag">Dienstleistungsvertrag</SelectItem>
                  <SelectItem value="mischvertrag">Mischvertrag</SelectItem>
                  <SelectItem value="">-</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm">{displayVertragsart(tender.vertragsart)}</div>
            )}
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
