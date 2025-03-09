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
import { useTender } from "@/context/TenderContext";
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

interface TenderEditFormProps {
  tender: Tender;
  onCancel: () => void;
}

export function TenderEditForm({ tender, onCancel }: TenderEditFormProps) {
  const { t } = useTranslation();
  const { updateTender } = useTender();
  const { clients } = useClient();
  
  const [formData, setFormData] = useState({
    title: tender.title,
    reference: tender.reference,
    client: tender.client || "",
    status: tender.status,
    dueDate: new Date(tender.dueDate),
    description: tender.description || "",
    location: tender.location || "",
    budget: tender.budget ? tender.budget.toString() : "",
    contactPerson: tender.contactPerson || "",
    contactEmail: tender.contactEmail || "",
    contactPhone: tender.contactPhone || "",
  });
  
  const [dateOpen, setDateOpen] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dueDate: date }));
      setDateOpen(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: Partial<Tender> = {
      title: formData.title,
      reference: formData.reference,
      client: formData.client,
      status: formData.status as Tender["status"],
      dueDate: formData.dueDate,
      description: formData.description,
      location: formData.location,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
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
                {t('tender.title')}
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
              <label htmlFor="reference" className="text-sm font-medium">
                {t('tender.reference')}
              </label>
              <Input
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium">
                {t('tender.client')}
              </label>
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
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                {t('tender.status')}
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
                  <SelectItem value="draft">{t('tenders.drafts')}</SelectItem>
                  <SelectItem value="active">{t('tenders.active')}</SelectItem>
                  <SelectItem value="review">{t('tenders.review')}</SelectItem>
                  <SelectItem value="submitted">{t('tenders.submitted')}</SelectItem>
                  <SelectItem value="clarification">{t('tenders.inClarification')}</SelectItem>
                  <SelectItem value="won">{t('tenders.won')}</SelectItem>
                  <SelectItem value="lost">{t('tenders.lost')}</SelectItem>
                  <SelectItem value="completed">{t('tenders.completed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                {t('tender.dueDate')}
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
                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
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
              <label htmlFor="location" className="text-sm font-medium">
                {t('tender.location')}
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-medium">
              {t('tender.budget')}
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
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              {t('tender.description')}
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('tenderDetails.contactInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="contactPerson" className="text-sm font-medium">
                {t('tender.contactPerson')}
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
                  {t('tenderDetails.email')}
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
                  {t('tenderDetails.phone')}
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
              {t('tenders.cancel')}
            </Button>
            <Button type="submit">
              {t('tenders.saveChanges')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
