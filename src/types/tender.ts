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

export type Vertragsart = 
  | 'werkvertrag'
  | 'dienstleistungsvertrag'
  | 'mischvertrag'
  | '';

export type Objektart = 
  | 'grundschule'
  | 'kindergarten'
  | 'buero'
  | '';

export type Zertifikat = 
  | 'din_iso_9001'
  | 'din_iso_14001'
  | 'din_iso_45001';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

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
  tenderTitle?: string; // Added for dashboard display
  assignees?: string[]; // Added for employee assignments
  checklist?: string[]; // <= NEU: Optionale Checkliste
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  uploadDate: Date;
  changesDescription?: string;
  userId: string;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  userId: string;
  userName?: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentApproval {
  id: string;
  documentId: string;
  userId: string;
  userName?: string;
  status: ApprovalStatus;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
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
  approvalStatus?: ApprovalStatus;
  currentVersion?: number;
  versions?: DocumentVersion[];
  comments?: DocumentComment[];
  approvals?: DocumentApproval[];
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
  
  // New fields for extended tender information
  vergabeplattform?: string;
  mindestanforderungen?: string;
  erforderlicheZertifikate?: Zertifikat[];
  objektbesichtigungErforderlich?: boolean;
  objektart?: Objektart[];
  vertragsart?: Vertragsart;
  leistungswertvorgaben?: boolean;
  stundenvorgaben?: string;
  beraterVergabestelle?: string;
  jahresreinigungsflaeche?: number;
  waschmaschine?: boolean;
  tariflohn?: boolean;
  qualitaetskontrollen?: boolean;
  raumgruppentabelle?: boolean;
}

export interface DashboardSettings {
  id: string;
  userId: string;
  favoriteMetrics: string[];
  layoutConfig?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard statistik typen
export interface TenderStatusStat {
  status: TenderStatus;
  count: number;
  percentage: number;
}

export interface MonthlyTenderStat {
  month: string;
  count: number;
  won: number;
  lost: number;
}

export interface UpcomingMilestone {
  id: string;
  title: string;
  dueDate: Date;
  tenderId: string;
  tenderTitle: string;
  status: MilestoneStatus;
  isOverdue: boolean;
  daysLeft?: number;
}

export interface DashboardData {
  statusStats: TenderStatusStat[];
  monthlyStats: MonthlyTenderStat[];
  upcomingMilestones: UpcomingMilestone[];
  totalTenders: number;
  activeTenders: number;
  submittedTenders: number;
  wonTenders: number;
  lostTenders: number;
  successRate: number;
}
```

```typescript
import React from "react";
import { Milestone, MilestoneStatus, TenderStatus } from "@/types/tender";
import { MilestoneItem } from "./MilestoneItem";
import { MilestonePopover } from "./MilestonePopover";

interface MilestoneLineProps {
  milestones: Milestone[];
  employees: Array<{ id: string; name: string }>;
  isUpdating: boolean;
  onAssigneeAdd: (milestone: Milestone, employeeId: string) => Promise<void>;
  onAssigneeRemove: (milestone: Milestone, employeeId: string) => Promise<void>;
  onStatusChange: (milestone: Milestone, newStatus: MilestoneStatus) => Promise<void>;
  canUpdateMilestoneStatus: (milestone: Milestone, newStatus: MilestoneStatus) => boolean;
  onDueDateChange?: (milestone: Milestone, newDate: Date) => Promise<void>;
  tenderStatus?: TenderStatus;
  tenderId?: string; // neu: tenderId als prop für die Verknüpfung
}

// Utility type guard to ensure status string is of type TenderStatus
function isTenderStatus(status: any): status is TenderStatus {
  const validStatuses: TenderStatus[] = [
    "entwurf",
    "in-pruefung",
    "in-bearbeitung",
    "abgegeben",
    "aufklaerung",
    "gewonnen",
    "verloren",
    "abgeschlossen",
  ];
  return validStatuses.includes(status);
}

export function MilestoneLine({
  milestones,
  employees,
  isUpdating,
  onAssigneeAdd,
  onAssigneeRemove,
  onStatusChange,
  canUpdateMilestoneStatus,
  onDueDateChange,
  tenderStatus,
  tenderId // neu!
}: MilestoneLineProps) {
  return (
    <div className="flex flex-row w-full">
      {milestones.map((milestone, idx) => {
        let canEdit = true;

        // Sicherstellen, dass tenderStatus ein gültiger Wert ist
        if (isTenderStatus(tenderStatus) && tenderStatus === "gewonnen") {
          canEdit = milestone.title === "Implementierung";
        } else if (milestone.title === "Aufklärung") {
          canEdit = tenderStatus === "aufklaerung";
        } else if (milestone.title === "Implementierung") {
          canEdit = tenderStatus === "gewonnen";
        }

        // tenderId mitgeben (fix für klickbaren Kreis)
        return (
          <MilestoneItem
            key={milestone.id}
            milestone={{ ...milestone, tenderId }} // tenderId injizieren!
            index={idx}
            totalMilestones={milestones.length}
            employees={employees}
            popoverContent={
              <MilestonePopover
                milestone={milestone}
                employees={employees}
                isUpdating={isUpdating}
                onAssigneeAdd={onAssigneeAdd}
                onAssigneeRemove={onAssigneeRemove}
                onStatusChange={onStatusChange}
                canUpdateMilestoneStatus={canUpdateMilestoneStatus}
                onDueDateChange={onDueDateChange}
                canEdit={canEdit}
                tenderStatus={tenderStatus}
              />
            }
            canEdit={canEdit}
          />
        );
      })}
    </div>
  );
}
