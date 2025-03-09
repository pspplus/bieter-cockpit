
import { Tender, TenderDocument } from "@/types/tender";
import { format } from "date-fns";
import { Calendar, File, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface TenderStatsProps {
  tender: Tender;
  documentCount: number;
}

export function TenderStats({ tender, documentCount }: TenderStatsProps) {
  const { t } = useTranslation();
  
  // Calculate progress
  const completedMilestones = tender.milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const totalMilestones = tender.milestones.length;
  const progress = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : 0;

  // Format dates
  const dueDateFormatted = format(new Date(tender.dueDate), "MMMM d, yyyy");
  
  // Check if the due date is in the past
  const isDueDatePast = new Date(tender.dueDate) < new Date();

  return (
    <div className="flex flex-wrap gap-2">
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
        isDueDatePast ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
      )}>
        <Calendar className="h-4 w-4" />
        <span>{t('tenderDetails.due')}: {dueDateFormatted}</span>
      </div>
      
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tender-50 text-tender-600 text-sm">
        <FileText className="h-4 w-4" />
        <span>{t('tenderDetails.progress')}: {progress}%</span>
      </div>
      
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm">
        <File className="h-4 w-4" />
        <span>{t('tenderDetails.documents')}: {documentCount}</span>
      </div>
    </div>
  );
}
