
import { useState } from "react";
import { Tender } from "@/types/tender";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface TenderContactEditFormProps {
  tender: Tender;
  onSubmit: (updates: Partial<Tender>) => void;
  onCancel: () => void;
}

export function TenderContactEditForm({ tender, onSubmit, onCancel }: TenderContactEditFormProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    contactPerson: tender.contactPerson || "",
    contactEmail: tender.contactEmail || "",
    contactPhone: tender.contactPhone || "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const updates: Partial<Tender> = {
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
    };
    
    onSubmit(updates);
    // Note: the setIsSubmitting(false) will be handled in the parent component after onSubmit completes
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="py-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">{t("tender.contactPerson")}</Label>
          <Input
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">{t("tender.contactEmail")}</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactPhone">{t("tender.contactPhone")}</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('general.saving', 'Speichern...')}
            </>
          ) : (
            t("save", "Speichern")
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
