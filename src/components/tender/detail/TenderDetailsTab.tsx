
import { Tender, TenderStatus } from "@/types/tender";
import { TenderDetails } from "@/components/tender/TenderDetails";
import { MilestoneProcess } from "@/components/tender/milestone/MilestoneProcess";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useTender } from "@/hooks/useTender";
import { getDefaultMilestones } from "@/data/defaultMilestones";
import { toast } from "sonner";

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
  const { createMilestone } = useTender();

  const handleCreateDefaultMilestones = async () => {
    try {
      const defaultMilestones = getDefaultMilestones();
      
      for (const milestone of defaultMilestones) {
        await createMilestone(tender.id, milestone);
      }
      
      toast.success("Standard-Meilensteine wurden erstellt");
    } catch (error) {
      console.error("Error creating default milestones:", error);
      toast.error("Fehler beim Erstellen der Standard-Meilensteine");
    }
  };

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
            {tender.milestones.length === 0 && (
              <Button 
                onClick={handleCreateDefaultMilestones}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Standard-Meilensteine erstellen
              </Button>
            )}
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
                Keine Meilensteine vorhanden. Klicken Sie oben auf den Button, um Standard-Meilensteine zu erstellen.
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
