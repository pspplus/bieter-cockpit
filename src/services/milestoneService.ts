
import { supabase } from "@/integrations/supabase/client";
import { Milestone, MilestoneStatus, TenderDocument } from "@/types/tender";
import { format } from "date-fns";

// Type for the milestone data as it comes from the database (snake_case)
type MilestoneDB = {
  id: string;
  tender_id: string;
  title: string;
  description: string;
  status: string;
  sequence_number: number;
  due_date?: string;
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

// Mapper function to convert DB format to application type
const mapMilestoneFromDB = (milestone: MilestoneDB): Milestone => {
  return {
    id: milestone.id,
    title: milestone.title,
    description: milestone.description,
    status: milestone.status as MilestoneStatus,
    sequenceNumber: milestone.sequence_number,
    dueDate: milestone.due_date ? new Date(milestone.due_date) : null,
    completionDate: milestone.completion_date ? new Date(milestone.completion_date) : null,
    notes: milestone.notes || "",
    tenderId: milestone.tender_id,
  };
};

// Mapper function to convert application type to DB format
const mapMilestoneForDB = (milestone: Partial<Milestone>): any => {
  const dbMilestone: any = {};
  
  if (milestone.title !== undefined) dbMilestone.title = milestone.title;
  if (milestone.description !== undefined) dbMilestone.description = milestone.description;
  if (milestone.status !== undefined) dbMilestone.status = milestone.status;
  if (milestone.sequenceNumber !== undefined) dbMilestone.sequence_number = milestone.sequenceNumber;
  if (milestone.dueDate !== undefined) dbMilestone.due_date = milestone.dueDate ? format(milestone.dueDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null;
  if (milestone.completionDate !== undefined) dbMilestone.completion_date = milestone.completionDate ? format(milestone.completionDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null;
  if (milestone.notes !== undefined) dbMilestone.notes = milestone.notes;
  if (milestone.tenderId !== undefined) dbMilestone.tender_id = milestone.tenderId;
  
  return dbMilestone;
};

// Fetch milestones for a specific tender or all milestones
export const fetchMilestones = async (tenderId: string): Promise<Milestone[]> => {
  try {
    let query = supabase.from('milestones').select(`
      *,
      tenders(title)
    `);
    
    // If tenderId is not "all", filter by tender_id
    if (tenderId !== "all") {
      query = query.eq('tender_id', tenderId);
    }
    
    const { data, error } = await query.order('sequence_number', { ascending: true });
    
    if (error) {
      console.error('Error fetching milestones:', error);
      throw error;
    }
    
    // Map the DB data to our application type and add tenderTitle
    return data.map((item: any) => {
      const milestone = mapMilestoneFromDB(item);
      return {
        ...milestone,
        tenderTitle: item.tenders?.title || null
      };
    });
    
  } catch (error) {
    console.error('Error in fetchMilestones:', error);
    throw error;
  }
};

// Create multiple milestones for a tender
export const createMilestones = async (tenderId: string, milestones: Partial<Milestone>[]): Promise<void> => {
  try {
    // Map each milestone to the DB format
    const dbMilestones = milestones.map(milestone => ({
      ...mapMilestoneForDB(milestone),
      tender_id: tenderId
    }));
    
    const { error } = await supabase
      .from('milestones')
      .insert(dbMilestones);
      
    if (error) {
      console.error('Error creating milestones:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in createMilestones:', error);
    throw error;
  }
};

// Create a new milestone
export const createMilestone = async (milestone: Partial<Milestone>): Promise<Milestone> => {
  try {
    const dbMilestone = mapMilestoneForDB(milestone);
    
    const { data, error } = await supabase
      .from('milestones')
      .insert(dbMilestone)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
    
    return mapMilestoneFromDB(data);
  } catch (error) {
    console.error('Error in createMilestone:', error);
    throw error;
  }
};

// Update a milestone
export const updateMilestone = async (id: string, milestone: Partial<Milestone>): Promise<void> => {
  try {
    const dbMilestone = mapMilestoneForDB(milestone);
    
    const { error } = await supabase
      .from('milestones')
      .update(dbMilestone)
      .eq('id', id);
      
    if (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateMilestone:', error);
    throw error;
  }
};

// Delete a milestone
export const deleteMilestone = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteMilestone:', error);
    throw error;
  }
};
