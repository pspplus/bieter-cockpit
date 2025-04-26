
import { supabase } from "@/integrations/supabase/client";
import { Milestone, MilestoneStatus } from "@/types/tender";
import { format } from "date-fns";

// Mapper function to convert DB format to application type
const mapMilestoneFromDB = (milestone: any): Milestone => {
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
    assignees: milestone.assignees || []
  };
};

// Mapper function to convert application type to DB format
const mapMilestoneForDB = (milestone: Partial<Milestone>) => {
  const dbMilestone: any = {
    ...(milestone.title && { title: milestone.title }),
    ...(milestone.description !== undefined && { description: milestone.description }),
    ...(milestone.status && { status: milestone.status }),
    ...(milestone.sequenceNumber !== undefined && { sequence_number: milestone.sequenceNumber }),
    ...(milestone.dueDate && { due_date: milestone.dueDate.toISOString() }),
    ...(milestone.completionDate && { completion_date: milestone.completionDate.toISOString() }),
    ...(milestone.notes !== undefined && { notes: milestone.notes }),
    ...(milestone.tenderId !== undefined && { tender_id: milestone.tenderId }),
    ...(milestone.assignees !== undefined && { assignees: milestone.assignees })
  };
  
  return dbMilestone;
};

export const createMilestone = async (milestone: Partial<Milestone>): Promise<Milestone> => {
  try {
    const dbMilestone = mapMilestoneForDB({
      ...milestone,
      status: milestone.status || "ausstehend" // Ensure default status is set
    });

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
    console.error("Error in createMilestone:", error);
    throw error;
  }
};

export const updateMilestone = async (id: string, milestone: Partial<Milestone>): Promise<void> => {
  try {
    const dbMilestone = mapMilestoneForDB(milestone);
    dbMilestone.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('milestones')
      .update(dbMilestone)
      .eq('id', id);

    if (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateMilestone:", error);
    throw error;
  }
};

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
    console.error("Error in deleteMilestone:", error);
    throw error;
  }
};

export const fetchMilestones = async (tenderId?: string): Promise<Milestone[]> => {
  try {
    let query = supabase
      .from('milestones')
      .select('*')
      .order('sequence_number', { ascending: true });

    if (tenderId) {
      query = query.eq('tender_id', tenderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching milestones:', error);
      throw error;
    }

    return (data || []).map(mapMilestoneFromDB);
  } catch (error) {
    console.error("Error in fetchMilestones:", error);
    throw error;
  }
};

