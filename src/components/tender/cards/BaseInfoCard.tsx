
import { format } from "date-fns";
import { Tender, TenderStatus } from "@/types/tender";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, PencilLine, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { statusColors, statusDisplayMap } from "@/utils/statusUtils";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";

interface BaseInfoCardProps {
  tender: Tender;
  onStatusChange: (status: TenderStatus) => Promise<void>;
  onUpdateTender: (updates: Partial<Tender>) => Promise<void>;
}

export function BaseInfoCard({ tender, onStatusChange, onUpdateTender }: BaseInfoCardProps) {
  const { t } = useTranslation();
  const formattedCreatedAt = format(new Date(tender.createdAt), "PP");
  const formattedDueDate = format(new Date(tender.dueDate), "PP");
  const formattedBindingPeriodDate = tender.bindingPeriodDate 
    ? format(new Date(tender.bindingPeriodDate), "PP") 
    : null;
  
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [editing, setEditing] = useState(false);
  const [internalReference, setInternalReference] = useState(tender.internalReference);
  const [dueDate, setDueDate] = useState<Date>(new Date(tender.dueDate));
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { bg, text } = statusColors[tender.status];

  const handleStatusChange = async (newStatus: TenderStatus) => {
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(newStatus);
      setStatusPopoverOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateTender({
        internalReference,
        dueDate
      });
      setEditing(false);
      toast.success(t("notifications.tenderUpdated", "Änderungen gespeichert"));
    } catch (error) {
      console.error("Error updating tender:", error);
      toast.error(t("errorMessages.couldNotUpdateTender", "Fehler beim Speichern"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setInternalReference(tender.internalReference);
    setDueDate(new Date(tender.dueDate));
    setEditing(false);
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>{t("tenderDetails.baseInformation", "Basisinformationen")}</CardTitle>
            <CardDescription>{t("tenderDetails.created")}: {formattedCreatedAt}</CardDescription>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!editing ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setEditing(true)} 
              className="h-8 w-8"
            >
              <PencilLine className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancel}
                className="h-8 w-8"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSave}
                className="h-8 w-8"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">{t("tender.internalReference")}</div>
            {editing ? (
              <Input 
                value={internalReference} 
                onChange={(e) => setInternalReference(e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="text-sm">{tender.internalReference}</div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium">{t("tenderDetails.updated")}</div>
            <div className="text-sm">{format(new Date(tender.updatedAt), "PP")}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tenderDetails.due")}</div>
            {editing ? (
              <div className="mt-1">
                <DatePicker 
                  date={dueDate} 
                  setDate={setDueDate} 
                  className="w-full"
                />
              </div>
            ) : (
              <div className="text-sm">{formattedDueDate}</div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium">{t("tender.status", "Status")}</div>
            <div className="text-sm">
              <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline"
                    className={`mt-1 text-sm font-normal justify-start h-9 px-3 ${bg} ${text}`}
                  >
                    {statusDisplayMap[tender.status]}
                    <PencilLine className="h-3 w-3 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {t("tender.changeStatus", "Status ändern")}
                    </h4>
                    <Select
                      value={tender.status}
                      onValueChange={(value) => handleStatusChange(value as TenderStatus)}
                      disabled={isUpdatingStatus}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("tender.selectStatus", "Status auswählen")} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusDisplayMap).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {formattedBindingPeriodDate && (
            <div>
              <div className="text-sm font-medium">{t("tender.bindingPeriodDate")}</div>
              <div className="text-sm">{formattedBindingPeriodDate}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
