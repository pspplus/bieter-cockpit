
import { Milestone, MilestoneStatus } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { Circle, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MilestoneStatusButtonsProps {
  milestone: Milestone;
  onStatusChange: (newStatus: MilestoneStatus) => Promise<void>;
  canUpdateMilestoneStatus: (milestone: Milestone, newStatus: MilestoneStatus) => boolean;
  isUpdating: boolean;
}

export function MilestoneStatusButtons({ 
  milestone, 
  onStatusChange, 
  canUpdateMilestoneStatus,
  isUpdating 
}: MilestoneStatusButtonsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <h5 className="text-xs font-medium">{t("milestones.updateStatus", "Status aktualisieren")}:</h5>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={milestone.status === "ausstehend" ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => onStatusChange("ausstehend")}
          disabled={isUpdating || milestone.status === "ausstehend"}
        >
          <Circle className="h-3 w-3 mr-1 text-tender-300" />
          {t("milestoneStatus.pending", "Ausstehend")}
        </Button>
        
        <Button
          variant={milestone.status === "in-bearbeitung" ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => onStatusChange("in-bearbeitung")}
          disabled={isUpdating || milestone.status === "in-bearbeitung"}
        >
          <Clock className="h-3 w-3 mr-1 text-blue-500" />
          {t("milestoneStatus.in-progress", "In Bearbeitung")}
        </Button>
        
        <Button
          variant={milestone.status === "abgeschlossen" ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => onStatusChange("abgeschlossen")}
          disabled={isUpdating || milestone.status === "abgeschlossen" || !canUpdateMilestoneStatus(milestone, "abgeschlossen")}
        >
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          {t("milestoneStatus.completed", "Abgeschlossen")}
        </Button>
        
        <Button
          variant={milestone.status === "uebersprungen" ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => onStatusChange("uebersprungen")}
          disabled={isUpdating || milestone.status === "uebersprungen" || !canUpdateMilestoneStatus(milestone, "uebersprungen")}
        >
          <XCircle className="h-3 w-3 mr-1 text-tender-400" />
          {t("milestoneStatus.skipped", "Übersprungen")}
        </Button>
      </div>
    </div>
  );
}
