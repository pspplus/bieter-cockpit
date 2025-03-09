
import { useState } from "react";
import { Tender } from "@/types/tender";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTender } from "@/hooks/useTender";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Building } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useClient } from "@/context/ClientContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TenderEditFormProps {
  tender: Tender;
  onCancel: () => void;
}

export function TenderEditForm({ tender, onCancel }: TenderEditFormProps) {
  const { updateTender } = useTender();
  const { clients } = useClient();
  
  const [formData, setFormData] = useState({
    title: tender.title,
    externalReference: tender.externalReference,
    client: tender.client || "",
    status: tender.status,
    dueDate: new Date(tender.dueDate),
    bindingPeriodDate: tender.bindingPeriodDate ? new Date(tender.bindingPeriodDate) : null,
    description: tender.description || "",
    location: tender.location || "",
    budget: tender.budget ? tender.budget.toString() : "",
    contactPerson: tender.contactPerson || "",
    contactEmail: tender.contactEmail || "",
    contactPhone: tender.contactPhone || "",
    evaluationScheme: tender.evaluationScheme || "",
    conceptRequired: tender.conceptRequired || false,
  });
  
  const [dateOpen, setDateOpen] = useState(false);
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
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dueDate: date }));
      setDateOpen(false);
    }
  };
  
  const handleBindingPeriodDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, bindingPeriodDate: date }));
      setBindingPeriodDateOpen(false);
    } else {
      setFormData(prev => ({ ...prev, bindingPeriodDate: null }));
      setBindingPeriodDateOpen(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: Partial<Tender> = {
      title: formData.title,
      externalReference: formData.externalReference,
      client: formData.client,
      status: formData.status as Tender["status"],
      dueDate: formData.dueDate,
      bindingPeriodDate: formData.bindingPeriodDate,
      description: formData.description,
      location: formData.location,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      evaluationScheme: formData.evaluationScheme,
      conceptRequired: formData.conceptRequired,
    };
    
    updateTender(tender.id, updates);
    onCancel();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titel
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="externalReference" className="text-sm font-medium">
                Externe Referenz
              </label>
              <Input
                id="externalReference"
                name="externalReference"
                value={formData.externalReference}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium">
                Kunde
              </label>
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
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select 
                name="status" 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entwurf">Entwurf</SelectItem>
                  <SelectItem value="in-pruefung">In Prüfung</SelectItem>
                  <SelectItem value="in-bearbeitung">In Bearbeitung</SelectItem>
                  <SelectItem value="abgegeben">Abgegeben</SelectItem>
                  <SelectItem value="aufklaerung">Aufklärung</SelectItem>
                  <SelectItem value="gewonnen">Gewonnen</SelectItem>
                  <SelectItem value="verloren">Verloren</SelectItem>
                  <SelectItem value="abgeschlossen">Abgeschlossen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Fälligkeitsdatum
              </label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Datum auswählen</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bindingPeriodDate" className="text-sm font-medium">
                Bindefrist
              </label>
              <Popover open={bindingPeriodDateOpen} onOpenChange={setBindingPeriodDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.bindingPeriodDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.bindingPeriodDate ? format(formData.bindingPeriodDate, "PPP") : <span>Datum auswählen</span>}
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
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Ort
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm font-medium">
                Budget
              </label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Beschreibung
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="evaluationScheme" className="text-sm font-medium">
              Wertungsschema
            </label>
            <Textarea
              id="evaluationScheme"
              name="evaluationScheme"
              value={formData.evaluationScheme}
              onChange={handleChange}
              rows={3}
              placeholder="Details zum Wertungsschema eintragen"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="conceptRequired"
              checked={formData.conceptRequired}
              onCheckedChange={(checked) => handleBooleanChange("conceptRequired", checked)}
            />
            <Label htmlFor="conceptRequired" className="cursor-pointer">
              Konzept erforderlich
            </Label>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kontaktinformationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="contactPerson" className="text-sm font-medium">
                Ansprechpartner
              </label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="contactEmail" className="text-sm font-medium">
                  E-Mail
                </label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contactPhone" className="text-sm font-medium">
                  Telefon
                </label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Abbrechen
            </Button>
            <Button type="submit">
              Änderungen speichern
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
