
import { Milestone } from "@/types/tender";
import { MilestoneItem } from "./MilestoneItem";
import { MilestonePopover } from "./MilestonePopover";
import { MilestoneStatus } from "@/types/tender";

interface MilestoneLineProps {
  milestones: Milestone[];
  employees: Array<{ id: string; name: string }>;
  isUpdating: boolean;
  onAssigneeAdd: (milestone: Milestone, employeeId: string) => Promise<void>;
  onAssigneeRemove: (milestone: Milestone, employeeId: string) => Promise<void>;
  onStatusChange: (milestone: Milestone, newStatus: MilestoneStatus) => Promise<void>;
  canUpdateMilestoneStatus: (milestone: Milestone, newStatus: MilestoneStatus) => boolean;
}

export function MilestoneLine({
  milestones,
  employees,
  isUpdating,
  onAssigneeAdd,
  onAssigneeRemove,
  onStatusChange,
  canUpdateMilestoneStatus
}: MilestoneLineProps) {
  // Ensure milestones are sorted by sequence number
  const sortedMilestones = [...milestones].sort((a, b) => 
    (a.sequenceNumber || 0) - (b.sequenceNumber || 0)
  );
  
  return (
    <div className="relative w-full overflow-x-auto pb-2 md:pb-0 my-8">
      <div className="flex w-full">
        {sortedMilestones.map((milestone, index) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            index={index}
            totalMilestones={sortedMilestones.length}
            popoverContent={
              <MilestonePopover
                milestone={milestone}
                employees={employees}
                isUpdating={isUpdating}
                onAssigneeAdd={onAssigneeAdd}
                onAssigneeRemove={onAssigneeRemove}
                onStatusChange={onStatusChange}
                canUpdateMilestoneStatus={canUpdateMilestoneStatus}
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
