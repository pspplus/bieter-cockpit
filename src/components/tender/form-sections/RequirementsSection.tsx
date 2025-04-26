
import { Tender, Zertifikat } from "@/types/tender";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface RequirementsSectionProps {
  formData: {
    erforderlicheZertifikate: Zertifikat[];
    mindestanforderungen: string;
    evaluationScheme: string;
    conceptRequired: boolean;
    tariflohn: boolean;
    qualitaetskontrollen: boolean;
    leistungswertvorgaben: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleBooleanChange: (name: string, value: boolean) => void;
  handleZertifikatChange: (zertifikat: Zertifikat, checked: boolean) => void;
}

export function RequirementsSection({ 
  formData, 
  handleChange, 
  handleBooleanChange,
  handleZertifikatChange 
}: RequirementsSectionProps) {
  const { t } = useTranslation();

  const zertifikatOptions: Zertifikat[] = ['din_iso_9001', 'din_iso_14001', 'din_iso_45001'];

  const displayZertifikat = (zertifikat: Zertifikat) => {
    switch(zertifikat) {
      case 'din_iso_9001': return "DIN ISO 9001";
      case 'din_iso_14001': return "DIN ISO 14001";
      case 'din_iso_45001': return "DIN ISO 45001";
      default: return zertifikat;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t("tender.erforderlicheZertifikate", "Erforderliche Zertifikate")}</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {zertifikatOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`zertifikat-${option}`}
                checked={formData.erforderlicheZertifikate.includes(option)}
                onCheckedChange={(checked) => 
                  handleZertifikatChange(option, checked as boolean)
                }
              />
              <Label 
                htmlFor={`zertifikat-${option}`}
                className="cursor-pointer"
              >
                {displayZertifikat(option)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mindestanforderungen">
          {t("tender.mindestanforderungen", "Mindestanforderungen")}
        </Label>
        <Textarea
          id="mindestanforderungen"
          name="mindestanforderungen"
          value={formData.mindestanforderungen}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="evaluationScheme">{t("tender.evaluationScheme")}</Label>
        <Textarea
          id="evaluationScheme"
          name="evaluationScheme"
          value={formData.evaluationScheme}
          onChange={handleChange}
          rows={2}
          placeholder="Details zum Wertungsschema eintragen"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="conceptRequired"
            checked={formData.conceptRequired}
            onCheckedChange={(checked) => 
              handleBooleanChange("conceptRequired", checked as boolean)
            }
          />
          <Label htmlFor="conceptRequired" className="cursor-pointer">
            {t("tender.conceptRequired")}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="tariflohn"
            checked={formData.tariflohn}
            onCheckedChange={(checked) => 
              handleBooleanChange("tariflohn", checked as boolean)
            }
          />
          <Label htmlFor="tariflohn" className="cursor-pointer">
            {t("tender.tariflohn", "Tariflohn")}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="qualitaetskontrollen"
            checked={formData.qualitaetskontrollen}
            onCheckedChange={(checked) => 
              handleBooleanChange("qualitaetskontrollen", checked as boolean)
            }
          />
          <Label htmlFor="qualitaetskontrollen" className="cursor-pointer">
            {t("tender.qualitaetskontrollen", "Qualitätskontrollen")}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="leistungswertvorgaben"
            checked={formData.leistungswertvorgaben}
            onCheckedChange={(checked) => 
              handleBooleanChange("leistungswertvorgaben", checked as boolean)
            }
          />
          <Label htmlFor="leistungswertvorgaben" className="cursor-pointer">
            {t("tender.leistungswertvorgaben", "Leistungswertvorgaben")}
          </Label>
        </div>
      </div>
    </div>
  );
}
