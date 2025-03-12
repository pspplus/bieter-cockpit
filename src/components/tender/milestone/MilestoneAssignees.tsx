
import { Milestone } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { Users, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface MilestoneAssigneesProps {
  milestone: Milestone;
  employees: Array<{ id: string; name: string }>;
  onAssigneeAdd: (milestone: Milestone, employeeId: string) => Promise<void>;
  onAssigneeRemove: (milestone: Milestone, employeeId: string) => Promise<void>;
  isUpdating: boolean;
}

export function MilestoneAssignees({ 
  milestone, 
  employees, 
  onAssigneeAdd, 
  onAssigneeRemove, 
  isUpdating 
}: MilestoneAssigneesProps) {
  const { t } = useTranslation();
  
  // Debugausgabe zum Verfolgen der zugewiesenen Mitarbeiter
  console.log("Current milestone assignees:", milestone.assignees);
  
  return (
    <div className="space-y-2">
      <h5 className="text-xs font-medium flex items-center">
        <Users className="h-3 w-3 mr-1" />
        {t("milestones.assignees", "Zuständige Mitarbeiter")}:
      </h5>
      
      <div className="flex flex-wrap gap-1 mb-2 min-h-[30px]">
        {(!milestone.assignees || milestone.assignees.length === 0) && (
          <p className="text-xs text-tender-500 italic">
            {t("milestones.noAssignees", "Keine Mitarbeiter zugewiesen")}
          </p>
        )}
        
        {milestone.assignees?.map(assigneeId => {
          const employee = employees.find(e => e.id === assigneeId);
          return (
            <Badge key={assigneeId} variant="secondary" className="flex items-center gap-1">
              <span className="max-w-[150px] truncate">
                {employee?.name || assigneeId}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onAssigneeRemove(milestone, assigneeId);
                }}
                disabled={isUpdating}
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>
      
      <div className="flex items-center gap-2">
        <Select 
          onValueChange={(value) => {
            console.log("Selected employee:", value);
            onAssigneeAdd(milestone, value);
          }}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder={t("milestones.addAssignee", "Mitarbeiter hinzufügen")} />
          </SelectTrigger>
          <SelectContent>
            {employees.map(employee => (
              <SelectItem 
                key={employee.id} 
                value={employee.id}
                disabled={milestone.assignees?.includes(employee.id)}
                className="text-xs"
              >
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
