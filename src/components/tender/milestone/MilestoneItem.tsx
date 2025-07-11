
import React from "react";
import { Milestone } from "@/types/tender";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Edit, User2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
  totalMilestones: number;
  employees?: Array<{ id: string; name: string }>;
  popoverContent: React.ReactNode;
  canEdit?: boolean;
}

export function MilestoneItem({
  milestone,
  index,
  totalMilestones,
  employees,
  popoverContent,
  canEdit = true
}: MilestoneItemProps) {
  const statusColors = {
    'ausstehend': 'bg-gray-200 text-gray-700',
    'in-bearbeitung': 'bg-blue-200 text-blue-700',
    'abgeschlossen': 'bg-green-200 text-green-700',
    'uebersprungen': 'bg-amber-200 text-amber-700'
  };

  const statusTextMap = {
    'ausstehend': 'Ausstehend',
    'in-bearbeitung': 'In Bearbeitung',
    'abgeschlossen': 'Abgeschlossen',
    'uebersprungen': 'Übersprungen'
  };

  const title = milestone.title && milestone.title.trim() !== "" ? milestone.title : `Meilenstein ${index + 1}`;
  const status = milestone.status || "ausstehend";
  const isCompleted = status === "abgeschlossen";
  const isActive = status === "in-bearbeitung";
  const titleColor = isCompleted || isActive ? "text-slate-900" : "text-slate-500";
  const assigneeCount = milestone.assignees?.length || 0;
  const formattedDueDate = milestone.dueDate 
    ? format(new Date(milestone.dueDate), 'dd.MM.yyyy')
    : null;

  const tenderId = milestone.tenderId;

  const circleClasses = cn(
    "h-12 w-12 rounded-full flex items-center justify-center mb-2 transition-all duration-200",
    statusColors[status as keyof typeof statusColors],
    tenderId ? "hover:scale-110 hover:shadow-md cursor-pointer hover:bg-primary/20" : "",
    "border border-gray-300"
  );

  const MilestoneCircle = () => (
    <HoverCard>
      <HoverCardTrigger>
        <div className={circleClasses}>
          <span className="text-sm font-medium">{index + 1}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="text-sm">
          <strong>Klicken Sie</strong>, um die Meilensteindetails anzuzeigen
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <div 
      className={cn(
        "flex-1 px-2 flex flex-col items-center relative",
        index === 0 ? "pl-0" : "",
        index === totalMilestones - 1 ? "pr-0" : ""
      )}
    >
      <Popover>
        <div className="flex flex-col items-center">
          {tenderId ? (
            <Link
              to={`/tenders/${tenderId}/milestones/${milestone.id}`}
              className="focus-visible:outline-none"
              tabIndex={0}
              aria-label={`Meilensteindetails zu ${title}`}
            >
              <MilestoneCircle />
            </Link>
          ) : (
            <MilestoneCircle />
          )}
          
          <h4
            className={cn(
              "text-sm font-medium text-center line-clamp-2 mb-1 min-h-[40px]",
              titleColor
            )}
          >
            {title}
          </h4>
          
          <div className="flex items-center mb-1">
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                statusColors[status as keyof typeof statusColors]
              )}
            >
              {statusTextMap[status as keyof typeof statusTextMap]}
            </span>
          </div>
          
          {formattedDueDate && (
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formattedDueDate}</span>
            </div>
          )}
          
          {assigneeCount > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <User2 className="h-3 w-3 mr-1" />
              <span>{assigneeCount}</span>
            </div>
          )}
        </div>
        
        <PopoverTrigger asChild>
          <button
            className={cn(
              "absolute top-0 right-2 p-1 rounded-full bg-white border border-gray-200 shadow-sm",
              canEdit ? "hover:bg-gray-50 cursor-pointer" : "opacity-40 cursor-not-allowed"
            )}
            aria-label="Meilenstein bearbeiten"
            disabled={!canEdit}
            tabIndex={canEdit ? 0 : -1}
          >
            <Edit className="h-3 w-3 text-gray-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-auto p-0">
          {popoverContent}
        </PopoverContent>
      </Popover>
      
      {index < totalMilestones - 1 && (
        <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-200" style={{ left: '50%' }}></div>
      )}
    </div>
  );
}
