import { TenderDocument } from "@/types/tender";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import DocumentViewer from "@/components/document/DocumentViewer";

interface TenderDocumentViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: TenderDocument | null;
}

export function TenderDocumentViewerDialog({
  isOpen,
  onClose,
  document,
}: TenderDocumentViewerDialogProps) {
  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="pr-8">
              {document.name}
            </DialogTitle>
            <DialogDescription>
              {document.description}
            </DialogDescription>
          </div>
          <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Schließen</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <DocumentViewer 
            document={document}
            isOpen={isOpen}
            onClose={onClose}
          />
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
          <Button 
            variant="default"
            onClick={() => {
              window.open(document.fileUrl, '_blank');
            }}
          >
            Herunterladen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
