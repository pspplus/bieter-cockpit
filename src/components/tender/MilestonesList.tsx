
import { Tender, Milestone, MilestoneStatus } from "@/types/tender";
import { useMilestone } from "@/hooks/useMilestone";
import { useTranslation } from "react-i18next";
import { MilestoneItem } from "./MilestoneItem";

interface MilestonesListProps {
  tender: Tender;
}

export function MilestonesList({ tender }: MilestonesListProps) {
  const { updateMilestone } = useMilestone();
  const { t } = useTranslation();

  const sortedMilestones = [...tender.milestones].sort((a, b) => {
    const statusOrder: Record<MilestoneStatus, number> = {
      "in-progress": 0,
      "pending": 1,
      "completed": 2,
      "skipped": 3,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const isActiveMilestone = (milestone: Milestone): boolean => {
    if (milestone.status === "in-progress") return true;
    
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
        {sortedMilestones.map((milestone) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            isActive={isActiveMilestone(milestone)}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
