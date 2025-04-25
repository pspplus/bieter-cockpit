
import React from "react";
import { Milestone } from "@/types/tender";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Edit, User2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
  totalMilestones: number;
  employees?: Array<{ id: string; name: string }>;
  popoverContent: React.ReactNode;
}

export function MilestoneItem({
  milestone,
  index,
  totalMilestones,
  employees,
  popoverContent
}: MilestoneItemProps) {
  const statusColors = {
    'pending': 'bg-gray-200',
    'in-progress': 'bg-blue-200',
    'completed': 'bg-green-200',
    'skipped': 'bg-amber-200'
  };
  
  const statusTextColors = {
    'pending': 'text-gray-700',
    'in-progress': 'text-blue-700',
    'completed': 'text-green-700',
    'skipped': 'text-amber-700'
  };

  // Fehlerfall: Fallback-Werte
  const title = milestone.title && milestone.title.trim() !== "" ? milestone.title : `Meilenstein ${index + 1}`;
  const status = milestone.status || "pending";
  
  // Get milestone assignees if available
  const assigneeCount = milestone.assignees?.length || 0;
  
  // Format due date if available
  const formattedDueDate = milestone.dueDate 
    ? format(new Date(milestone.dueDate), 'dd.MM.yyyy')
    : null;
  
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
          <div
            className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center mb-2",
              statusColors[status as keyof typeof statusColors]
            )}
          >
            <span className="text-sm font-medium">{index + 1}</span>
          </div>
          
          <h4 className="text-sm font-medium text-center line-clamp-2 mb-1 min-h-[40px]">
            {title}
          </h4>
          
          <div className="flex items-center mb-1">
            <span
              className={cn(
                "text-xs font-medium",
                statusTextColors[status as keyof typeof statusTextColors]
              )}
            >
              {status}
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
            className="absolute top-0 right-2 p-1 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
            aria-label="Edit milestone"
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

