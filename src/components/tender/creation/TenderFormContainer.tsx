import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTender } from "@/hooks/useTender";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BasicInfoSection } from "./BasicInfoSection";
import { ClientContactSection } from "./ClientContactSection";
import { TenderDetailsSection } from "./TenderDetailsSection";
import { AdditionalRequirementsSection } from "./AdditionalRequirementsSection";
import { Tender, Zertifikat, Objektart, Vertragsart } from "@/types/tender";
import { getDefaultMilestones } from "@/data/defaultMilestones";

export function TenderFormContainer() {
  const { t } = useTranslation();
  const { createTender } = useTender();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    externalReference: "",
    description: "",
    budget: "",
    dueDate: null as Date | null,
    
    // Client and Contact Information
    client: "",
    location: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    
    // Tender Details
    vergabeplattform: "",
    mindestanforderungen: "",
    erforderlicheZertifikate: [] as Zertifikat[],
    objektbesichtigungErforderlich: false,
    objektart: [] as Objektart[],
    vertragsart: "" as Vertragsart,
    beraterVergabestelle: "",
    
    // Additional Requirements
    jahresreinigungsflaeche: "",
    stundenvorgaben: "",
    leistungswertvorgaben: false,
    waschmaschine: false,
    tariflohn: false,
    qualitaetskontrollen: false,
    raumgruppentabelle: false,
    
    // Other fields (not in sections but needed for API)
    bindingPeriodDate: null as Date | null,
    evaluationScheme: "",
    conceptRequired: false,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client) {
      toast.error(t('errorMessages.selectClient'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Hole die Standard-Meilensteine
      const defaultMilestones = getDefaultMilestones();
      
      // Erstelle die neue Ausschreibung mit Meilensteinen
      const newTender = await createTender({
        title: formData.title || t('tenders.newTender'),
        externalReference: formData.externalReference,
        description: formData.description,
        client: formData.client,
        location: formData.location,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        bindingPeriodDate: formData.bindingPeriodDate,
        evaluationScheme: formData.evaluationScheme,
        conceptRequired: formData.conceptRequired,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        dueDate: formData.dueDate || new Date(),
        notes: formData.notes,
        milestones: defaultMilestones,
        vergabeplattform: formData.vergabeplattform,
        mindestanforderungen: formData.mindestanforderungen,
        erforderlicheZertifikate: formData.erforderlicheZertifikate,
        objektbesichtigungErforderlich: formData.objektbesichtigungErforderlich,
        objektart: formData.objektart,
        vertragsart: formData.vertragsart,
        leistungswertvorgaben: formData.leistungswertvorgaben,
        stundenvorgaben: formData.stundenvorgaben,
        beraterVergabestelle: formData.beraterVergabestelle,
        jahresreinigungsflaeche: formData.jahresreinigungsflaeche ? parseFloat(formData.jahresreinigungsflaeche) : undefined,
        waschmaschine: formData.waschmaschine,
        tariflohn: formData.tariflohn,
        qualitaetskontrollen: formData.qualitaetskontrollen,
        raumgruppentabelle: formData.raumgruppentabelle
      } as Partial<Tender>);

      toast.success(t('toasts.tenderCreated'));
      navigate(`/tenders/${newTender.id}`);
    } catch (error) {
      console.error("Error creating tender:", error);
      toast.error(t('errorMessages.couldNotCreateTender'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <h2 className="text-2xl font-semibold">{t('tender.createNewTender')}</h2>
          <p className="text-muted-foreground">{t('tender.fillTenderDetails')}</p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="basic">
            {/* Basic Information Section */}
            <AccordionItem value="basic">
              <AccordionTrigger>Grundinformationen</AccordionTrigger>
              <AccordionContent>
                <BasicInfoSection formData={formData} setFormData={setFormData} />
              </AccordionContent>
            </AccordionItem>

            {/* Client and Contact Section */}
            <AccordionItem value="client">
              <AccordionTrigger>Kunde & Kontakt</AccordionTrigger>
              <AccordionContent>
                <ClientContactSection formData={formData} setFormData={setFormData} />
              </AccordionContent>
            </AccordionItem>

            {/* Tender Details Section */}
            <AccordionItem value="details">
              <AccordionTrigger>Ausschreibungsdetails</AccordionTrigger>
              <AccordionContent>
                <TenderDetailsSection formData={formData} setFormData={setFormData} />
              </AccordionContent>
            </AccordionItem>

            {/* Additional Requirements Section */}
            <AccordionItem value="requirements">
              <AccordionTrigger>Zusätzliche Anforderungen</AccordionTrigger>
              <AccordionContent>
                <AdditionalRequirementsSection formData={formData} setFormData={setFormData} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/tenders")}
          >
            {t('tenders.cancel')}
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('general.saving')}
              </>
            ) : (
              t('tenders.createTender')
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
