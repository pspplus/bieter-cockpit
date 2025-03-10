
import { useState } from "react";
import { Tender, TenderStatus, Vertragsart, Objektart, Zertifikat } from "@/types/tender";
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
import { Checkbox } from "@/components/ui/checkbox";
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
    // Basic information
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
    
    // New fields
    vergabeplattform: tender.vergabeplattform || "",
    mindestanforderungen: tender.mindestanforderungen || "",
    erforderlicheZertifikate: tender.erforderlicheZertifikate || [],
    objektbesichtigungErforderlich: tender.objektbesichtigungErforderlich || false,
    objektart: tender.objektart || [],
    vertragsart: tender.vertragsart || "",
    leistungswertvorgaben: tender.leistungswertvorgaben || false,
    stundenvorgaben: tender.stundenvorgaben || "",
    beraterVergabestelle: tender.beraterVergabestelle || "",
    jahresreinigungsflaeche: tender.jahresreinigungsflaeche ? tender.jahresreinigungsflaeche.toString() : "",
    waschmaschine: tender.waschmaschine || false,
    tariflohn: tender.tariflohn || false,
    qualitaetskontrollen: tender.qualitaetskontrollen || false,
    raumgruppentabelle: tender.raumgruppentabelle || false,
  });
  
  const [dateOpen, setDateOpen] = useState(false);
  const [bindingPeriodDateOpen, setBindingPeriodDateOpen] = useState(false);
  
  const vertragsartOptions: Vertragsart[] = ['werkvertrag', 'dienstleistungsvertrag', 'mischvertrag', ''];
  const objektartOptions: Objektart[] = ['grundschule', 'kindergarten', 'buero', ''];
  const zertifikatOptions: Zertifikat[] = ['din_iso_9001', 'din_iso_14001', 'din_iso_45001'];
  
  const displayVertragsart = (vertragsart: Vertragsart) => {
    switch(vertragsart) {
      case 'werkvertrag': return "Werkvertrag";
      case 'dienstleistungsvertrag': return "Dienstleistungsvertrag";
      case 'mischvertrag': return "Mischvertrag";
      default: return "-";
    }
  };
  
  const displayObjektart = (objektart: Objektart) => {
    switch(objektart) {
      case 'grundschule': return "Grundschule";
      case 'kindergarten': return "Kindergarten";
      case 'buero': return "Büro";
      default: return "-";
    }
  };
  
  const displayZertifikat = (zertifikat: Zertifikat) => {
    switch(zertifikat) {
      case 'din_iso_9001': return "DIN ISO 9001";
      case 'din_iso_14001': return "DIN ISO 14001";
      case 'din_iso_45001': return "DIN ISO 45001";
      default: return zertifikat;
    }
  };
  
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
      dueDate: formData.dueDate,
      bindingPeriodDate: formData.bindingPeriodDate,
      description: formData.description,
      location: formData.location,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      evaluationScheme: formData.evaluationScheme,
      conceptRequired: formData.conceptRequired,
      
      // New fields
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
    // Note: the setIsSubmitting(false) will be handled in the parent component after onSubmit completes
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <h3 className="font-medium text-base border-b pb-2">{t("tenderDetails.mainInformation", "Hauptinformationen")}</h3>
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
            <Label htmlFor="vergabeplattform">{t("tender.vergabeplattform", "Vergabeplattform")}</Label>
            <Input
              id="vergabeplattform"
              name="vergabeplattform"
              value={formData.vergabeplattform}
              onChange={handleChange}
              placeholder="z.B. Vergabe24, Subreport, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vertragsart">{t("tender.vertragsart", "Vertragsart")}</Label>
            <Select 
              name="vertragsart" 
              value={formData.vertragsart} 
              onValueChange={(value) => handleSelectChange("vertragsart", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vertragsart auswählen" />
              </SelectTrigger>
              <SelectContent>
                {vertragsartOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option ? displayVertragsart(option) : "Keine Angabe"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        
        <h3 className="font-medium text-base border-b pb-2 mt-6">{t("tenderDetails.objectInformation", "Objektinformationen")}</h3>
        
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
            <Label htmlFor="jahresreinigungsflaeche">{t("tender.jahresreinigungsflaeche", "Jahresreinigungsfläche (m²)")}</Label>
            <Input
              id="jahresreinigungsflaeche"
              name="jahresreinigungsflaeche"
              type="number"
              value={formData.jahresreinigungsflaeche}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>{t("tender.objektart", "Objektart")}</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {objektartOptions.filter(option => option !== "").map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`objektart-${option}`}
                  checked={formData.objektart.includes(option)}
                  onCheckedChange={(checked) => 
                    handleObjektartChange(option, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`objektart-${option}`}
                  className="cursor-pointer"
                >
                  {displayObjektart(option)}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="objektbesichtigungErforderlich"
            checked={formData.objektbesichtigungErforderlich}
            onCheckedChange={(checked) => handleBooleanChange("objektbesichtigungErforderlich", checked)}
          />
          <Label htmlFor="objektbesichtigungErforderlich" className="cursor-pointer">
            {t("tender.objektbesichtigung", "Objektbesichtigung erforderlich")}
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="raumgruppentabelle"
            checked={formData.raumgruppentabelle}
            onCheckedChange={(checked) => handleBooleanChange("raumgruppentabelle", checked)}
          />
          <Label htmlFor="raumgruppentabelle" className="cursor-pointer">
            {t("tender.raumgruppentabelle", "Raumgruppentabelle")}
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="waschmaschine"
            checked={formData.waschmaschine}
            onCheckedChange={(checked) => handleBooleanChange("waschmaschine", checked)}
          />
          <Label htmlFor="waschmaschine" className="cursor-pointer">
            {t("tender.waschmaschine", "Waschmaschine")}
          </Label>
        </div>
        
        <h3 className="font-medium text-base border-b pb-2 mt-6">{t("tenderDetails.requirements", "Anforderungen")}</h3>
        
        <div className="space-y-2">
          <Label>{t("tender.erforderlicheZertifikate", "Erforderliche Zertifikate")}</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {zertifikatOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`zertifikat-${option}`}
                  checked={formData.erforderlicheZertifikate.includes(option)}
                  onCheckedChange={(checked) => 
                    handleZertifikatChange(option, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`zertifikat-${option}`}
                  className="cursor-pointer"
                >
                  {displayZertifikat(option)}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="stundenvorgaben">{t("tender.stundenvorgaben", "Stundenvorgaben")}</Label>
            <Input
              id="stundenvorgaben"
              name="stundenvorgaben"
              value={formData.stundenvorgaben}
              onChange={handleChange}
              placeholder="z.B. 40h/Woche"
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
        
        <div className="space-y-4">
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
          
          <div className="flex items-center space-x-2">
            <Switch
              id="tariflohn"
              checked={formData.tariflohn}
              onCheckedChange={(checked) => handleBooleanChange("tariflohn", checked)}
            />
            <Label htmlFor="tariflohn" className="cursor-pointer">
              {t("tender.tariflohn", "Tariflohn")}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="qualitaetskontrollen"
              checked={formData.qualitaetskontrollen}
              onCheckedChange={(checked) => handleBooleanChange("qualitaetskontrollen", checked)}
            />
            <Label htmlFor="qualitaetskontrollen" className="cursor-pointer">
              {t("tender.qualitaetskontrollen", "Qualitätskontrollen")}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="leistungswertvorgaben"
              checked={formData.leistungswertvorgaben}
              onCheckedChange={(checked) => handleBooleanChange("leistungswertvorgaben", checked)}
            />
            <Label htmlFor="leistungswertvorgaben" className="cursor-pointer">
              {t("tender.leistungswertvorgaben", "Leistungswertvorgaben")}
            </Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mindestanforderungen">{t("tender.mindestanforderungen", "Mindestanforderungen")}</Label>
          <Textarea
            id="mindestanforderungen"
            name="mindestanforderungen"
            value={formData.mindestanforderungen}
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
        
        <h3 className="font-medium text-base border-b pb-2 mt-6">{t("tenderDetails.contactVergabe", "Kontakt & Vergabe")}</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="beraterVergabestelle">{t("tender.beraterVergabestelle", "Berater Vergabestelle")}</Label>
            <Input
              id="beraterVergabestelle"
              name="beraterVergabestelle"
              value={formData.beraterVergabestelle}
              onChange={handleChange}
            />
          </div>
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
