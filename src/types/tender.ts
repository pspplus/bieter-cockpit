
export type TenderStatus = 
  | 'draft'
  | 'active'
  | 'review'
  | 'submitted'
  | 'clarification'
  | 'won'
  | 'lost'
  | 'completed';

export type MilestoneStatus = 
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'skipped';

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
  fileUrl?: string;
  fileType: string;
  fileSize?: number;
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
  notes?: string;
}
