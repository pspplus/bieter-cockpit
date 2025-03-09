
export type TenderStatus = 
  | "entwurf" 
  | "in-pruefung" 
  | "in-bearbeitung" 
  | "abgegeben" 
  | "aufklaerung" 
  | "gewonnen" 
  | "verloren" 
  | "abgeschlossen"
  | "active"      // Kompatibilitätsalias für "in-bearbeitung"
  | "draft"       // Kompatibilitätsalias für "entwurf"
  | "submitted"   // Kompatibilitätsalias für "abgegeben"
  | "clarification" // Kompatibilitätsalias für "aufklaerung"
  | "won"         // Kompatibilitätsalias für "gewonnen"
  | "lost";       // Kompatibilitätsalias für "verloren"

export type MilestoneStatus = "completed" | "pending" | "in-progress";

export interface Milestone {
  id: string;
  sequenceNumber: number;
  title: string;
  description: string;
  status: MilestoneStatus;
  dueDate: Date | null;
  completionDate: Date | null;
  notes?: string;
}

export interface TenderDocument {
  id: string;
  tenderId: string;
  folderId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadDate: Date;
  tags?: string[];
  description?: string;
}

export interface Folder {
  id: string;
  tenderId: string;
  name: string;
  parentId: string | null;
  folderOrder: number;
  isDefault: boolean;
  children?: Folder[];
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  internalReference: string;
  externalReference: string;
  client: string;
  status: TenderStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  submissionMethod: string;
  estimatedValue: number | null;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  notes: string;
  milestones: Milestone[];
  documents?: TenderDocument[];
  folders?: Folder[];
}
