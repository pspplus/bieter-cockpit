import { useState } from "react";
import { useClient } from "@/context/ClientContext";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Client } from "@/types/client";
import { Textarea } from "@/components/ui/textarea";

interface NewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: (client: Client) => void;
}

export function NewClientDialog({ open, onOpenChange, onClientCreated }: NewClientDialogProps) {
  const { t } = useTranslation();
  const { createClient } = useClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    quick_check_info: "",
    besichtigung_info: "",
    konzept_info: "",
    kalkulation_info: "",
    dokumente_pruefen_info: "",
    ausschreibung_einreichen_info: "",
    aufklaerung_info: "",
    implementierung_info: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Name ist erforderlich");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newClient = await createClient(formData);
      
      toast.success("Kunde erfolgreich erstellt");
      
      // Reset form
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        quick_check_info: "",
        besichtigung_info: "",
        konzept_info: "",
        kalkulation_info: "",
        dokumente_pruefen_info: "",
        ausschreibung_einreichen_info: "",
        aufklaerung_info: "",
        implementierung_info: "",
      });
      
      // Close dialog
      onOpenChange(false);
      
      // Notify parent component
      if (onClientCreated) {
        onClientCreated(newClient);
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Kunde konnte nicht erstellt werden");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Neue Vergabestelle erstellen</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Ansprechpartner</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Meilenstein-Informationen</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quick_check_info">Quick Check Information</Label>
                <Textarea
                  id="quick_check_info"
                  name="quick_check_info"
                  value={formData.quick_check_info}
                  onChange={handleChange}
                  placeholder="Spezifische Informationen für den Quick Check..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="besichtigung_info">Besichtigung Information</Label>
                <Textarea
                  id="besichtigung_info"
                  name="besichtigung_info"
                  value={formData.besichtigung_info}
                  onChange={handleChange}
                  placeholder="Spezifische Informationen für die Besichtigung..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="konzept_info">Konzept Information</Label>
                <Textarea
                  id="konzept_info"
                  name="konzept_info"
                  value={formData.konzept_info}
                  onChange={handleChange}
                  placeholder="Spezifische Informationen für das Konzept..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kalkulation_info">Kalkulation Information</Label>
                <Textarea
                  id="kalkulation_info"
                  name="kalkulation_info"
                  value={formData.kalkulation_info}
                  onChange={handleChange}
                  placeholder="Spezifische Informationen für die Kalkulation..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dokumente_pruefen_info">Dokumente prüfen Information</Label>
                <Textarea
                  id="dokumente_pruefen_info"
                  name="dokumente_pruefen_info"
                  value={formData.dokumente_pruefen_info}
                  onChange={handleChange}
                  placeholder="Spezifische Informationen für die Dokumentenprüfung..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ausschreibung_einreichen_info">Ausschreibung einreichen Information</Label>
                <Textarea
                  id="ausschreibung_einreichen_info"
                  name="ausschreibung_einreichen_info"
                  value={formData.ausschreibung_einreichen_info}
                  onChange={handleChange}
                  placeholder="Spezifische Informationen für die Einreichung..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aufklaerung_info">Aufklärung Information</Label>
                <Textarea
                  id="aufklaerung_info"
                  name="aufklaerung_info"
                  value={formData.aufklaerung_info}
                  onChange={handleChange}
                  placeholder="Spezifische Informationen für die Aufklärung..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="implementierung_info">Implementierung Information</Label>
                <Textarea
                  id="implementierung_info"
                  name="implementierung_info"
                  value={formData.implementierung_info}
                  onChange={handleChange}
                  placeholder="Spezifische Informationen für die Implementierung..."
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Abbrechen
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⚪</span>
                  Erstelle...
                </>
              ) : (
                "Kunde erstellen"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
