
import { Tender, Milestone, MilestoneStatus } from "@/types/tender";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTender } from "@/context/TenderContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface MilestonesListProps {
  tender: Tender;
}

interface StatusIconProps {
  status: MilestoneStatus;
}

function StatusIcon({ status }: StatusIconProps) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "skipped":
      return <XCircle className="h-5 w-5 text-tender-400" />;
    default:
      return <Circle className="h-5 w-5 text-tender-300" />;
  }
}

export function MilestonesList({ tender }: MilestonesListProps) {
  const { updateMilestone } = useTender();
  const { t } = useTranslation();

  // Sort milestones by status: in-progress first, then pending, then completed, then skipped
  const sortedMilestones = [...tender.milestones].sort((a, b) => {
    const statusOrder: Record<MilestoneStatus, number> = {
      "in-progress": 0,
      "pending": 1,
      "completed": 2,
      "skipped": 3,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Helper to determine if a milestone is the current active one
  const isActiveMilestone = (milestone: Milestone, index: number): boolean => {
    if (milestone.status === "in-progress") return true;
    
    // If no milestone is in progress, the first pending one is active
    if (
      milestone.status === "pending" &&
      !sortedMilestones.some((m) => m.status === "in-progress")
    ) {
      const pendingMilestones = sortedMilestones.filter(
        (m) => m.status === "pending"
      );
      return pendingMilestones.indexOf(milestone) === 0;
    }
    
    return false;
  };

  const handleStatusChange = (milestone: Milestone, newStatus: MilestoneStatus) => {
    const updatedMilestone = {
      ...milestone,
      status: newStatus,
      completionDate: newStatus === "completed" ? new Date() : milestone.completionDate
    };
    updateMilestone(updatedMilestone);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('milestones.milestones')}</h3>
      <div className="space-y-1">
        {sortedMilestones.map((milestone, index) => {
          const isActive = isActiveMilestone(milestone, index);
          
          return (
            <div
              key={milestone.id}
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
                  <StatusIcon status={milestone.status} />
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
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <TooltipProvider>
                      {milestone.status !== "completed" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                              onClick={() => handleStatusChange(milestone, "completed")}
                            >
                              {t('milestoneActions.complete')}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('milestones.markAsCompleted')}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {milestone.status !== "in-progress" && milestone.status !== "completed" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              onClick={() => handleStatusChange(milestone, "in-progress")}
                            >
                              {t('milestoneActions.start')}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('milestones.markAsInProgress')}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {milestone.status !== "skipped" && milestone.status !== "completed" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-tender-200 text-tender-600 hover:bg-tender-50 hover:text-tender-700"
                              onClick={() => handleStatusChange(milestone, "skipped")}
                            >
                              {t('milestoneActions.skip')}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('milestones.markAsSkipped')}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {(milestone.status === "completed" || milestone.status === "skipped") && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-tender-200 text-tender-600 hover:bg-tender-50 hover:text-tender-700"
                              onClick={() => handleStatusChange(milestone, "pending")}
                            >
                              {t('milestoneActions.reset')}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('milestones.markAsPending')}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
