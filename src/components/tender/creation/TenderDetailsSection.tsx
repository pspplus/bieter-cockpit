
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Vertragsart, Objektart, Zertifikat } from "@/types/tender";

interface TenderDetailsSectionProps {
  formData: {
    vergabeplattform: string;
    mindestanforderungen: string;
    erforderlicheZertifikate: Zertifikat[];
    objektbesichtigungErforderlich: boolean;
    objektart: Objektart[];
    vertragsart: Vertragsart;
    beraterVergabestelle: string;
  };
  setFormData: (data: any) => void;
}

export function TenderDetailsSection({ formData, setFormData }: TenderDetailsSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vergabeplattform">Vergabeplattform</Label>
          <Input 
            id="vergabeplattform" 
            value={formData.vergabeplattform} 
            onChange={e => setFormData(prev => ({ ...prev, vergabeplattform: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="beraterVergabestelle">Berater Vergabestelle</Label>
          <Input 
            id="beraterVergabestelle" 
            value={formData.beraterVergabestelle} 
            onChange={e => setFormData(prev => ({ ...prev, beraterVergabestelle: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mindestanforderungen">Mindestanforderungen</Label>
        <Textarea 
          id="mindestanforderungen" 
          value={formData.mindestanforderungen} 
          onChange={e => setFormData(prev => ({ ...prev, mindestanforderungen: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Vertragsart</Label>
        <Select 
          value={formData.vertragsart} 
          onValueChange={(value: Vertragsart) => setFormData(prev => ({ ...prev, vertragsart: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Vertragsart wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="werkvertrag">Werkvertrag</SelectItem>
            <SelectItem value="dienstleistungsvertrag">Dienstleistungsvertrag</SelectItem>
            <SelectItem value="mischvertrag">Mischvertrag</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Objektart</Label>
        <Select 
          value={formData.objektart[0] || ""} 
          onValueChange={(value: Objektart) => setFormData(prev => ({ ...prev, objektart: value ? [value] : [] }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Objektart wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grundschule">Grundschule</SelectItem>
            <SelectItem value="kindergarten">Kindergarten</SelectItem>
            <SelectItem value="buero">Büro</SelectItem>
            <SelectItem value="">Keine Angabe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Erforderliche Zertifikate</Label>
        <div className="space-y-2">
          {['din_iso_9001', 'din_iso_14001', 'din_iso_45001'].map((cert) => (
            <div key={cert} className="flex items-center space-x-2">
              <Switch
                checked={formData.erforderlicheZertifikate.includes(cert as Zertifikat)}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({
                    ...prev,
                    erforderlicheZertifikate: checked
                      ? [...prev.erforderlicheZertifikate, cert as Zertifikat]
                      : prev.erforderlicheZertifikate.filter(c => c !== cert)
                  }));
                }}
              />
              <Label>{cert}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.objektbesichtigungErforderlich}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, objektbesichtigungErforderlich: checked }))}
        />
        <Label>Objektbesichtigung erforderlich</Label>
      </div>
    </div>
  );
}
