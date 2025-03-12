
import { Milestone, MilestoneStatus } from "@/types/tender";
import { supabase } from "@/integrations/supabase/client";
import { getDefaultMilestones } from "@/data/defaultMilestones";
import { toast } from "sonner";

// Fetch milestones for a specific tender
export const fetchMilestones = async (tenderId: string): Promise<Milestone[]> => {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('tender_id', tenderId)
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error("Error fetching milestones:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchMilestones:", error);
    return [];
  }
};

// Create default milestones for a new tender
export const createDefaultMilestones = async (tenderId: string): Promise<void> => {
  try {
    const defaultMilestones = getDefaultMilestones();
    
    // Prepare milestones with the tender ID
    const milestonesToInsert = defaultMilestones.map(milestone => ({
      ...milestone,
      tender_id: tenderId
    }));
    
    const { error } = await supabase
      .from('milestones')
      .insert(milestonesToInsert);
    
    if (error) {
      console.error("Error creating default milestones:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in createDefaultMilestones:", error);
    throw error;
  }
};

// Create a single milestone
export const createMilestone = async (milestone: Omit<Milestone, "id">): Promise<Milestone> => {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .insert([milestone])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating milestone:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createMilestone:", error);
    throw error;
  }
};

// Update a milestone
export const updateMilestone = async (id: string, updates: Partial<Milestone>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error("Error updating milestone:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateMilestone:", error);
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
      console.error("Error deleting milestone:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteMilestone:", error);
    throw error;
  }
};

// Update milestone status
export const updateMilestoneStatus = async (id: string, status: MilestoneStatus): Promise<void> => {
  try {
    const { error } = await supabase
      .from('milestones')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating milestone status:", error);
      throw error;
    }
    
    // For completed milestones, set completion date
    if (status === "completed") {
      const { error: dateError } = await supabase
        .from('milestones')
        .update({ completed_date: new Date().toISOString() })
        .eq('id', id);
      
      if (dateError) {
        console.error("Error updating milestone completion date:", dateError);
      }
    }
  } catch (error) {
    console.error("Error in updateMilestoneStatus:", error);
    throw error;
  }
};
