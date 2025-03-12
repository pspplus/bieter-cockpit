
import { Tender, Objektart } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Edit, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { displayObjektarten } from "../utils/DisplayFormatters";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ObjectInfoCardProps {
  tender: Tender;
  onUpdateTender: (updates: Partial<Tender>) => Promise<void>;
}

export function ObjectInfoCard({ tender, onUpdateTender }: ObjectInfoCardProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [location, setLocation] = useState(tender.location || "");
  const [objektart, setObjektart] = useState<Objektart>(tender.objektart?.[0] || "");
  const [objektbesichtigungErforderlich, setObjektbesichtigungErforderlich] = useState(tender.objektbesichtigungErforderlich || false);
  const [raumgruppentabelle, setRaumgruppentabelle] = useState(tender.raumgruppentabelle || false);
  const [waschmaschine, setWaschmaschine] = useState(tender.waschmaschine || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLocation(tender.location || "");
    setObjektart(tender.objektart?.[0] || "");
    setObjektbesichtigungErforderlich(tender.objektbesichtigungErforderlich || false);
    setRaumgruppentabelle(tender.raumgruppentabelle || false);
    setWaschmaschine(tender.waschmaschine || false);
  }, [tender]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateTender({
        location,
        objektart: objektart ? [objektart] : [],
        objektbesichtigungErforderlich,
        raumgruppentabelle,
        waschmaschine
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
    setLocation(tender.location || "");
    setObjektart(tender.objektart?.[0] || "");
    setObjektbesichtigungErforderlich(tender.objektbesichtigungErforderlich || false);
    setRaumgruppentabelle(tender.raumgruppentabelle || false);
    setWaschmaschine(tender.waschmaschine || false);
    setEditing(false);
  };

  const getObjektartDisplayName = (art: Objektart): string => {
    switch(art) {
      case "grundschule": return "Grundschule";
      case "kindergarten": return "Kindergarten";
      case "buero": return "Büro";
      default: return "-";
    }
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <CardTitle>{t("tenderDetails.objectInformation", "Objektinformationen")}</CardTitle>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="text-sm font-medium">{t("tender.location")}</div>
            {editing ? (
              <Input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="text-sm">{tender.location || "-"}</div>
            )}
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">{t("tender.objektart", "Objektart")}</div>
            {editing ? (
              <Select 
                value={objektart} 
                onValueChange={(value: Objektart) => setObjektart(value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Objektart auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grundschule">Grundschule</SelectItem>
                  <SelectItem value="kindergarten">Kindergarten</SelectItem>
                  <SelectItem value="buero">Büro</SelectItem>
                  <SelectItem value="">Keine Angabe</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm">{displayObjektarten(tender.objektart)}</div>
            )}
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">{t("tender.objektbesichtigung", "Objektbesichtigung erforderlich")}</div>
            {editing ? (
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  checked={objektbesichtigungErforderlich}
                  onCheckedChange={setObjektbesichtigungErforderlich}
                  id="objektbesichtigung"
                />
                <Label htmlFor="objektbesichtigung">
                  {objektbesichtigungErforderlich ? t("yes") : t("no")}
                </Label>
              </div>
            ) : (
              <div className="text-sm">{tender.objektbesichtigungErforderlich ? t("yes") : t("no")}</div>
            )}
          </div>
          
          {tender.jahresreinigungsflaeche && (
            <div>
              <div className="text-sm font-medium">{t("tender.jahresreinigungsflaeche", "Jahresreinigungsfläche")}</div>
              <div className="text-sm">{tender.jahresreinigungsflaeche.toLocaleString()} m²</div>
            </div>
          )}
          
          <div>
            <div className="text-sm font-medium mb-1">{t("tender.raumgruppentabelle", "Raumgruppentabelle")}</div>
            {editing ? (
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  checked={raumgruppentabelle}
                  onCheckedChange={setRaumgruppentabelle}
                  id="raumgruppentabelle"
                />
                <Label htmlFor="raumgruppentabelle">
                  {raumgruppentabelle ? t("yes") : t("no")}
                </Label>
              </div>
            ) : (
              <div className="text-sm">{tender.raumgruppentabelle ? t("yes") : t("no")}</div>
            )}
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">{t("tender.waschmaschine", "Waschmaschine")}</div>
            {editing ? (
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  checked={waschmaschine}
                  onCheckedChange={setWaschmaschine}
                  id="waschmaschine"
                />
                <Label htmlFor="waschmaschine">
                  {waschmaschine ? t("yes") : t("no")}
                </Label>
              </div>
            ) : (
              <div className="text-sm">{tender.waschmaschine ? t("yes") : t("no")}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
