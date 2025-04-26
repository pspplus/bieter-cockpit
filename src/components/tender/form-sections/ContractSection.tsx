
import { Tender, Vertragsart } from "@/types/tender";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface ContractSectionProps {
  formData: {
    vertragsart: Vertragsart;
    budget?: string;
    stundenvorgaben: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function ContractSection({ formData, handleChange, handleSelectChange }: ContractSectionProps) {
  const { t } = useTranslation();

  const vertragsartOptions: Vertragsart[] = ['werkvertrag', 'dienstleistungsvertrag', 'mischvertrag', 'keine_angabe'];

  const displayVertragsart = (vertragsart: Vertragsart) => {
    switch(vertragsart) {
      case 'werkvertrag': return "Werkvertrag";
      case 'dienstleistungsvertrag': return "Dienstleistungsvertrag";
      case 'mischvertrag': return "Mischvertrag";
      default: return "-";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="vertragsart">{t("tender.vertragsart", "Vertragsart")}</Label>
        <Select 
          name="vertragsart" 
          value={formData.vertragsart} 
          onValueChange={(value) => handleSelectChange("vertragsart", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vertragsart auswählen" />
          </SelectTrigger>
          <SelectContent>
            {vertragsartOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === 'keine_angabe' ? "Keine Angabe" : displayVertragsart(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stundenvorgaben">{t("tender.stundenvorgaben", "Stundenvorgaben")}</Label>
        <Input
          id="stundenvorgaben"
          name="stundenvorgaben"
          value={formData.stundenvorgaben}
          onChange={handleChange}
          placeholder="z.B. 40h/Woche"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">{t("tender.budget")}</Label>
        <Input
          id="budget"
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          placeholder="0"
        />
      </div>
    </div>
  );
}
