
import { Milestone } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { CheckCircle, Circle, Clock, XCircle, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTender } from "@/hooks/useTender";
import { toast } from "sonner";

interface MilestoneProcessProps {
  milestones: Milestone[];
  tenderId?: string;
}

export function MilestoneProcess({ milestones, tenderId }: MilestoneProcessProps) {
  const { t } = useTranslation();
  const { updateMilestone, canUpdateMilestoneStatus } = useTender();
  const [updating, setUpdating] = useState(false);
  
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
        status: newStatus
      });
      
      toast.success(t("milestones.statusUpdated", "Meilenstein-Status aktualisiert"));
    } catch (error) {
      console.error("Error updating milestone status:", error);
      toast.error(t("milestones.updateError", "Fehler beim Aktualisieren des Status"));
    } finally {
      setUpdating(false);
    }
  };
  
  if (sortedMilestones.length === 0) {
    return (
      <div className="text-sm text-tender-500 italic">
        {t('milestones.noMilestonesYet', "Noch keine Meilensteine vorhanden")}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-tender-700">
          {t('milestones.progress', "Fortschritt")}
        </h3>
        <span className="text-sm font-medium">
          {progress}%
        </span>
      </div>
      
      <div className="w-full bg-tender-100 rounded-full h-2 mb-4">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="relative w-full overflow-x-auto pb-2 md:pb-0 mt-6">
        <div className="flex w-full">
          {sortedMilestones.map((milestone, index) => (
            <Popover key={milestone.id}>
              <PopoverTrigger asChild>
                <div 
                  className="flex flex-col items-center relative flex-1 cursor-pointer group"
                >
                  {/* Connector line */}
                  {index < sortedMilestones.length - 1 && (
                    <div className={cn(
                      "absolute top-4 h-0.5 w-full left-1/2 -translate-y-1/2 z-0",
                      milestone.status === "completed" ? "bg-primary" : "bg-tender-200"
                    )}></div>
                  )}
                  
                  <div className="flex flex-col items-center relative z-10">
                    {/* Status Icon */}
                    <div className={cn(
                      "rounded-full p-1 bg-white border-2",
                      milestone.status === "completed" ? "border-green-500" :
                      milestone.status === "in-progress" ? "border-blue-500" :
                      milestone.status === "skipped" ? "border-tender-400" : 
                      "border-tender-200"
                    )}>
                      {getStatusIcon(milestone.status)}
                    </div>
                    
                    {/* Show edit indicator on hover */}
                    <div className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary rounded-full p-0.5">
                        <Edit className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    
                    {/* Milestone Title */}
                    <div className="mt-2 text-center w-full px-1">
                      <div className={cn(
                        "text-xs font-medium break-words hyphens-auto", 
                        milestone.status === "completed" ? "text-green-700" :
                        milestone.status === "in-progress" ? "text-blue-700" :
                        milestone.status === "skipped" ? "text-tender-600" : 
                        "text-tender-500"
                      )}>
                        {/* Add tooltip for longer titles */}
                        <span title={milestone.title} className="inline-block max-w-24 md:max-w-full">
                          {milestone.title}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full", 
                          milestone.status === "completed" ? "bg-green-100 text-green-800" :
                          milestone.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                          milestone.status === "skipped" ? "bg-tender-100 text-tender-700" : 
                          "bg-tender-50 text-tender-600"
                        )}>
                          {t(`milestoneStatus.${milestone.status}`)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4" align="center">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">{milestone.title}</h4>
                    {milestone.description && (
                      <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                    )}
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
          ))}
        </div>
      </div>
    </div>
  );
}
