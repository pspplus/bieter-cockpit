
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useClient } from "@/context/ClientContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewClientDialog } from "@/components/client/NewClientDialog";
import { PlusCircle } from "lucide-react";
import { Client } from "@/types/client";

interface ClientContactSectionProps {
  formData: {
    client: string;
    location: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
  };
  setFormData: (data: any) => void;
}

export function ClientContactSection({ formData, setFormData }: ClientContactSectionProps) {
  const { t } = useTranslation();
  const { clients } = useClient();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  const handleClientCreated = (client: Client) => {
    setFormData(prev => ({ ...prev, client: client.name }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="client">{t('tender.client')} *</Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => setIsNewClientDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Neu
            </Button>
          </div>
          <Select
            value={formData.client}
            onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('tenders.selectClient')} />
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

        <div className="space-y-2">
          <Label htmlFor="location">{t('tender.location')}</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">{t('tender.contactPerson')}</Label>
          <Input
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={e => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">{t('tender.contactEmail')}</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={e => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">{t('tender.contactPhone')}</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={e => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
          />
        </div>
      </div>

      <NewClientDialog 
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}
