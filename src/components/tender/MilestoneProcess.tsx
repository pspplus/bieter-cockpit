
import { Milestone } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { CheckCircle, Circle, Clock, XCircle, Edit, UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTender } from "@/hooks/useTender";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface MilestoneProcessProps {
  milestones: Milestone[];
  tenderId?: string;
}

export function MilestoneProcess({ milestones, tenderId }: MilestoneProcessProps) {
  const { t } = useTranslation();
  const { updateMilestone, canUpdateMilestoneStatus } = useTender();
  const [updating, setUpdating] = useState(false);
  const [newAssignee, setNewAssignee] = useState("");
  
  // Mock employees list - in a real application, this would come from a database
  const employees = [
    { id: "1", name: "Max Mustermann" },
    { id: "2", name: "Jane Doe" },
    { id: "3", name: "John Smith" },
    { id: "4", name: "Anna Müller" },
    { id: "5", name: "Thomas Weber" },
  ];
  
  // Ensure milestones are sorted by sequence number
  const sortedMilestones = [...milestones].sort((a, b) => 
    (a.sequenceNumber || 0) - (b.sequenceNumber || 0)
  );
  
  // Count completions for progress calculation
  const completedCount = milestones.filter(m => m.status === "completed").length;
  const totalMilestones = milestones.length;
  const progress = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "skipped":
        return <XCircle className="h-5 w-5 text-tender-400" />;
      default:
        return <Circle className="h-5 w-5 text-tender-300" />;
    }
  };
  
  const getStatusColors = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: "border-green-500",
          text: "text-green-700",
          badge: "bg-green-100 text-green-800"
        };
      case "in-progress":
        return {
          icon: "border-blue-500", 
          text: "text-blue-700",
          badge: "bg-blue-100 text-blue-800"
        };
      case "skipped":
        return {
          icon: "border-tender-400", 
          text: "text-tender-600",
          badge: "bg-tender-100 text-tender-700"
        };
      default:
        return {
          icon: "border-tender-200", 
          text: "text-tender-500",
          badge: "bg-tender-50 text-tender-600"
        };
    }
  };
  
  const handleStatusChange = async (milestone: Milestone, newStatus: "pending" | "in-progress" | "completed" | "skipped") => {
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
  
  const getAssigneesDisplay = (assignees?: string[]) => {
    if (!assignees || assignees.length === 0) {
      return null;
    }
    
    const displayCount = assignees.length;
    return (
      <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5">
        <div className="flex items-center justify-center">
          <Users className="h-3 w-3 text-white" />
          <span className="text-white text-[10px] ml-0.5 font-medium">{displayCount}</span>
        </div>
      </div>
    );
  };
  
  if (sortedMilestones.length === 0) {
    return (
      <div className="text-sm text-tender-500 italic">
        {t('milestones.noMilestonesYet', "Noch keine Meilensteine vorhanden")}
      </div>
    );
  }
  
  return (
    <Card className="p-4 bg-white shadow-sm border border-tender-100">
      <CardContent className="p-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-tender-700">
              {t('milestones.progress', "Fortschritt")}
            </h3>
            <span className="text-sm font-medium">
              {progress}%
            </span>
          </div>
          
          <div className="w-full bg-tender-100 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Increased spacing here with my-8 instead of mt-4 */}
          <div className="relative w-full overflow-x-auto pb-2 md:pb-0 my-8">
            <div className="flex w-full">
              {sortedMilestones.map((milestone, index) => {
                const statusColors = getStatusColors(milestone.status);
                
                return (
                  <Popover key={milestone.id}>
                    <PopoverTrigger asChild>
                      <div className="flex flex-col items-center relative flex-1 cursor-pointer group">
                        {/* Connector line */}
                        {index < sortedMilestones.length - 1 && (
                          <div className={cn(
                            "absolute top-4 h-0.5 w-full left-1/2 -translate-y-1/2 z-0",
                            milestone.status === "completed" ? "bg-primary" : "bg-tender-200"
                          )}></div>
                        )}
                        
                        <div className="flex flex-col items-center relative z-10">
                          {/* Status Icon - made larger for better visibility */}
                          <div className={cn(
                            "rounded-full p-1.5 bg-white border-2",
                            statusColors.icon
                          )}>
                            {getStatusIcon(milestone.status)}
                            {getAssigneesDisplay(milestone.assignees)}
                          </div>
                          
                          {/* Show edit indicator on hover */}
                          <div className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-primary rounded-full p-0.5">
                              <Edit className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          
                          {/* Milestone Title - added more spacing with mt-3 */}
                          <div className="mt-3 text-center w-full px-1">
                            <div className={cn(
                              "text-xs font-medium break-words hyphens-auto",
                              statusColors.text
                            )}>
                              <span title={milestone.title} className="inline-block max-w-24 md:max-w-full">
                                {milestone.title}
                              </span>
                            </div>
                            <div className="mt-1">
                              <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full", 
                                statusColors.badge
                              )}>
                                {t(`milestoneStatus.${milestone.status}`)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="center">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm">{milestone.title}</h4>
                          {milestone.description && (
                            <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                          )}
                        </div>
                        
                        {/* Assignees Section */}
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {t("milestones.assignees", "Zuständige Mitarbeiter")}:
                          </h5>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
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
                                      handleAssigneeRemove(milestone, assigneeId);
                                    }}
                                    disabled={updating}
                                  >
                                    <XCircle className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              );
                            })}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Select 
                              onValueChange={(value) => handleAssigneeAdd(milestone, value)}
                              disabled={updating}
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
                        
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium">{t("milestones.updateStatus", "Status aktualisieren")}:</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={milestone.status === "pending" ? "default" : "outline"}
                              size="sm"
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(milestone, "pending")}
                              disabled={updating || milestone.status === "pending"}
                            >
                              <Circle className="h-3 w-3 mr-1 text-tender-300" />
                              {t("milestoneStatus.pending", "Ausstehend")}
                            </Button>
                            
                            <Button
                              variant={milestone.status === "in-progress" ? "default" : "outline"}
                              size="sm"
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(milestone, "in-progress")}
                              disabled={updating || milestone.status === "in-progress"}
                            >
                              <Clock className="h-3 w-3 mr-1 text-blue-500" />
                              {t("milestoneStatus.in-progress", "In Bearbeitung")}
                            </Button>
                            
                            <Button
                              variant={milestone.status === "completed" ? "default" : "outline"}
                              size="sm"
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(milestone, "completed")}
                              disabled={updating || milestone.status === "completed" || !canUpdateMilestoneStatus(milestone, "completed")}
                            >
                              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                              {t("milestoneStatus.completed", "Abgeschlossen")}
                            </Button>
                            
                            <Button
                              variant={milestone.status === "skipped" ? "default" : "outline"}
                              size="sm"
                              className="text-xs h-8"
                              onClick={() => handleStatusChange(milestone, "skipped")}
                              disabled={updating || milestone.status === "skipped" || !canUpdateMilestoneStatus(milestone, "skipped")}
                            >
                              <XCircle className="h-3 w-3 mr-1 text-tender-400" />
                              {t("milestoneStatus.skipped", "Übersprungen")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
