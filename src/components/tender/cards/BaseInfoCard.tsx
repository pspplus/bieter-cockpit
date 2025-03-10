
import { Tender, TenderStatus } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/components/ui/database";
import { useTranslation } from "react-i18next";
import { PencilLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { statusDisplayMap, statusColors } from "@/utils/statusUtils";
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
import { useState } from "react";

interface BaseInfoCardProps {
  tender: Tender;
  onStatusChange?: (newStatus: TenderStatus) => void;
}

export function BaseInfoCard({ tender, onStatusChange }: BaseInfoCardProps) {
  const { t } = useTranslation();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);

  const handleStatusChange = async (newStatus: TenderStatus) => {
    setIsUpdatingStatus(true);
    try {
      if (onStatusChange) {
        await onStatusChange(newStatus);
      }
      setStatusPopoverOpen(false);
    } catch (error) {
      console.error("Error updating tender status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const { bg, text } = statusColors[tender.status];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{t("tender.basicInformation")}</CardTitle>
          <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
            <PopoverTrigger asChild>
              <Badge 
                variant="outline" 
                className={`cursor-pointer ml-4 flex items-center gap-1 ${bg} ${text}`}
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
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              {t("tender.title")}
            </dt>
            <dd className="text-sm mt-1">{tender.title}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              {t("tender.externalReference")}
            </dt>
            <dd className="text-sm mt-1">{tender.externalReference || "-"}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              {t("tender.internalReference")}
            </dt>
            <dd className="text-sm mt-1">{tender.internalReference}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
