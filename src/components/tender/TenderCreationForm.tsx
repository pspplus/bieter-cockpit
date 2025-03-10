
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
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Client } from "@/types/client";
import { NewClientDialog } from "@/components/client/NewClientDialog";
import { getDefaultMilestones } from "@/data/defaultMilestones";
import { Tender, Milestone } from "@/types/tender";

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
    bindingPeriodDate: null as Date | null,
    evaluationScheme: "",
    conceptRequired: false
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
      toast.error(t('errorMessages.selectClient', 'Bitte wählen Sie eine Vergabestelle aus'));
      return;
    }
    
    try {
      // Standard-Meilensteine laden (jetzt mit Sequenznummern)
      const defaultMilestones = getDefaultMilestones();
      
      // Tender mit Standard-Meilensteinen erstellen
      const newTender = await createTender({
        title: formData.title || t('tenders.newTender'),
        externalReference: formData.externalReference || "",
        description: formData.description,
        client: formData.client,
        location: formData.location,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        bindingPeriodDate: formData.bindingPeriodDate,
        evaluationScheme: formData.evaluationScheme,
        conceptRequired: formData.conceptRequired,
        milestones: defaultMilestones
      } as Partial<Tender>);

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
            <h2 className="text-2xl font-semibold">{t('tender.createNewTender')}</h2>
            <p className="text-muted-foreground">{t('tender.fillTenderDetails')}</p>
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
              <Label htmlFor="externalReference">{t('tender.externalReference')}</Label>
              <Input 
                id="externalReference" 
                name="externalReference" 
                value={formData.externalReference} 
                onChange={handleChange} 
                placeholder="REF-2023-001"
              />
              <p className="text-sm text-muted-foreground">{t('tender.externalReferenceHelp')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="internalReference">{t('tender.internalReference')}</Label>
              <Input 
                id="internalReference" 
                value={new Date().getFullYear() + "-???"}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">{t('tender.internalReferenceHelp')}</p>
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
                      <SelectValue placeholder={t('tenders.selectClient')} />
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
              <Label htmlFor="bindingPeriodDate">{t('tender.bindingPeriodDate')}</Label>
              <Popover open={bindingPeriodDateOpen} onOpenChange={setBindingPeriodDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="bindingPeriodDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.bindingPeriodDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.bindingPeriodDate ? format(formData.bindingPeriodDate, "PPP") : <span>{t('tender.selectDate')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.bindingPeriodDate || undefined}
                    onSelect={handleBindingPeriodDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">{t('tender.bindingPeriodDateHelp')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluationScheme">{t('tender.evaluationScheme')}</Label>
              <Textarea 
                id="evaluationScheme" 
                name="evaluationScheme" 
                value={formData.evaluationScheme} 
                onChange={handleChange} 
                placeholder={t('tender.evaluationSchemePlaceholder')}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="conceptRequired"
                checked={formData.conceptRequired}
                onCheckedChange={(checked) => handleBooleanChange("conceptRequired", checked)}
              />
              <Label htmlFor="conceptRequired" className="cursor-pointer">
                {t('tender.conceptRequired')}
              </Label>
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
