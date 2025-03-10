import { format } from "date-fns";
import { Tender, TenderStatus } from "@/types/tender";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, PencilLine } from "lucide-react";
import { useTranslation } from "react-i18next";
import { statusColors, statusDisplayMap } from "@/utils/statusUtils";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface BaseInfoCardProps {
  tender: Tender;
  onStatusChange: (status: TenderStatus) => Promise<void>;
}

export function BaseInfoCard({ tender, onStatusChange }: BaseInfoCardProps) {
  const { t } = useTranslation();
  const formattedCreatedAt = format(new Date(tender.createdAt), "PP");
  const formattedDueDate = format(new Date(tender.dueDate), "PP");
  const formattedBindingPeriodDate = tender.bindingPeriodDate 
    ? format(new Date(tender.bindingPeriodDate), "PP") 
    : null;
  
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
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
        
        <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
          <PopoverTrigger asChild>
            <Badge 
              variant="outline" 
              className={`cursor-pointer flex items-center gap-1 ${bg} ${text}`}
            >
              {statusDisplayMap[tender.status]}
              <PencilLine className="h-3 w-3" />
            </Badge>
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
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">{t("tender.internalReference")}</div>
            <div className="text-sm">{tender.internalReference}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tenderDetails.updated")}</div>
            <div className="text-sm">{format(new Date(tender.updatedAt), "PP")}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{t("tenderDetails.due")}</div>
            <div className="text-sm">{formattedDueDate}</div>
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
