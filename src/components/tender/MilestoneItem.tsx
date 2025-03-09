
import { Milestone, MilestoneStatus } from "@/types/tender";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { MilestoneStatusIcon } from "./MilestoneStatusIcon";
import { MilestoneActions } from "./MilestoneActions";

interface MilestoneItemProps {
  milestone: Milestone;
  isActive: boolean;
  onStatusChange: (milestone: Milestone, newStatus: MilestoneStatus) => void;
}

export function MilestoneItem({ milestone, isActive, onStatusChange }: MilestoneItemProps) {
  const { t } = useTranslation();
  
  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all duration-200 hover:border-tender-200",
        isActive
          ? "border-primary/30 bg-primary/5"
          : "border-tender-100",
        milestone.status === "completed" && "bg-green-50/50",
        milestone.status === "skipped" && "bg-tender-50/50 opacity-75"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <MilestoneStatusIcon status={milestone.status} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-base">{milestone.title}</h4>
            {milestone.dueDate && (
              <span className="text-xs text-tender-500">
                {t('milestones.dueDate')}: {format(new Date(milestone.dueDate), "MMM d")}
              </span>
            )}
          </div>
          <p className="text-sm text-tender-600 mt-1">
            {milestone.description}
          </p>
          
          {milestone.completionDate && (
            <p className="text-xs text-tender-500 mt-2">
              {t('milestones.completionDate')}: {format(new Date(milestone.completionDate), "MMM d, yyyy")}
            </p>
          )}
          
          <MilestoneActions 
            milestone={milestone} 
            onStatusChange={onStatusChange} 
          />
        </div>
      </div>
    </div>
  );
}
