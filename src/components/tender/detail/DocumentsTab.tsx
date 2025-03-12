
import { TenderDocument, Folder } from "@/types/tender";
import { DocumentList } from "@/components/document/DocumentList";

interface DocumentsTabProps {
  documents: TenderDocument[];
  tenderId: string;
  folders: Folder[];
  onDocumentAdded: (document: TenderDocument) => void;
  onDocumentDeleted: (documentId: string) => void;
  onPreviewDocument: (document: TenderDocument) => void;
}

export function DocumentsTab({
  documents,
  tenderId,
  folders,
  onDocumentAdded,
  onDocumentDeleted,
  onPreviewDocument,
}: DocumentsTabProps) {
  return (
    <DocumentList
      documents={documents}
      tenderId={tenderId}
      folders={folders}
      onDocumentAdded={onDocumentAdded}
      onDocumentDeleted={onDocumentDeleted}
      onPreviewDocument={onPreviewDocument}
    />
  );
}
