
import { Tender, TenderStatus } from "@/types/tender";
import { TenderDetails } from "@/components/tender/TenderDetails";
import { MilestoneProcess } from "@/components/tender/milestone/MilestoneProcess";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";

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
  // Log milestone information when component mounts or tender changes
  useEffect(() => {
    console.log("TenderDetailsTab - Current tender:", tender.id, tender.title);
    console.log("TenderDetailsTab - Loaded milestones:", tender.milestones);
  }, [tender]);

  return (
    <div className="flex justify-between">
      <div className="flex-grow">
        <TenderDetails
          tender={tender}
          onOpenDetailsDialog={onOpenDetailsDialog}
          onOpenContactDialog={onOpenContactDialog}
        />

        {tender.milestones.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-lg font-medium">Meilensteine</h3>
            <div className="mb-4 text-sm text-muted-foreground">
              {tender.milestones.map((m, i) => (
                <div key={m.id || i} className="mb-2 p-2 bg-muted/30 rounded-sm">
                  <div><strong>#{i+1}: {m.title}</strong> ({m.status})</div>
                  <div>Beschreibung: {m.description}</div>
                  <div>Fälligkeitsdatum: {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'Nicht gesetzt'}</div>
                  <div>Zuständige: {m.assignees?.length ? m.assignees.join(', ') : 'Keine'}</div>
                </div>
              ))}
            </div>
            <MilestoneProcess milestones={tender.milestones} tenderId={tender.id} />
          </div>
        ) : (
          <div className="mt-8 p-4 border rounded-md bg-muted/30">
            <h3 className="text-lg font-medium">Meilensteine</h3>
            <p className="text-muted-foreground mt-2">Keine Meilensteine für diese Ausschreibung vorhanden.</p>
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
