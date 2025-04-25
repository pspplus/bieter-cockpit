
import { Tender, TenderStatus } from "@/types/tender";
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

        {tender.milestones.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium">Meilensteine</h3>
            {/* Tenderstatus jetzt mitgeben */}
            <MilestoneProcess milestones={tender.milestones} tenderId={tender.id} tenderStatus={tender.status} />
          </div>
        )}
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
