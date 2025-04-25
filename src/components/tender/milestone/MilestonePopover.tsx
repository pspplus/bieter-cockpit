
import { useState } from "react";
import { Milestone, MilestoneStatus, TenderStatus } from "@/types/tender";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MilestoneStatusButtons } from "./MilestoneStatusButtons";
import { MilestoneAssignees } from "./MilestoneAssignees";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";

interface MilestonePopoverProps {
  milestone: Milestone;
  employees: Array<{ id: string; name: string }>;
  isUpdating: boolean;
  onAssigneeAdd: (milestone: Milestone, employeeId: string) => Promise<void>;
  onAssigneeRemove: (milestone: Milestone, employeeId: string) => Promise<void>;
  onStatusChange: (milestone: Milestone, newStatus: MilestoneStatus) => Promise<void>;
  canUpdateMilestoneStatus: (milestone: Milestone, newStatus: MilestoneStatus) => boolean;
  onDueDateChange?: (milestone: Milestone, newDate: Date) => Promise<void>;
  canEdit?: boolean;
  tenderStatus?: TenderStatus;
}

export function MilestonePopover({
  milestone,
  employees,
  isUpdating,
  onAssigneeAdd,
  onAssigneeRemove,
  onStatusChange,
  canUpdateMilestoneStatus,
  onDueDateChange,
  canEdit = true,
  tenderStatus
}: MilestonePopoverProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(
    milestone.dueDate ? new Date(milestone.dueDate) : undefined
  );
  
  const handleDateChange = async (newDate: Date | undefined) => {
    if (newDate && onDueDateChange && canEdit) {
      setDate(newDate);
      await onDueDateChange(milestone, newDate);
    }
  };

  // Grund der Bearbeitungssperre erklären
  let editNotice: string | null = null;
  if (!canEdit) {
    if (tenderStatus === "gewonnen") {
      // Gesperrt wegen Status "gewonnen"
      editNotice = "Nach Zuschlag ist nur der Meilenstein 'Implementierung' bearbeitbar.";
    } else if (milestone.title === "Aufklärung") {
      editNotice = "Bearbeitung erst möglich, wenn die Ausschreibung im Status 'Aufklärung' ist.";
    } else if (milestone.title === "Implementierung") {
      editNotice = "Bearbeitung erst möglich, wenn die Ausschreibung im Status 'Gewonnen' ist.";
    }
  }
  
  return (
    <div className="w-64 p-2 space-y-4">
      <div>
        <h3 className="font-medium text-lg mb-1">{milestone.title}</h3>
        <p className="text-sm text-muted-foreground">{milestone.description}</p>
      </div>
      {!canEdit && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-2">
          {editNotice}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="due-date">Fälligkeitsdatum</Label>
        <DatePicker
          date={date}
          setDate={canEdit ? handleDateChange : undefined}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <MilestoneStatusButtons
          milestone={milestone}
          onStatusChange={(newStatus) => canEdit ? onStatusChange(milestone, newStatus) : Promise.resolve()}
          isUpdating={isUpdating}
          canUpdateMilestoneStatus={canUpdateMilestoneStatus}
        />
      </div>
      <div className="space-y-2">
        <Label>Zugewiesene Mitarbeiter</Label>
        <MilestoneAssignees
          milestone={milestone}
          employees={employees}
          onAssigneeAdd={canEdit ? onAssigneeAdd : () => Promise.resolve()}
          onAssigneeRemove={canEdit ? onAssigneeRemove : () => Promise.resolve()}
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
}
