
import { supabase } from "@/integrations/supabase/client";
import { Milestone } from "@/types/tender";
import { mapMilestoneFromDB, mapMilestoneForDB, formatDateForDB } from "./utils/mapperUtils";

/**
 * Create a milestone
 */
export const createMilestone = async (milestone: Partial<Milestone>): Promise<Milestone> => {
  // Format dates for Supabase
  const formattedDueDate = milestone.dueDate 
    ? formatDateForDB(milestone.dueDate)
    : null;
  
  const formattedCompletionDate = milestone.completionDate
    ? formatDateForDB(milestone.completionDate)
    : null;

  // Prepare the milestone data
  const dbMilestone = {
    tender_id: milestone.tenderId, // This is the tender ID, not the milestone ID
    title: milestone.title || "",
    description: milestone.description || "",
    status: milestone.status || "pending",
    due_date: formattedDueDate,
    completion_date: formattedCompletionDate,
    notes: milestone.notes || ""
  };

  // Insert the milestone
  const { data, error } = await supabase
    .from('milestones')
    .insert(dbMilestone)
    .select()
    .single();

  if (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned after creating milestone');
  }

  return mapMilestoneFromDB(data);
};

/**
 * Update a milestone
 */
export const updateMilestone = async (id: string, updates: Partial<Milestone>): Promise<void> => {
  // Convert the updates to the DB format
  const dbUpdates = mapMilestoneForDB(updates);

  // Add updated_at timestamp separately
  dbUpdates.updated_at = new Date().toISOString();

  // Update the milestone
  const { error } = await supabase
    .from('milestones')
    .update(dbUpdates)
    .eq('id', id);

  if (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

/**
 * Delete a milestone
 */
export const deleteMilestone = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting milestone:', error);
    throw error;
  }
};
