
import { useState } from "react";
import { Milestone, MilestoneStatus } from "@/types/tender";
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
}

export function MilestonePopover({
  milestone,
  employees,
  isUpdating,
  onAssigneeAdd,
  onAssigneeRemove,
  onStatusChange,
  canUpdateMilestoneStatus,
  onDueDateChange
}: MilestonePopoverProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(
    milestone.dueDate ? new Date(milestone.dueDate) : undefined
  );
  
  const handleDateChange = async (newDate: Date | undefined) => {
    if (newDate && onDueDateChange) {
      setDate(newDate);
      await onDueDateChange(milestone, newDate);
    }
  };
  
  return (
    <div className="w-64 p-2 space-y-4">
      <div>
        <h3 className="font-medium text-lg mb-1">{milestone.title}</h3>
        <p className="text-sm text-muted-foreground">{milestone.description}</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="due-date">Fälligkeitsdatum</Label>
        <DatePicker
          date={date}
          setDate={handleDateChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Status</Label>
        <MilestoneStatusButtons
          currentStatus={milestone.status}
          onStatusChange={(newStatus) => onStatusChange(milestone, newStatus)}
          isUpdating={isUpdating}
          canUpdateStatus={(newStatus) => canUpdateMilestoneStatus(milestone, newStatus)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Zugewiesene Mitarbeiter</Label>
        <MilestoneAssignees
          milestone={milestone}
          employees={employees}
          onAssigneeAdd={onAssigneeAdd}
          onAssigneeRemove={onAssigneeRemove}
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
}
