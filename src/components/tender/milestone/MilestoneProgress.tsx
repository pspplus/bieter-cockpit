
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Milestone } from "@/types/tender";

interface MilestoneProgressProps {
  milestones: Milestone[];
}

export function MilestoneProgress({ milestones }: MilestoneProgressProps) {
  const { t } = useTranslation();
  
  // Count completions for progress calculation
  const completedCount = milestones.filter(m => m.status === "completed").length;
  const totalMilestones = milestones.length;
  const progress = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;
  
  return (
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
    </div>
  );
}
