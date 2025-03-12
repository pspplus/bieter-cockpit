import { Milestone, MilestoneStatus } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTender } from "@/hooks/useTender";
import { toast } from "sonner";
import { MilestoneProgress } from "./MilestoneProgress";
import { MilestoneLine } from "./MilestoneLine";

interface MilestoneProcessProps {
  milestones: Milestone[];
  tenderId?: string;
}

export function MilestoneProcess({ milestones, tenderId }: MilestoneProcessProps) {
  const { t } = useTranslation();
  const { updateMilestone, canUpdateMilestoneStatus } = useTender();
  const [updating, setUpdating] = useState(false);
  
  // Mock employees list - in a real application, this would come from a database
  const employees = [
    { id: "1", name: "Max Mustermann" },
    { id: "2", name: "Jane Doe" },
    { id: "3", name: "John Smith" },
    { id: "4", name: "Anna Müller" },
    { id: "5", name: "Thomas Weber" },
  ];
  
  const handleStatusChange = async (milestone: Milestone, newStatus: MilestoneStatus) => {
    if (!tenderId) return;
    
    try {
      setUpdating(true);
      
      if (!canUpdateMilestoneStatus(milestone, newStatus)) {
        toast.error(t("milestones.invalidStatusTransition", "Ungültiger Statusübergang"));
        return;
      }
      
      await updateMilestone({
        ...milestone,
        status: newStatus,
        // Set or clear completionDate based on status
        completionDate: newStatus === 'completed' ? new Date() : null
      });
      
      toast.success(t("milestones.statusUpdated", "Meilenstein-Status aktualisiert"));
    } catch (error) {
      console.error("Error updating milestone status:", error);
      toast.error(t("milestones.updateError", "Fehler beim Aktualisieren des Status"));
    } finally {
      setUpdating(false);
    }
  };
  
  const handleAssigneeAdd = async (milestone: Milestone, employeeId: string) => {
    if (!tenderId) return;
    
    try {
      setUpdating(true);
      
      // Get employee name for better UX messaging
      const employee = employees.find(e => e.id === employeeId);
      
      // Prepare the updated assignees list, ensuring we don't add duplicates
      const currentAssignees = milestone.assignees || [];
      if (currentAssignees.includes(employeeId)) {
        toast.info(t("milestones.alreadyAssigned", "Mitarbeiter bereits zugewiesen"));
        return;
      }
      
      const updatedAssignees = [...currentAssignees, employeeId];
      
      await updateMilestone({
        ...milestone,
        assignees: updatedAssignees
      });
      
      toast.success(
        t("milestones.assigneeAdded", "Mitarbeiter {{name}} zugewiesen", { 
          name: employee?.name || employeeId 
        })
      );
    } catch (error) {
      console.error("Error adding assignee:", error);
      toast.error(t("milestones.assigneeError", "Fehler beim Zuweisen des Mitarbeiters"));
    } finally {
      setUpdating(false);
    }
  };

  const handleAssigneeRemove = async (milestone: Milestone, employeeId: string) => {
    if (!tenderId) return;
    
    try {
      setUpdating(true);
      
      // Get employee name for better UX messaging
      const employee = employees.find(e => e.id === employeeId);
      
      // Remove the assignee
      const updatedAssignees = (milestone.assignees || []).filter(id => id !== employeeId);
      
      await updateMilestone({
        ...milestone,
        assignees: updatedAssignees
      });
      
      toast.success(
        t("milestones.assigneeRemoved", "Mitarbeiter {{name}} entfernt", { 
          name: employee?.name || employeeId 
        })
      );
    } catch (error) {
      console.error("Error removing assignee:", error);
      toast.error(t("milestones.assigneeRemoveError", "Fehler beim Entfernen des Mitarbeiters"));
    } finally {
      setUpdating(false);
    }
  };
  
  if (milestones.length === 0) {
    return (
      <div className="text-sm text-tender-500 italic">
        {t('milestones.noMilestonesYet', "Noch keine Meilensteine vorhanden")}
      </div>
    );
  }
  
  return (
    <Card className="p-4 bg-white shadow-sm border border-tender-100">
      <CardContent className="p-0">
        <div className="space-y-4">
          <MilestoneProgress milestones={milestones} />
          
          <div className="min-h-[320px] h-full">
            <MilestoneLine 
              milestones={milestones}
              employees={employees}
              isUpdating={updating}
              onAssigneeAdd={handleAssigneeAdd}
              onAssigneeRemove={handleAssigneeRemove}
              onStatusChange={handleStatusChange}
              canUpdateMilestoneStatus={canUpdateMilestoneStatus}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
