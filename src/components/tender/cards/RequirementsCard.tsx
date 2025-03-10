
import { Tender, Zertifikat } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Edit, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { displayZertifikate } from "../utils/DisplayFormatters";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface RequirementsCardProps {
  tender: Tender;
  onUpdateTender?: (updates: Partial<Tender>) => Promise<void>;
}

export function RequirementsCard({ tender, onUpdateTender }: RequirementsCardProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [zertifikate, setZertifikate] = useState<Zertifikat[]>(tender.erforderlicheZertifikate || []);
  const [conceptRequired, setConceptRequired] = useState(tender.conceptRequired || false);
  const [tariflohn, setTariflohn] = useState(tender.tariflohn || false);
  const [qualitaetskontrollen, setQualitaetskontrollen] = useState(tender.qualitaetskontrollen || false);
  const [stundenvorgaben, setStundenvorgaben] = useState(tender.stundenvorgaben || "");
  const [leistungswertvorgaben, setLeistungswertvorgaben] = useState(tender.leistungswertvorgaben || false);
  const [mindestanforderungen, setMindestanforderungen] = useState(tender.mindestanforderungen || "");
  const [evaluationScheme, setEvaluationScheme] = useState(tender.evaluationScheme || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset local state when tender prop changes
  useEffect(() => {
    setZertifikate(tender.erforderlicheZertifikate || []);
    setConceptRequired(tender.conceptRequired || false);
    setTariflohn(tender.tariflohn || false);
    setQualitaetskontrollen(tender.qualitaetskontrollen || false);
    setStundenvorgaben(tender.stundenvorgaben || "");
    setLeistungswertvorgaben(tender.leistungswertvorgaben || false);
    setMindestanforderungen(tender.mindestanforderungen || "");
    setEvaluationScheme(tender.evaluationScheme || "");
  }, [tender]);

  const handleSave = async () => {
    if (!onUpdateTender) return;
    
    setIsSubmitting(true);
    try {
      const updates: Partial<Tender> = {
        erforderlicheZertifikate: zertifikate,
        conceptRequired,
        tariflohn,
        qualitaetskontrollen,
        stundenvorgaben,
        leistungswertvorgaben,
        mindestanforderungen,
        evaluationScheme
      };
      
      await onUpdateTender(updates);
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
    setZertifikate(tender.erforderlicheZertifikate || []);
    setConceptRequired(tender.conceptRequired || false);
    setTariflohn(tender.tariflohn || false);
    setQualitaetskontrollen(tender.qualitaetskontrollen || false);
    setStundenvorgaben(tender.stundenvorgaben || "");
    setLeistungswertvorgaben(tender.leistungswertvorgaben || false);
    setMindestanforderungen(tender.mindestanforderungen || "");
    setEvaluationScheme(tender.evaluationScheme || "");
    setEditing(false);
  };

  const toggleZertifikat = (zertifikat: Zertifikat) => {
    if (zertifikate.includes(zertifikat)) {
      setZertifikate(zertifikate.filter(z => z !== zertifikat));
    } else {
      setZertifikate([...zertifikate, zertifikat]);
    }
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          <CardTitle>{t("tenderDetails.requirements", "Anforderungen")}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {!editing ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setEditing(true)} 
              className="h-8 w-8"
              title={t("edit", "Bearbeiten")}
              disabled={!onUpdateTender}
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
            <div className="text-sm font-medium">{t("tender.erforderlicheZertifikate", "Erforderliche Zertifikate")}</div>
            {editing ? (
              <div className="space-y-2 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="iso9001" 
                    checked={zertifikate.includes("din_iso_9001")}
                    onCheckedChange={() => toggleZertifikat("din_iso_9001")}
                  />
                  <Label htmlFor="iso9001">ISO 9001</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="iso14001" 
                    checked={zertifikate.includes("din_iso_14001")}
                    onCheckedChange={() => toggleZertifikat("din_iso_14001")}
                  />
                  <Label htmlFor="iso14001">ISO 14001</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="dinspec" 
                    checked={zertifikate.includes("din_iso_45001")}
                    onCheckedChange={() => toggleZertifikat("din_iso_45001")}
                  />
                  <Label htmlFor="dinspec">DIN SPEC</Label>
                </div>
              </div>
            ) : (
              <div className="text-sm">{displayZertifikate(tender.erforderlicheZertifikate)}</div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium">{t("tender.conceptRequired")}</div>
            {editing ? (
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  checked={conceptRequired}
                  onCheckedChange={setConceptRequired}
                  id="conceptRequired"
                />
                <Label htmlFor="conceptRequired">
                  {conceptRequired ? t("yes") : t("no")}
                </Label>
              </div>
            ) : (
              <div className="text-sm">{tender.conceptRequired ? t("yes") : t("no")}</div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium">{t("tender.tariflohn", "Tariflohn")}</div>
            {editing ? (
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  checked={tariflohn}
                  onCheckedChange={setTariflohn}
                  id="tariflohn"
                />
                <Label htmlFor="tariflohn">
                  {tariflohn ? t("yes") : t("no")}
                </Label>
              </div>
            ) : (
              <div className="text-sm">{tender.tariflohn ? t("yes") : t("no")}</div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium">{t("tender.qualitaetskontrollen", "Qualitätskontrollen")}</div>
            {editing ? (
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  checked={qualitaetskontrollen}
                  onCheckedChange={setQualitaetskontrollen}
                  id="qualitaetskontrollen"
                />
                <Label htmlFor="qualitaetskontrollen">
                  {qualitaetskontrollen ? t("yes") : t("no")}
                </Label>
              </div>
            ) : (
              <div className="text-sm">{tender.qualitaetskontrollen ? t("yes") : t("no")}</div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium">{t("tender.stundenvorgaben", "Stundenvorgaben")}</div>
            {editing ? (
              <Textarea 
                value={stundenvorgaben} 
                onChange={(e) => setStundenvorgaben(e.target.value)}
                className="mt-1"
                rows={2}
              />
            ) : (
              tender.stundenvorgaben && <div className="text-sm">{tender.stundenvorgaben}</div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium">{t("tender.leistungswertvorgaben", "Leistungswertvorgaben")}</div>
            {editing ? (
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  checked={leistungswertvorgaben}
                  onCheckedChange={setLeistungswertvorgaben}
                  id="leistungswertvorgaben"
                />
                <Label htmlFor="leistungswertvorgaben">
                  {leistungswertvorgaben ? t("yes") : t("no")}
                </Label>
              </div>
            ) : (
              <div className="text-sm">{tender.leistungswertvorgaben ? t("yes") : t("no")}</div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium">{t("tender.mindestanforderungen", "Mindestanforderungen")}</div>
            {editing ? (
              <Textarea 
                value={mindestanforderungen} 
                onChange={(e) => setMindestanforderungen(e.target.value)}
                className="mt-1"
                rows={3}
              />
            ) : (
              tender.mindestanforderungen && <div className="text-sm whitespace-pre-wrap">{tender.mindestanforderungen}</div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium">{t("tender.evaluationScheme")}</div>
            {editing ? (
              <Textarea 
                value={evaluationScheme} 
                onChange={(e) => setEvaluationScheme(e.target.value)}
                className="mt-1"
                rows={3}
              />
            ) : (
              tender.evaluationScheme && <div className="text-sm whitespace-pre-wrap">{tender.evaluationScheme}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
