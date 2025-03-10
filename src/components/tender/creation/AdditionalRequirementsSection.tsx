
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AdditionalRequirementsSectionProps {
  formData: {
    jahresreinigungsflaeche: string;
    stundenvorgaben: string;
    leistungswertvorgaben: boolean;
    waschmaschine: boolean;
    tariflohn: boolean;
    qualitaetskontrollen: boolean;
    raumgruppentabelle: boolean;
  };
  setFormData: (data: any) => void;
}

export function AdditionalRequirementsSection({ formData, setFormData }: AdditionalRequirementsSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jahresreinigungsflaeche">Jahresreinigungsfläche</Label>
          <Input 
            id="jahresreinigungsflaeche" 
            type="number"
            value={formData.jahresreinigungsflaeche} 
            onChange={e => setFormData(prev => ({ ...prev, jahresreinigungsflaeche: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stundenvorgaben">Stundenvorgaben</Label>
          <Input 
            id="stundenvorgaben" 
            value={formData.stundenvorgaben} 
            onChange={e => setFormData(prev => ({ ...prev, stundenvorgaben: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.leistungswertvorgaben}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, leistungswertvorgaben: checked }))}
          />
          <Label>Leistungswertvorgaben</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.waschmaschine}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, waschmaschine: checked }))}
          />
          <Label>Waschmaschine</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.tariflohn}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, tariflohn: checked }))}
          />
          <Label>Tariflohn</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.qualitaetskontrollen}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, qualitaetskontrollen: checked }))}
          />
          <Label>Qualitätskontrollen</Label>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.raumgruppentabelle}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, raumgruppentabelle: checked }))}
        />
        <Label>Raumgruppentabelle</Label>
      </div>
    </div>
  );
}
