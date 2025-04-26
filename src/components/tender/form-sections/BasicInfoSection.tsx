
import { Tender } from "@/types/tender";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useClient } from "@/context/ClientContext";

interface BasicInfoSectionProps {
  formData: {
    title: string;
    externalReference: string;
    client: string;
    status: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function BasicInfoSection({ formData, handleChange, handleSelectChange }: BasicInfoSectionProps) {
  const { t } = useTranslation();
  const { clients } = useClient();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="title">{t("tender.title")}</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="externalReference">{t("tender.externalReference")}</Label>
        <Input
          id="externalReference"
          name="externalReference"
          value={formData.externalReference}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client">{t("tender.client")}</Label>
        <Select 
          name="client" 
          value={formData.client} 
          onValueChange={(value) => handleSelectChange("client", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vergabestelle auswählen" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.name}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
