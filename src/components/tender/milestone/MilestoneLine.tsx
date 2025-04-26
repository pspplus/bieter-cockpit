
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
  tenderId?: string;
}

// Verbesserte Type Guard Funktion
function isTenderStatus(status: any): status is TenderStatus {
  const validStatuses: TenderStatus[] = [
    "entwurf",
    "in-pruefung",
    "in-bearbeitung",
    "abgegeben",
    "aufklaerung",
    "gewonnen",
    "verloren",
    "abgeschlossen",
    "nicht-abgegeben"
  ];
  return validStatuses.includes(status);
}

// Neue Funktion zur Prüfung der Bearbeitungsrechte
function canEditMilestone(milestone: Milestone, status: TenderStatus | undefined): boolean {
  if (!status || !isTenderStatus(status)) {
    return true; // Standardmäßig erlauben, wenn kein Status gesetzt ist
  }

  if (status === "gewonnen") {
    return milestone.title === "Implementierung";
  }

  if (milestone.title === "Aufklärung") {
    return status === "aufklaerung";
  }

  if (milestone.title === "Implementierung") {
    return status === "gewonnen";
  }

  return true; // Für alle anderen Fälle erlauben
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
  tenderStatus,
  tenderId
}: MilestoneLineProps) {
  return (
    <div className="flex flex-row w-full">
      {milestones.map((milestone, idx) => {
        const canEdit = canEditMilestone(milestone, tenderStatus);

        return (
          <MilestoneItem
            key={milestone.id}
            milestone={{ ...milestone, tenderId }}
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
