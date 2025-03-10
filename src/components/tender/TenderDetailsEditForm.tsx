
import { useState } from "react";
import { Tender, TenderStatus } from "@/types/tender";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useClient } from "@/context/ClientContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { statusDisplayMap } from "@/utils/statusUtils";

interface TenderDetailsEditFormProps {
  tender: Tender;
  onSubmit: (updates: Partial<Tender>) => void;
  onCancel: () => void;
}

export function TenderDetailsEditForm({ tender, onSubmit, onCancel }: TenderDetailsEditFormProps) {
  const { clients } = useClient();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    setIsSubmitting(true);
    
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
      evaluationScheme: formData.evaluationScheme,
      conceptRequired: formData.conceptRequired,
    };
    
    onSubmit(updates);
    // Note: the setIsSubmitting(false) will be handled in the parent component after onSubmit completes
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="py-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">{t("tender.title")}</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="externalReference">{t("tender.externalReference")}</Label>
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
            <Label htmlFor="client">{t("tender.client")}</Label>
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
            <Label htmlFor="status">{t("tender.status")}</Label>
            <Select 
              name="status" 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(statusDisplayMap) as TenderStatus[]).map((statusKey) => (
                  <SelectItem key={statusKey} value={statusKey}>
                    {statusDisplayMap[statusKey]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dueDate">{t("tender.dueDate")}</Label>
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
            <Label htmlFor="bindingPeriodDate">{t("tender.bindingPeriodDate")}</Label>
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
            <Label htmlFor="location">{t("tender.location")}</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">{t("tender.budget")}</Label>
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
          <Label htmlFor="description">{t("tender.description")}</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="evaluationScheme">{t("tender.evaluationScheme")}</Label>
          <Textarea
            id="evaluationScheme"
            name="evaluationScheme"
            value={formData.evaluationScheme}
            onChange={handleChange}
            rows={2}
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
            {t("tender.conceptRequired")}
          </Label>
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
