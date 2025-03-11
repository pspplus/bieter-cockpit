
import { supabase } from "@/integrations/supabase/client";
import { Milestone, MilestoneStatus } from "@/types/tender";
import { getDefaultMilestones } from "@/data/defaultMilestones";

// Helper function to map milestone data from database to frontend model
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
    tenderId: milestone.tender_id
  };
};

// Fetch milestones for a tender
export const fetchMilestones = async (tenderId: string): Promise<Milestone[]> => {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('tender_id', tenderId)
    .order('sequence_number', { ascending: true });

  if (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }

  return (data || []).map(mapMilestoneFromDB);
};

// Create a new milestone
export const createMilestone = async (milestone: Omit<Milestone, 'id'>): Promise<Milestone> => {
  const { data, error } = await supabase
    .from('milestones')
    .insert({
      title: milestone.title,
      description: milestone.description,
      status: milestone.status,
      sequence_number: milestone.sequenceNumber,
      due_date: milestone.dueDate?.toISOString() || null,
      completion_date: milestone.completionDate?.toISOString() || null,
      notes: milestone.notes,
      tender_id: milestone.tenderId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }

  return mapMilestoneFromDB(data);
};

// Update an existing milestone
export const updateMilestone = async (milestone: Milestone): Promise<Milestone> => {
  const { data, error } = await supabase
    .from('milestones')
    .update({
      title: milestone.title,
      description: milestone.description,
      status: milestone.status,
      sequence_number: milestone.sequenceNumber,
      due_date: milestone.dueDate?.toISOString() || null,
      completion_date: milestone.completionDate?.toISOString() || null,
      notes: milestone.notes
    })
    .eq('id', milestone.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }

  return mapMilestoneFromDB(data);
};

// Delete a milestone
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

// Update milestone status
export const updateMilestoneStatus = async (id: string, status: MilestoneStatus): Promise<Milestone> => {
  // Prepare updates object
  const updates: { 
    status: MilestoneStatus;
    completion_date?: string | null;
  } = {
    status
  };

  // If new status is "completed", set completion date
  if (status === 'completed') {
    updates.completion_date = new Date().toISOString();
  }
  // If new status is not "completed", clear completion date
  else {
    updates.completion_date = null;
  }

  const { data, error } = await supabase
    .from('milestones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating milestone status:', error);
    throw error;
  }

  return mapMilestoneFromDB(data);
};

// Create default milestones for a new tender
export const createDefaultMilestones = async (tenderId: string): Promise<Milestone[]> => {
  // Map the default milestones to the actual milestone objects
  const milestones = getDefaultMilestones().map((milestone, index) => ({
    title: milestone.title,
    description: milestone.description,
    status: 'pending' as MilestoneStatus,
    sequence_number: index + 1,
    tender_id: tenderId
  }));

  // Insert all milestones
  const { data, error } = await supabase
    .from('milestones')
    .insert(milestones)
    .select();

  if (error) {
    console.error('Error creating default milestones:', error);
    throw error;
  }

  return (data || []).map(mapMilestoneFromDB);
};

// Fetch upcoming milestones for the dashboard
export const fetchUpcomingMilestones = async (limit: number = 5): Promise<any[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('milestones')
    .select(`
      id,
      title,
      status,
      due_date,
      tender_id,
      tenders(title)
    `)
    .eq('status', 'in-progress')
    .order('due_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming milestones:', error);
    throw error;
  }

  // Format the data for the frontend
  return (data || []).map(item => ({
    id: item.id,
    title: item.title,
    status: item.status,
    dueDate: item.due_date ? new Date(item.due_date) : null,
    tenderId: item.tender_id,
    tenderTitle: item.tenders?.title || '',
    isOverdue: item.due_date ? new Date(item.due_date) < new Date() : false,
    daysLeft: item.due_date ? Math.ceil((new Date(item.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
  }));
};
