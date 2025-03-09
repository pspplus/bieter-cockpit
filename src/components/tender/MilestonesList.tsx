
import { Tender, Milestone, MilestoneStatus } from "@/types/tender";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTender } from "@/hooks/useTender";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

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
  const { updateMilestone, canUpdateMilestoneStatus } = useTender();
  const { t } = useTranslation();

  // Use useMemo to avoid re-sorting on every render
  const sortedMilestones = useMemo(() => {
    // Ensure we have valid sequence numbers before sorting
    const milestonesWithValidSequence = tender.milestones.map(m => ({
      ...m,
      sequenceNumber: typeof m.sequenceNumber === 'number' ? m.sequenceNumber : 0
    }));
    
    return [...milestonesWithValidSequence].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }, [tender.milestones]);

  // Memoize active milestones to avoid recalculation on every render
  const activeMilestones = useMemo(() => 
    sortedMilestones.filter(m => m.status === "in-progress"),
    [sortedMilestones]
  );

  const handleStatusChange = (milestone: Milestone, newStatus: MilestoneStatus) => {
    if (!canUpdateMilestoneStatus(milestone, newStatus)) {
      return;
    }

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
      
      {sortedMilestones.length === 0 ? (
        <div className="p-6 text-center border border-dashed rounded-lg text-tender-500">
          <p>{t('milestones.noMilestonesYet', 'Noch keine Meilensteine für dieses Angebot vorhanden.')}</p>
        </div>
      ) : (
        <div className="space-y-1">
          {sortedMilestones.map((milestone, index) => {
            const isActive = milestone.status === "in-progress";
            const canStart = canUpdateMilestoneStatus(milestone, "in-progress");
            const canComplete = milestone.status === "in-progress";
            const canSkip = canUpdateMilestoneStatus(milestone, "skipped");
            
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
                  <div className="mt-0.5 flex flex-col items-center">
                    <StatusIcon status={milestone.status} />
                    {index < sortedMilestones.length - 1 && (
                      <div className="h-6 w-px my-1 bg-tender-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-xs rounded-full bg-tender-100 text-tender-600 px-2 py-0.5">
                          {(milestone.sequenceNumber || 0)}
                        </span>
                        <h4 className="font-medium text-base">{milestone.title}</h4>
                        {isActive && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            {t('milestones.inProgress', 'In Bearbeitung')}
                          </span>
                        )}
                      </div>
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
                                className={cn(
                                  "h-8 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700",
                                  !canComplete && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => handleStatusChange(milestone, "completed")}
                                disabled={!canComplete}
                              >
                                {t('milestoneActions.complete')}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {canComplete 
                                ? t('milestones.markAsCompleted')
                                : t('milestones.cannotComplete', 'Meilenstein muss zuerst in Bearbeitung sein')}
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
                              {t('milestones.markAsInProgress')}
                            </TooltipContent>
                          </Tooltip>
                        )}
                        
                        {milestone.status !== "skipped" && milestone.status !== "completed" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className={cn(
                                  "h-8 border-tender-200 text-tender-600 hover:bg-tender-50 hover:text-tender-700",
                                  !canSkip && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => handleStatusChange(milestone, "skipped")}
                                disabled={!canSkip}
                              >
                                {t('milestoneActions.skip')}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {canSkip 
                                ? t('milestones.markAsSkipped')
                                : t('milestones.cannotSkip', 'Nur Meilensteine mit Status "ausstehend" können übersprungen werden')}
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
      )}
    </div>
  );
}
