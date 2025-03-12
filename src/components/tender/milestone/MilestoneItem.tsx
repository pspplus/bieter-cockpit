
import { Milestone } from "@/types/tender";
import { Circle, Clock, CheckCircle, XCircle, Edit, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useTranslation } from "react-i18next";

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
  totalMilestones: number;
  popoverContent: React.ReactNode;
  employees?: Array<{ id: string; name: string }>;
}

export function MilestoneItem({ 
  milestone, 
  index, 
  totalMilestones, 
  popoverContent,
  employees = []
}: MilestoneItemProps) {
  const { t } = useTranslation();
  
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

  // Funktion zum Ermitteln der Mitarbeiternamen
  const getAssigneeNames = (assigneeIds?: string[]) => {
    if (!assigneeIds || assigneeIds.length === 0) return [];
    
    return assigneeIds.map(id => {
      const employee = employees.find(e => e.id === id);
      return employee?.name || id;
    });
  };
  
  const statusColors = getStatusColors(milestone.status);
  const assigneeNames = getAssigneeNames(milestone.assignees);
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-col items-center relative flex-1 cursor-pointer group">
          {/* Connector line */}
          {index < totalMilestones - 1 && (
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
              
              {/* Assignees displayed under the milestone */}
              {assigneeNames.length > 0 && (
                <div className="mt-2 text-[10px] text-tender-600">
                  {assigneeNames.map((name, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-0.5 mt-0.5">
                      <User className="h-2.5 w-2.5" />
                      <span className="truncate max-w-24">{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverTrigger>
      {popoverContent}
    </Popover>
  );
}
