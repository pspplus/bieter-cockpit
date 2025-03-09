
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Client } from "@/types/client";
import { useClient } from "@/context/ClientContext";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface NewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated: (client: Client) => void;
}

export function NewClientDialog({ 
  open, 
  onOpenChange, 
  onClientCreated 
}: NewClientDialogProps) {
  const { t } = useTranslation();
  const { createClient } = useClient();
  const { toast } = useToast();
  
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleNewClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateClient = async () => {
    if (!newClient.name) return;
    
    try {
      const client = await createClient(newClient);
      
      // Reset the new client form
      setNewClient({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
      });
      
      // Close the dialog
      onOpenChange(false);
      
      // Notify parent component
      onClientCreated(client);
      
      toast({
        title: t('toasts.clientCreated', 'Vergabestelle erfolgreich erstellt'),
        description: client.name,
      });
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: t('errorMessages.createFailed', 'Erstellung fehlgeschlagen'),
        description: t('errorMessages.couldNotCreateClient', 'Vergabestelle konnte nicht erstellt werden'),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('clients.createNewClient', 'Neue Vergabestelle erstellen')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name">{t('clients.name', 'Name')} *</label>
            <Input
              id="name"
              name="name"
              value={newClient.name}
              onChange={handleNewClientInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="contactPerson">{t('clients.contactPerson', 'Contact Person')}</label>
            <Input
              id="contactPerson"
              name="contactPerson"
              value={newClient.contactPerson}
              onChange={handleNewClientInputChange}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email">{t('clients.email', 'Email')}</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={newClient.email}
              onChange={handleNewClientInputChange}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="phone">{t('clients.phone', 'Phone')}</label>
            <Input
              id="phone"
              name="phone"
              value={newClient.phone}
              onChange={handleNewClientInputChange}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="address">{t('clients.address', 'Address')}</label>
            <Input
              id="address"
              name="address"
              value={newClient.address}
              onChange={handleNewClientInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('general.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleCreateClient} disabled={!newClient.name}>
            {t('general.create', 'Create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
