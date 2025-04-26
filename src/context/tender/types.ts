
import { Tender, Milestone, MilestoneStatus, TenderStatus } from "@/types/tender";

export type TenderContextType = {
  tenders: Tender[];
  isLoading: boolean;
  createTender: (tenderData: Partial<Tender>) => Promise<Tender>;
  updateTender: (id: string, updates: Partial<Tender>) => Promise<void>;
  deleteTender: (id: string) => Promise<void>;
  createMilestone: (tenderId: string, milestone: Partial<Milestone>) => Promise<void>;
  updateMilestone: (milestone: Milestone) => Promise<void>;
  deleteMilestone: (tenderId: string, milestoneId: string) => Promise<void>;
  canUpdateMilestoneStatus: (milestone: Milestone, newStatus: MilestoneStatus) => boolean;
  loadTender: (id: string) => Promise<Tender | null>;
};
