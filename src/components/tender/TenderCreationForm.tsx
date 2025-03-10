
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Client } from "@/types/client";
import { NewClientDialog } from "@/components/client/NewClientDialog";
import { getDefaultMilestones } from "@/data/defaultMilestones";
import { Tender, Milestone, Vertragsart, Objektart, Zertifikat } from "@/types/tender";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function TenderCreationForm() {
  const { t } = useTranslation();
  const { createTender } = useTender();
  const { clients } = useClient();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Information (existing fields)
    title: "",
    externalReference: "",
    description: "",
    client: "",
    location: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    bindingPeriodDate: null as Date | null,
    evaluationScheme: "",
    conceptRequired: false,
    budget: "",
    dueDate: null as Date | null,
    notes: "",

    // Extended Information (new fields)
    vergabeplattform: "",
    mindestanforderungen: "",
    erforderlicheZertifikate: [] as Zertifikat[],
    objektbesichtigungErforderlich: false,
    objektart: [] as Objektart[],
    vertragsart: "" as Vertragsart,
    leistungswertvorgaben: false,
    stundenvorgaben: "",
    beraterVergabestelle: "",
    jahresreinigungsflaeche: "",
    waschmaschine: false,
    tariflohn: false,
    qualitaetskontrollen: false,
    raumgruppentabelle: false
  });

  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [bindingPeriodDateOpen, setBindingPeriodDateOpen] = useState(false);

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

  const handleBindingPeriodDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, bindingPeriodDate: date || null }));
    setBindingPeriodDateOpen(false);
  };

  const handleClientCreated = (client: Client) => {
    setFormData(prev => ({ ...prev, client: client.name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client) {
      toast.error(t('errorMessages.selectClient'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const defaultMilestones = getDefaultMilestones();
      
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
    <>
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
                  <div className="space-y-4">
                    {/* Basic fields (title, references, etc.) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">{t('tender.title')} *</Label>
                        <Input 
                          id="title" 
                          name="title" 
                          value={formData.title} 
                          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder={t('tenders.newTender')}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="externalReference">{t('tender.externalReference')}</Label>
                        <Input 
                          id="externalReference" 
                          name="externalReference" 
                          value={formData.externalReference} 
                          onChange={e => setFormData(prev => ({ ...prev, externalReference: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{t('tender.description')}</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget</Label>
                        <Input 
                          id="budget" 
                          name="budget" 
                          type="number"
                          value={formData.budget} 
                          onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fälligkeitsdatum *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.dueDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Datum wählen</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.dueDate || undefined}
                              onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date || null }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tender Details Section */}
              <AccordionItem value="details">
                <AccordionTrigger>Ausschreibungsdetails</AccordionTrigger>
                <AccordionContent>
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
                        onValueChange={(value: Objektart) => setFormData(prev => ({ ...prev, objektart: [value] }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Objektart wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grundschule">Grundschule</SelectItem>
                          <SelectItem value="kindergarten">Kindergarten</SelectItem>
                          <SelectItem value="buero">Büro</SelectItem>
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
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Additional Requirements Section */}
              <AccordionItem value="requirements">
                <AccordionTrigger>Zusätzliche Anforderungen</AccordionTrigger>
                <AccordionContent>
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
                          checked={formData.objektbesichtigungErforderlich}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, objektbesichtigungErforderlich: checked }))}
                        />
                        <Label>Objektbesichtigung erforderlich</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.leistungswertvorgaben}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, leistungswertvorgaben: checked }))}
                        />
                        <Label>Leistungswertvorgaben</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.waschmaschine}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, waschmaschine: checked }))}
                        />
                        <Label>Waschmaschine</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.tariflohn}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, tariflohn: checked }))}
                        />
                        <Label>Tariflohn</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.qualitaetskontrollen}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, qualitaetskontrollen: checked }))}
                        />
                        <Label>Qualitätskontrollen</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.raumgruppentabelle}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, raumgruppentabelle: checked }))}
                        />
                        <Label>Raumgruppentabelle</Label>
                      </div>
                    </div>
                  </div>
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

      <NewClientDialog 
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
        onClientCreated={handleClientCreated}
      />
    </>
  );
}
