
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BasicInfoSectionProps {
  formData: {
    title: string;
    externalReference: string;
    description: string;
    budget: string;
    dueDate: Date | null;
  };
  setFormData: (data: any) => void;
}

export function BasicInfoSection({ formData, setFormData }: BasicInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
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
  );
}
