
import { Tender } from "@/types/tender";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, FileText, Lock, DollarSign, AlignLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { getStatusColors, getStatusDisplay } from "@/utils/statusUtils";

interface TenderCardProps {
  tender: Tender;
  isActive?: boolean;
}

export function TenderCard({ tender, isActive = false }: TenderCardProps) {
  const { t } = useTranslation();
  const { id, title, internalReference, externalReference, client, status, dueDate, location, bindingPeriodDate, budget, description } = tender;
  
  const statusColor = getStatusColors(status);
  const dueDateFormatted = format(new Date(dueDate), "MMM d, yyyy");
  
  // Calculate progress
  const completedMilestones = tender.milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const totalMilestones = tender.milestones.length;
  const progress = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : 0;

  // Use internal reference for display, fallback to external if needed
  const displayReference = internalReference || externalReference;

  // Truncate description for preview
  const descriptionPreview = description 
    ? description.length > 120 
      ? description.substring(0, 120) + "..." 
      : description
    : null;

  return (
    <Link to={`/tenders/${id}`}>
      <div 
        className={cn(
          "tender-card group hover:scale-[1.01]",
          isActive && "tender-card-active"
        )}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
            <p className="text-sm text-tender-500 mt-1">{displayReference}</p>
          </div>
          <Badge className={cn("ml-2", statusColor.bg, statusColor.text)}>
            {t(`tenderStatus.${status}`, getStatusDisplay(status))}
          </Badge>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-tender-600">
          {/* First row: Client (Vergabestelle) and Location (Ort) */}
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-tender-400" />
            <span className="truncate">{client}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-tender-400" />
              <span className="truncate">{location}</span>
            </div>
          )}
          
          {/* Second row: Due Date (Fällig am) and Binding Period (Bindefrist) */}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-tender-400" />
            <span>{t('tenderDetails.due')}: {dueDateFormatted}</span>
          </div>
          {bindingPeriodDate && (
            <div className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-tender-400" />
              <span>{t('tender.bindingPeriodDate')}: {format(new Date(bindingPeriodDate), "MMM d, yyyy")}</span>
            </div>
          )}
          
          {/* Third row: Budget */}
          {budget && (
            <div className="flex items-center gap-1.5 col-span-2">
              <DollarSign className="h-4 w-4 text-tender-400" />
              <span>{t('tender.budget')}: {budget.toLocaleString()} €</span>
            </div>
          )}
          
          {/* Description preview (new) */}
          {descriptionPreview && (
            <div className="flex items-start gap-1.5 col-span-2 mt-2">
              <AlignLeft className="h-4 w-4 text-tender-400 mt-0.5" />
              <p className="text-xs text-tender-600 line-clamp-3">{descriptionPreview}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-tender-600">Fortschritt</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-tender-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
