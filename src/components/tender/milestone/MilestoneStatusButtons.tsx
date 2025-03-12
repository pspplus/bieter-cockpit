
import { Milestone, MilestoneStatus } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { Circle, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MilestoneStatusButtonsProps {
  milestone: Milestone;
  onStatusChange: (milestone: Milestone, newStatus: MilestoneStatus) => Promise<void>;
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
          variant={milestone.status === "pending" ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => onStatusChange(milestone, "pending")}
          disabled={isUpdating || milestone.status === "pending"}
        >
          <Circle className="h-3 w-3 mr-1 text-tender-300" />
          {t("milestoneStatus.pending", "Ausstehend")}
        </Button>
        
        <Button
          variant={milestone.status === "in-progress" ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => onStatusChange(milestone, "in-progress")}
          disabled={isUpdating || milestone.status === "in-progress"}
        >
          <Clock className="h-3 w-3 mr-1 text-blue-500" />
          {t("milestoneStatus.in-progress", "In Bearbeitung")}
        </Button>
        
        <Button
          variant={milestone.status === "completed" ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => onStatusChange(milestone, "completed")}
          disabled={isUpdating || milestone.status === "completed" || !canUpdateMilestoneStatus(milestone, "completed")}
        >
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          {t("milestoneStatus.completed", "Abgeschlossen")}
        </Button>
        
        <Button
          variant={milestone.status === "skipped" ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => onStatusChange(milestone, "skipped")}
          disabled={isUpdating || milestone.status === "skipped" || !canUpdateMilestoneStatus(milestone, "skipped")}
        >
          <XCircle className="h-3 w-3 mr-1 text-tender-400" />
          {t("milestoneStatus.skipped", "Übersprungen")}
        </Button>
      </div>
    </div>
  );
}
