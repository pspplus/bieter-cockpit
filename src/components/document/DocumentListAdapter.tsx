
import { DocumentList, DocumentListProps } from "./DocumentList";
import { TenderDocument } from "@/types/tender";

interface DocumentListAdapterProps {
  documents: TenderDocument[];
  onDelete: (documentId: string) => void;
  readOnly: boolean;
}

export function DocumentListAdapter({ documents, onDelete, readOnly }: DocumentListAdapterProps) {
  return (
    <DocumentList 
      documents={documents} 
      onDelete={onDelete} 
      readOnly={readOnly} 
    />
  );
}
