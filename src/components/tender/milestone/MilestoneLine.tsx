
import React from "react";
import { Milestone, MilestoneStatus, TenderStatus } from "@/types/tender";
import { MilestoneItem } from "./MilestoneItem";
import { MilestonePopover } from "./MilestonePopover";

interface MilestoneLineProps {
  milestones: Milestone[];
  employees: Array<{ id: string; name: string }>;
  isUpdating: boolean;
  onAssigneeAdd: (milestone: Milestone, employeeId: string) => Promise<void>;
  onAssigneeRemove: (milestone: Milestone, employeeId: string) => Promise<void>;
  onStatusChange: (milestone: Milestone, newStatus: MilestoneStatus) => Promise<void>;
  canUpdateMilestoneStatus: (milestone: Milestone, newStatus: MilestoneStatus) => boolean;
  onDueDateChange?: (milestone: Milestone, newDate: Date) => Promise<void>;
  tenderStatus?: TenderStatus;
}

// Utility type guard to ensure status string is of type TenderStatus
function isTenderStatus(status: any): status is TenderStatus {
  return [
    "entwurf",
    "in-pruefung",
    "in-bearbeitung",
    "abgegeben",
    "aufklaerung",
    "gewonnen",
    "verloren",
    "abgeschlossen",
  ].includes(status);
}

export function MilestoneLine({
  milestones,
  employees,
  isUpdating,
  onAssigneeAdd,
  onAssigneeRemove,
  onStatusChange,
  canUpdateMilestoneStatus,
  onDueDateChange,
  tenderStatus
}: MilestoneLineProps) {
  return (
    <div className="flex flex-row w-full">
      {milestones.map((milestone, idx) => {
        let canEdit = true;

        // Sicherstellen, dass tenderStatus ein gültiger Wert ist
        if (isTenderStatus(tenderStatus) && tenderStatus === "gewonnen") {
          canEdit = milestone.title === "Implementierung";
        } else if (milestone.title === "Aufklärung") {
          canEdit = tenderStatus === "aufklaerung";
        } else if (milestone.title === "Implementierung") {
          canEdit = tenderStatus === "gewonnen";
        }

        return (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            index={idx}
            totalMilestones={milestones.length}
            employees={employees}
            popoverContent={
              <MilestonePopover
                milestone={milestone}
                employees={employees}
                isUpdating={isUpdating}
                onAssigneeAdd={onAssigneeAdd}
                onAssigneeRemove={onAssigneeRemove}
                onStatusChange={onStatusChange}
                canUpdateMilestoneStatus={canUpdateMilestoneStatus}
                onDueDateChange={onDueDateChange}
                canEdit={canEdit}
                tenderStatus={tenderStatus}
              />
            }
            canEdit={canEdit}
          />
        );
      })}
    </div>
  );
}

