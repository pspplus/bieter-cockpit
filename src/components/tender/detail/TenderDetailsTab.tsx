
import { Tender } from "@/types/tender";
import { TenderDetails } from "@/components/tender/TenderDetails";
import { MilestoneProcess } from "@/components/tender/milestone/MilestoneProcess";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TenderDetailsTabProps {
  tender: Tender;
  onOpenDetailsDialog: () => void;
  onOpenContactDialog: () => void;
  onDeleteClick: () => void;
}

export function TenderDetailsTab({
  tender,
  onOpenDetailsDialog,
  onOpenContactDialog,
  onDeleteClick,
}: TenderDetailsTabProps) {
  return (
    <div className="flex justify-between">
      <div className="flex-grow">
        <TenderDetails
          tender={tender}
          onOpenDetailsDialog={onOpenDetailsDialog}
          onOpenContactDialog={onOpenContactDialog}
        />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Meilensteine</h3>
          </div>

          {tender.milestones.length > 0 ? (
            <MilestoneProcess 
              milestones={tender.milestones} 
              tenderId={tender.id} 
              tenderStatus={tender.status} 
            />
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600">
                Keine Meilensteine vorhanden. Neue Ausschreibungen erhalten automatisch Standardmeilensteine.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Button
        variant="destructive"
        size="icon"
        onClick={onDeleteClick}
        className="ml-2 flex-shrink-0 h-10"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
