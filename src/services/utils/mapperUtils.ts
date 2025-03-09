
import { Tender, TenderStatus, Milestone, MilestoneStatus } from "@/types/tender";
import { format } from "date-fns";

/**
 * Convert a Supabase tender row to our application Tender type
 */
export const mapTenderFromDB = (tender: any, milestones: any[] = []): Tender => {
  return {
    id: tender.id,
    title: tender.title,
    reference: tender.reference,
    client: tender.client || "",
    status: tender.status as TenderStatus,
    createdAt: new Date(tender.created_at),
    updatedAt: new Date(tender.updated_at),
    dueDate: new Date(tender.due_date),
    budget: tender.budget || 0,
    description: tender.description || "",
    location: tender.location || "",
    contactPerson: tender.contact_person || "",
    contactEmail: tender.contact_email || "",
    contactPhone: tender.contact_phone || "",
    notes: tender.notes || "",
    milestones: milestones.map(mapMilestoneFromDB),
  };
};

/**
 * Convert a Supabase milestone row to our application Milestone type
 */
export const mapMilestoneFromDB = (milestone: any): Milestone => {
  return {
    id: milestone.id,
    title: milestone.title,
    description: milestone.description || "",
    status: milestone.status as MilestoneStatus,
    dueDate: milestone.due_date ? new Date(milestone.due_date) : null,
    completionDate: milestone.completion_date ? new Date(milestone.completion_date) : null,
    notes: milestone.notes || "",
  };
};

/**
 * Convert application Milestone type to Supabase format
 */
export const mapMilestoneForDB = (milestone: Partial<Milestone>) => {
  const dbMilestone: any = {
    ...(milestone.id && { id: milestone.id }),
    ...(milestone.title && { title: milestone.title }),
    ...(milestone.description !== undefined && { description: milestone.description }),
    ...(milestone.status && { status: milestone.status }),
    ...(milestone.dueDate && { due_date: formatDateForDB(milestone.dueDate) }),
    ...(milestone.completionDate && { completion_date: formatDateForDB(milestone.completionDate) }),
    ...(milestone.notes !== undefined && { notes: milestone.notes }),
  };
  
  return dbMilestone;
};

/**
 * Format a Date for Supabase (ISO string)
 */
export const formatDateForDB = (date: Date): string => {
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss'Z'");
};
