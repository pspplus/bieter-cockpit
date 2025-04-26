
import { useState } from "react";
import { Tender, TenderStatus, Vertragsart, Objektart, Zertifikat } from "@/types/tender";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { ContractSection } from "./form-sections/ContractSection";
import { ObjectInfoSection } from "./form-sections/ObjectInfoSection";
import { RequirementsSection } from "./form-sections/RequirementsSection";

interface TenderDetailsEditFormProps {
  tender: Tender;
  onSubmit: (updates: Partial<Tender>) => void;
  onCancel: () => void;
}

export function TenderDetailsEditForm({ 
  tender, 
  onSubmit, 
  onCancel 
}: TenderDetailsEditFormProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: tender.title,
    externalReference: tender.externalReference,
    client: tender.client || "",
    status: tender.status,
    description: tender.description || "",
    location: tender.location || "",
    budget: tender.budget ? tender.budget.toString() : "",
    evaluationScheme: tender.evaluationScheme || "",
    conceptRequired: tender.conceptRequired || false,
    vergabeplattform: tender.vergabeplattform || "",
    mindestanforderungen: tender.mindestanforderungen || "",
    erforderlicheZertifikate: tender.erforderlicheZertifikate || [],
    objektbesichtigungErforderlich: tender.objektbesichtigungErforderlich || false,
    objektart: tender.objektart || [],
    vertragsart: tender.vertragsart || "keine_angabe",
    leistungswertvorgaben: tender.leistungswertvorgaben || false,
    stundenvorgaben: tender.stundenvorgaben || "",
    beraterVergabestelle: tender.beraterVergabestelle || "",
    jahresreinigungsflaeche: tender.jahresreinigungsflaeche ? tender.jahresreinigungsflaeche.toString() : "",
    waschmaschine: tender.waschmaschine || false,
    tariflohn: tender.tariflohn || false,
    qualitaetskontrollen: tender.qualitaetskontrollen || false,
    raumgruppentabelle: tender.raumgruppentabelle || false,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBooleanChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleZertifikatChange = (zertifikat: Zertifikat, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        erforderlicheZertifikate: [...prev.erforderlicheZertifikate, zertifikat]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        erforderlicheZertifikate: prev.erforderlicheZertifikate.filter(z => z !== zertifikat)
      }));
    }
  };
  
  const handleObjektartChange = (objektart: Objektart, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        objektart: [...prev.objektart, objektart]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        objektart: prev.objektart.filter(o => o !== objektart)
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const updates: Partial<Tender> = {
      title: formData.title,
      externalReference: formData.externalReference,
      client: formData.client,
      status: formData.status as Tender["status"],
      description: formData.description,
      location: formData.location,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      evaluationScheme: formData.evaluationScheme,
      conceptRequired: formData.conceptRequired,
      vergabeplattform: formData.vergabeplattform,
      mindestanforderungen: formData.mindestanforderungen,
      erforderlicheZertifikate: formData.erforderlicheZertifikate as Zertifikat[],
      objektbesichtigungErforderlich: formData.objektbesichtigungErforderlich,
      objektart: formData.objektart as Objektart[],
      vertragsart: formData.vertragsart as Vertragsart,
      leistungswertvorgaben: formData.leistungswertvorgaben,
      stundenvorgaben: formData.stundenvorgaben,
      beraterVergabestelle: formData.beraterVergabestelle,
      jahresreinigungsflaeche: formData.jahresreinigungsflaeche ? parseFloat(formData.jahresreinigungsflaeche) : undefined,
      waschmaschine: formData.waschmaschine,
      tariflohn: formData.tariflohn,
      qualitaetskontrollen: formData.qualitaetskontrollen,
      raumgruppentabelle: formData.raumgruppentabelle,
    };
    
    onSubmit(updates);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <h3 className="font-medium text-base border-b pb-2">
          {t("tenderDetails.mainInformation", "Hauptinformationen")}
        </h3>
        
        <BasicInfoSection 
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
        />
        
        <h3 className="font-medium text-base border-b pb-2 mt-6">
          {t("tenderDetails.objectInformation", "Objektinformationen")}
        </h3>
        
        <ObjectInfoSection 
          formData={formData}
          handleChange={handleChange}
          handleBooleanChange={handleBooleanChange}
          handleObjektartChange={handleObjektartChange}
        />
        
        <h3 className="font-medium text-base border-b pb-2 mt-6">
          {t("tenderDetails.contract", "Vertrag")}
        </h3>
        
        <ContractSection 
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
        />
        
        <h3 className="font-medium text-base border-b pb-2 mt-6">
          {t("tenderDetails.requirements", "Anforderungen")}
        </h3>
        
        <RequirementsSection 
          formData={formData}
          handleChange={handleChange}
          handleBooleanChange={handleBooleanChange}
          handleZertifikatChange={handleZertifikatChange}
        />
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
