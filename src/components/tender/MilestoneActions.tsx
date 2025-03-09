
import { Milestone, MilestoneStatus } from "@/types/tender";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

interface MilestoneActionsProps {
  milestone: Milestone;
  onStatusChange: (milestone: Milestone, newStatus: MilestoneStatus) => void;
}

export function MilestoneActions({ milestone, onStatusChange }: MilestoneActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <TooltipProvider>
        {milestone.status !== "completed" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => onStatusChange(milestone, "completed")}
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
                onClick={() => onStatusChange(milestone, "in-progress")}
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
                onClick={() => onStatusChange(milestone, "skipped")}
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
                onClick={() => onStatusChange(milestone, "pending")}
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
  );
}
