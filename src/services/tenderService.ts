
import { supabase } from "@/integrations/supabase/client";
import { Tender, Milestone, MilestoneStatus, TenderStatus } from "@/types/tender";
import { v4 as uuidv4 } from 'uuid';

// Convert a Supabase tender row to our application Tender type
const mapTenderFromDB = (tender: any): Tender => {
  return {
    id: tender.id,
    title: tender.title,
    reference: tender.reference,
    client: tender.client || "",
    status: tender.status as TenderStatus,
    createdAt: new Date(tender.created_at),
    updatedAt: new Date(tender.updated_at),
    dueDate: new Date(tender.due_date),
    budget: tender.budget ? Number(tender.budget) : undefined,
    description: tender.description || "",
    location: tender.location || "",
    contactPerson: tender.contact_person || "",
    contactEmail: tender.contact_email || "",
    contactPhone: tender.contact_phone || "",
    milestones: [],
    notes: tender.notes || "",
  };
};

// Convert a Supabase milestone row to our application Milestone type
const mapMilestoneFromDB = (milestone: any): Milestone => {
  return {
    id: milestone.id,
    title: milestone.title,
    description: milestone.description,
    status: milestone.status as MilestoneStatus,
    dueDate: milestone.due_date ? new Date(milestone.due_date) : undefined,
    completionDate: milestone.completion_date ? new Date(milestone.completion_date) : undefined,
    notes: milestone.notes || "",
    documents: [],
  };
};

// Fetch all tenders with their milestones for the current user
export const fetchTenders = async (): Promise<Tender[]> => {
  // First, fetch all tenders
  const { data: tenderData, error: tenderError } = await supabase
    .from('tenders')
    .select('*')
    .order('updated_at', { ascending: false });

  if (tenderError) {
    console.error('Error fetching tenders:', tenderError);
    throw tenderError;
  }

  if (!tenderData || tenderData.length === 0) {
    return [];
  }

  // Map tender data from DB format
  const tenders = tenderData.map(mapTenderFromDB);

  // Fetch all milestones for these tenders
  const tenderIds = tenders.map(t => t.id);
  const { data: milestoneData, error: milestoneError } = await supabase
    .from('milestones')
    .select('*')
    .in('tender_id', tenderIds);

  if (milestoneError) {
    console.error('Error fetching milestones:', milestoneError);
    throw milestoneError;
  }

  // Group milestones by tender_id
  const milestonesByTender: Record<string, Milestone[]> = {};
  
  if (milestoneData) {
    milestoneData.forEach(milestone => {
      const mappedMilestone = mapMilestoneFromDB(milestone);
      
      if (!milestonesByTender[milestone.tender_id]) {
        milestonesByTender[milestone.tender_id] = [];
      }
      
      milestonesByTender[milestone.tender_id].push(mappedMilestone);
    });
  }

  // Merge milestones into their respective tenders
  return tenders.map(tender => ({
    ...tender,
    milestones: milestonesByTender[tender.id] || []
  }));
};

// Fetch a single tender by ID with its milestones
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

  if (!tenderData) {
    return null;
  }

  // Map tender data
  const tender = mapTenderFromDB(tenderData);

  // Fetch the tender's milestones
  const { data: milestoneData, error: milestoneError } = await supabase
    .from('milestones')
    .select('*')
    .eq('tender_id', id);

  if (milestoneError) {
    console.error('Error fetching milestones:', milestoneError);
    throw milestoneError;
  }

  // Add milestones to the tender
  tender.milestones = milestoneData ? milestoneData.map(mapMilestoneFromDB) : [];

  return tender;
};

// Create a new tender
export const createTender = async (tenderData: Partial<Tender>): Promise<Tender> => {
  // Prepare the data for insertion
  const dbTender = {
    title: tenderData.title || "New Tender",
    reference: tenderData.reference || `REF-${Date.now().toString().slice(-6)}`,
    client: tenderData.client || "",
    status: tenderData.status || "draft",
    due_date: tenderData.dueDate ? tenderData.dueDate.toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    budget: tenderData.budget,
    description: tenderData.description || "",
    location: tenderData.location || "",
    contact_person: tenderData.contactPerson || "",
    contact_email: tenderData.contactEmail || "",
    contact_phone: tenderData.contactPhone || "",
    notes: tenderData.notes || ""
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

  // Get the newly created tender with default milestones
  const tender = mapTenderFromDB(data);
  
  // Create default milestones for the tender
  const defaultMilestones = [
    { title: "Tender Announcement", description: "Initial announcement of the tender opportunity", status: "pending" as MilestoneStatus },
    { title: "Tender Documents Review", description: "Review and analyze tender documents", status: "pending" as MilestoneStatus },
    { title: "Submit Clarification Questions", description: "Submit any questions about unclear requirements", status: "pending" as MilestoneStatus },
    { title: "Tender Submission", description: "Submit the completed tender proposal", status: "pending" as MilestoneStatus },
    { title: "Result Notification", description: "Receive notification of tender results", status: "pending" as MilestoneStatus }
  ];
  
  // Insert milestones
  const milestoneInserts = defaultMilestones.map(milestone => ({
    tender_id: tender.id,
    title: milestone.title,
    description: milestone.description,
    status: milestone.status,
    due_date: null,
    completion_date: null,
    notes: ""
  }));
  
  const { data: milestoneData, error: milestoneError } = await supabase
    .from('milestones')
    .insert(milestoneInserts)
    .select();
    
  if (milestoneError) {
    console.error('Error creating default milestones:', milestoneError);
    throw milestoneError;
  }
  
  // Add milestones to the returned tender
  tender.milestones = milestoneData ? milestoneData.map(mapMilestoneFromDB) : [];
  
  return tender;
};

// Update a tender
export const updateTender = async (id: string, updates: Partial<Tender>): Promise<void> => {
  // Convert the updates to the DB format
  const dbUpdates = {
    ...(updates.title !== undefined && { title: updates.title }),
    ...(updates.reference !== undefined && { reference: updates.reference }),
    ...(updates.client !== undefined && { client: updates.client }),
    ...(updates.status !== undefined && { status: updates.status }),
    ...(updates.dueDate !== undefined && { due_date: updates.dueDate.toISOString() }),
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

// Update a milestone
export const updateMilestone = async (tenderId: string, milestoneId: string, updates: Partial<Milestone>): Promise<void> => {
  // Convert the updates to the DB format
  const dbUpdates = {
    ...(updates.title !== undefined && { title: updates.title }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.status !== undefined && { status: updates.status }),
    ...(updates.dueDate !== undefined && { due_date: updates.dueDate.toISOString() }),
    ...(updates.completionDate !== undefined && { completion_date: updates.completionDate.toISOString() }),
    ...(updates.notes !== undefined && { notes: updates.notes }),
    updated_at: new Date().toISOString()
  };

  // Update the milestone
  const { error } = await supabase
    .from('milestones')
    .update(dbUpdates)
    .eq('id', milestoneId)
    .eq('tender_id', tenderId);

  if (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

// Set milestone status
export const setMilestoneStatus = async (tenderId: string, milestoneId: string, status: MilestoneStatus): Promise<void> => {
  const updates: Partial<Milestone> = { 
    status,
    ...(status === 'completed' ? { completionDate: new Date() } : {})
  };
  
  await updateMilestone(tenderId, milestoneId, updates);
};
