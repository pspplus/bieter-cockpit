
import { Tender, Objektart } from "@/types/tender";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

interface ObjectInfoSectionProps {
  formData: {
    location: string;
    jahresreinigungsflaeche: string;
    objektart: Objektart[];
    objektbesichtigungErforderlich: boolean;
    raumgruppentabelle: boolean;
    waschmaschine: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBooleanChange: (name: string, value: boolean) => void;
  handleObjektartChange: (objektart: Objektart, checked: boolean) => void;
}

export function ObjectInfoSection({ 
  formData, 
  handleChange, 
  handleBooleanChange,
  handleObjektartChange 
}: ObjectInfoSectionProps) {
  const { t } = useTranslation();

  const objektartOptions: Objektart[] = ['grundschule', 'kindergarten', 'buero', 'keine_angabe'];

  const displayObjektart = (objektart: Objektart) => {
    switch(objektart) {
      case 'grundschule': return "Grundschule";
      case 'kindergarten': return "Kindergarten";
      case 'buero': return "Büro";
      default: return "-";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">{t("tender.location")}</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jahresreinigungsflaeche">
            {t("tender.jahresreinigungsflaeche", "Jahresreinigungsfläche (m²)")}
          </Label>
          <Input
            id="jahresreinigungsflaeche"
            name="jahresreinigungsflaeche"
            type="number"
            value={formData.jahresreinigungsflaeche}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("tender.objektart", "Objektart")}</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {objektartOptions.filter(option => option !== "keine_angabe").map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`objektart-${option}`}
                checked={formData.objektart.includes(option)}
                onCheckedChange={(checked) => 
                  handleObjektartChange(option, checked as boolean)
                }
              />
              <Label 
                htmlFor={`objektart-${option}`}
                className="cursor-pointer"
              >
                {displayObjektart(option)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="objektbesichtigungErforderlich"
            checked={formData.objektbesichtigungErforderlich}
            onCheckedChange={(checked) => 
              handleBooleanChange("objektbesichtigungErforderlich", checked as boolean)
            }
          />
          <Label htmlFor="objektbesichtigungErforderlich" className="cursor-pointer">
            {t("tender.objektbesichtigung", "Objektbesichtigung erforderlich")}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="raumgruppentabelle"
            checked={formData.raumgruppentabelle}
            onCheckedChange={(checked) => 
              handleBooleanChange("raumgruppentabelle", checked as boolean)
            }
          />
          <Label htmlFor="raumgruppentabelle" className="cursor-pointer">
            {t("tender.raumgruppentabelle", "Raumgruppentabelle")}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="waschmaschine"
            checked={formData.waschmaschine}
            onCheckedChange={(checked) => 
              handleBooleanChange("waschmaschine", checked as boolean)
            }
          />
          <Label htmlFor="waschmaschine" className="cursor-pointer">
            {t("tender.waschmaschine", "Waschmaschine")}
          </Label>
        </div>
      </div>
    </div>
  );
}
