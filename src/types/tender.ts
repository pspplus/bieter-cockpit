
export type TenderStatus = 
  | 'entwurf'
  | 'in-pruefung'
  | 'in-bearbeitung'
  | 'abgegeben'
  | 'aufklaerung'
  | 'gewonnen'
  | 'verloren'
  | 'abgeschlossen';

export type MilestoneStatus = 
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'skipped';

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  tenderId: string;
  folderOrder: number;
  folderPath?: string;
  isDefault: boolean;
  children?: Folder[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  sequenceNumber: number;
  dueDate?: Date | null;
  completionDate?: Date | null;
  notes?: string;
  documents?: TenderDocument[];
  tenderId?: string;
}

export interface TenderDocument {
  id: string;
  name: string;
  description?: string;
  uploadDate: Date;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  folderId?: string | null;
  folderPath?: string;
  tenderId?: string | null;
  milestoneId?: string | null;
}

export interface Tender {
  id: string;
  title: string;
  externalReference: string;
  internalReference: string;
  client: string;
  status: TenderStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  budget?: number;
  description?: string;
  location?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  milestones: Milestone[];
  documents?: TenderDocument[];
  folders?: Folder[];
  notes?: string;
  bindingPeriodDate?: Date | null;
  evaluationScheme?: string;
  conceptRequired?: boolean;
}
