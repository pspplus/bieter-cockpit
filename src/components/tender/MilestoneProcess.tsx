
import { Milestone } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestoneProcessProps {
  milestones: Milestone[];
}

export function MilestoneProcess({ milestones }: MilestoneProcessProps) {
  const { t } = useTranslation();
  
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "skipped":
        return "bg-tender-400";
      default:
        return "bg-tender-200";
    }
  };
  
  if (sortedMilestones.length === 0) {
    return (
      <div className="text-sm text-tender-500 italic">
        {t('milestones.noMilestonesYet')}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-tender-700">
          {t('milestones.progress')}
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
      
      <div className="flex items-start overflow-x-auto pb-2 md:pb-0">
        <div className="flex items-start min-w-max">
          {sortedMilestones.map((milestone, index) => (
            <div key={milestone.id} className="flex flex-col items-center relative">
              {/* Connector line */}
              {index < sortedMilestones.length - 1 && (
                <div className={cn(
                  "absolute top-4 h-0.5 w-full left-0 -translate-y-1/2 z-0",
                  index < completedCount ? "bg-primary" : "bg-tender-200"
                )}></div>
              )}
              
              <div className="flex flex-col items-center relative z-10 px-4 md:px-6">
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
                
                {/* Milestone Title */}
                <div className="mt-2 text-center">
                  <p className={cn("text-xs font-medium truncate max-w-24 md:max-w-32", 
                    milestone.status === "completed" ? "text-green-700" :
                    milestone.status === "in-progress" ? "text-blue-700" :
                    milestone.status === "skipped" ? "text-tender-600" : 
                    "text-tender-500"
                  )}>
                    {milestone.title}
                  </p>
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
          ))}
        </div>
      </div>
    </div>
  );
}
