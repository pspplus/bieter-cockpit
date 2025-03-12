
import { Milestone } from "@/types/tender";
import { PopoverContent } from "@/components/ui/popover";
import { MilestoneAssignees } from "./MilestoneAssignees";
import { MilestoneStatusButtons } from "./MilestoneStatusButtons";
import { MilestoneStatus } from "@/types/tender";

interface MilestonePopoverProps {
  milestone: Milestone;
  employees: Array<{ id: string; name: string }>;
  isUpdating: boolean;
  onAssigneeAdd: (milestone: Milestone, employeeId: string) => Promise<void>;
  onAssigneeRemove: (milestone: Milestone, employeeId: string) => Promise<void>;
  onStatusChange: (milestone: Milestone, newStatus: MilestoneStatus) => Promise<void>;
  canUpdateMilestoneStatus: (milestone: Milestone, newStatus: MilestoneStatus) => boolean;
}

export function MilestonePopover({
  milestone,
  employees,
  isUpdating,
  onAssigneeAdd,
  onAssigneeRemove,
  onStatusChange,
  canUpdateMilestoneStatus
}: MilestonePopoverProps) {
  return (
    <PopoverContent className="w-80 p-4" align="center">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm">{milestone.title}</h4>
          {milestone.description && (
            <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
          )}
        </div>
        
        {/* Assignees Section */}
        <MilestoneAssignees
          milestone={milestone}
          employees={employees}
          onAssigneeAdd={onAssigneeAdd}
          onAssigneeRemove={onAssigneeRemove}
          isUpdating={isUpdating}
        />
        
        {/* Status Buttons */}
        <MilestoneStatusButtons
          milestone={milestone}
          onStatusChange={onStatusChange}
          canUpdateMilestoneStatus={canUpdateMilestoneStatus}
          isUpdating={isUpdating}
        />
      </div>
    </PopoverContent>
  );
}
