
import { supabase } from "@/integrations/supabase/client";
import { Tender } from "@/types/tender";
import { mapTenderFromDB, formatDateForDB } from "./utils/mapperUtils";

/**
 * Fetch all tenders for the current user
 */
export const fetchTenders = async (): Promise<Tender[]> => {
  const { data: tenderData, error: tenderError } = await supabase
    .from('tenders')
    .select('*')
    .order('created_at', { ascending: false });

  if (tenderError) {
    console.error('Error fetching tenders:', tenderError);
    throw tenderError;
  }

  if (!tenderData || tenderData.length === 0) {
    return [];
  }

  // Get all tender IDs to fetch their milestones
  const tenderIds = tenderData.map(t => t.id);

  // Fetch milestones for all tenders
  const { data: milestoneData, error: milestoneError } = await supabase
    .from('milestones')
    .select('*')
    .in('tender_id', tenderIds);

  if (milestoneError) {
    console.error('Error fetching milestones:', milestoneError);
    // Continue without milestones rather than failing completely
  }

  // Group milestones by tender_id
  const milestonesByTender: Record<string, any[]> = {};
  if (milestoneData) {
    milestoneData.forEach(milestone => {
      if (!milestonesByTender[milestone.tender_id]) {
        milestonesByTender[milestone.tender_id] = [];
      }
      milestonesByTender[milestone.tender_id].push(milestone);
    });
  }

  // Map tenders with their milestones
  return tenderData.map(tender => 
    mapTenderFromDB(tender, milestonesByTender[tender.id] || [])
  );
};

/**
 * Fetch a single tender by ID
 */
export const fetchTenderById = async (id: string): Promise<Tender | null> => {
  // Fetch the tender
  const { data: tenderData, error: tenderError } = await supabase
    .from('tenders')
    .select('*')
    .eq('id', id)
    .single();

  if (tenderError) {
    if (tenderError.code === 'PGRST116') {
      // No rows returned - tender not found
      return null;
    }
    console.error('Error fetching tender:', tenderError);
    throw tenderError;
  }

  // Fetch the tender's milestones
  const { data: milestoneData, error: milestoneError } = await supabase
    .from('milestones')
    .select('*')
    .eq('tender_id', id);

  if (milestoneError) {
    console.error('Error fetching milestones:', milestoneError);
    // Continue without milestones rather than failing completely
  }

  return mapTenderFromDB(tenderData, milestoneData || []);
};

/**
 * Create a new tender
 */
export const createTender = async (tenderData: Partial<Tender>): Promise<Tender> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Format date for Supabase (ISO string)
  const formattedDueDate = tenderData.dueDate 
    ? formatDateForDB(tenderData.dueDate)
    : formatDateForDB(new Date());

  // Prepare the tender data for insertion
  const dbTender = {
    title: tenderData.title || "",
    reference: tenderData.reference || "",
    client: tenderData.client || "",
    status: tenderData.status || "draft",
    due_date: formattedDueDate,
    budget: tenderData.budget || null,
    description: tenderData.description || "",
    location: tenderData.location || "",
    contact_person: tenderData.contactPerson || "",
    contact_email: tenderData.contactEmail || "",
    contact_phone: tenderData.contactPhone || "",
    notes: tenderData.notes || "",
    user_id: user.id
  };

  // Insert the tender
  const { data, error } = await supabase
    .from('tenders')
    .insert(dbTender)
    .select()
    .single();

  if (error) {
    console.error('Error creating tender:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned after creating tender');
  }

  const newTender = mapTenderFromDB(data, []);

  // If milestones were provided, create them
  if (tenderData.milestones && tenderData.milestones.length > 0) {
    await Promise.all(
      tenderData.milestones.map(milestone => 
        createMilestone({
          ...milestone,
          tenderId: newTender.id
        })
      )
    );
    
    // Re-fetch the tender with milestones
    return fetchTenderById(newTender.id) as Promise<Tender>;
  }

  return newTender;
};

/**
 * Update a tender
 */
export const updateTender = async (id: string, updates: Partial<Tender>): Promise<void> => {
  // Format date for Supabase if it exists in updates
  const formattedDueDate = updates.dueDate 
    ? formatDateForDB(updates.dueDate)
    : undefined;

  // Convert the updates to the DB format
  const dbUpdates = {
    ...(updates.title !== undefined && { title: updates.title }),
    ...(updates.reference !== undefined && { reference: updates.reference }),
    ...(updates.client !== undefined && { client: updates.client }),
    ...(updates.status !== undefined && { status: updates.status }),
    ...(formattedDueDate && { due_date: formattedDueDate }),
    ...(updates.budget !== undefined && { budget: updates.budget }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.location !== undefined && { location: updates.location }),
    ...(updates.contactPerson !== undefined && { contact_person: updates.contactPerson }),
    ...(updates.contactEmail !== undefined && { contact_email: updates.contactEmail }),
    ...(updates.contactPhone !== undefined && { contact_phone: updates.contactPhone }),
    ...(updates.notes !== undefined && { notes: updates.notes }),
    updated_at: new Date().toISOString()
  };

  // Update the tender
  const { error } = await supabase
    .from('tenders')
    .update(dbUpdates)
    .eq('id', id);

  if (error) {
    console.error('Error updating tender:', error);
    throw error;
  }
};

/**
 * Delete a tender
 */
export const deleteTender = async (id: string): Promise<void> => {
  // Note: We don't need to delete milestones separately due to cascading delete
  const { error } = await supabase
    .from('tenders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tender:', error);
    throw error;
  }
};

// Re-export milestone functions from the milestone service
export { 
  createMilestone, 
  updateMilestone, 
  deleteMilestone 
} from './milestoneService';
