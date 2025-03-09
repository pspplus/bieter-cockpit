
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTender } from "@/hooks/useTender";
import { useClient } from "@/context/ClientContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { Client } from "@/types/client";
import { NewClientDialog } from "@/components/client/NewClientDialog";

export function TenderCreationForm() {
  const { t } = useTranslation();
  const { createTender } = useTender();
  const { clients } = useClient();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    externalReference: "",
    description: "",
    client: "",
    location: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientCreated = (client: Client) => {
    setFormData(prev => ({ ...prev, client: client.name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client) {
      toast.error(t('errorMessages.selectClient', 'Bitte wählen Sie eine Vergabestelle aus'));
      return;
    }
    
    try {
      const newTender = await createTender({
        title: formData.title || t('tenders.newTender'),
        externalReference: formData.externalReference || "",
        description: formData.description,
        client: formData.client,
        location: formData.location,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      });

      toast.success(t('toasts.tenderCreated'));

      navigate(`/tenders/${newTender.id}`);
    } catch (error) {
      console.error("Error creating tender:", error);
      toast.error(t('errorMessages.couldNotCreateTender'));
    }
  };

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-2xl font-semibold">{t('tenders.createNewTender')}</h2>
            <p className="text-muted-foreground">{t('tenders.fillTenderDetails')}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('tender.title')} *</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder={t('tenders.newTender')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalReference">{t('tender.externalReference', 'Externe Referenznummer')}</Label>
              <Input 
                id="externalReference" 
                name="externalReference" 
                value={formData.externalReference} 
                onChange={handleChange} 
                placeholder="REF-2023-001"
              />
              <p className="text-sm text-muted-foreground">{t('tender.externalReferenceHelp', 'Die vom Kunden vergebene Referenznummer')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="internalReference">{t('tender.internalReference', 'Interne Referenznummer')}</Label>
              <Input 
                id="internalReference" 
                value={new Date().getFullYear() + "-???"}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">{t('tender.internalReferenceHelp', 'Wird beim Erstellen automatisch generiert')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('tender.description')}</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder={t('tenders.descriptionPlaceholder')}
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">{t('tender.client')} *</Label>
                <div className="flex space-x-2">
                  <Select 
                    name="client" 
                    value={formData.client} 
                    onValueChange={(value) => handleSelectChange("client", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('tenders.selectClient', 'Vergabestelle auswählen')} />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.name}>
                          {client.name}
                        </SelectItem>
                      ))}
                      <button
                        type="button"
                        className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground border-t border-muted mt-1 pt-2"
                        onClick={() => {
                          setIsNewClientDialogOpen(true);
                          document.body.click();
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('clients.createNew', 'Neue Vergabestelle erstellen')}
                      </button>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('tender.location')}</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-medium">{t('tenderDetails.contactInformation')}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">{t('tender.contactPerson')}</Label>
                  <Input 
                    id="contactPerson" 
                    name="contactPerson" 
                    value={formData.contactPerson} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">{t('tender.contactEmail')}</Label>
                  <Input 
                    id="contactEmail" 
                    name="contactEmail" 
                    type="email"
                    value={formData.contactEmail} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{t('tender.contactPhone')}</Label>
                  <Input 
                    id="contactPhone" 
                    name="contactPhone" 
                    value={formData.contactPhone} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/tenders")}
            >
              {t('tenders.cancel')}
            </Button>
            <Button type="submit">
              {t('tenders.createTender')}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <NewClientDialog 
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
        onClientCreated={handleClientCreated}
      />
    </>
  );
}
