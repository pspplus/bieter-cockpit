
import { Tender } from "@/types/tender";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface TenderCardProps {
  tender: Tender;
  isActive?: boolean;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  "entwurf": { bg: "bg-tender-100", text: "text-tender-600" },
  "in-pruefung": { bg: "bg-amber-100", text: "text-amber-600" },
  "in-bearbeitung": { bg: "bg-blue-100", text: "text-blue-600" },
  "abgegeben": { bg: "bg-indigo-100", text: "text-indigo-600" },
  "aufklaerung": { bg: "bg-purple-100", text: "text-purple-600" },
  "gewonnen": { bg: "bg-green-100", text: "text-green-600" },
  "verloren": { bg: "bg-red-100", text: "text-red-600" },
  "abgeschlossen": { bg: "bg-teal-100", text: "text-teal-600" },
  // Fallback for any potential unknown statuses
  "default": { bg: "bg-gray-100", text: "text-gray-600" }
};

export function TenderCard({ tender, isActive = false }: TenderCardProps) {
  const { t } = useTranslation();
  const { id, title, internalReference, externalReference, client, status, dueDate, location } = tender;
  
  const statusColor = statusColors[status] || statusColors.default;
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

  // Function to format the status text
  const formatStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      "entwurf": "Entwurf",
      "in-pruefung": "In Prüfung",
      "in-bearbeitung": "In Bearbeitung",
      "abgegeben": "Abgegeben",
      "aufklaerung": "Aufklärung",
      "gewonnen": "Gewonnen",
      "verloren": "Verloren",
      "abgeschlossen": "Abgeschlossen"
    };
    
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

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
            {formatStatusText(status)}
          </Badge>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-tender-600">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-tender-400" />
            <span className="truncate">{client}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-tender-400" />
            <span>{dueDateFormatted}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin className="h-4 w-4 text-tender-400" />
              <span className="truncate">{location}</span>
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
