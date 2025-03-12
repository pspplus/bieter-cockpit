
import { supabase } from "@/integrations/supabase/client";
import { Tender, TenderStatus, Milestone, MilestoneStatus, Folder, Vertragsart, Objektart, Zertifikat } from "@/types/tender";
import { format } from "date-fns";
import { fetchFolders } from "./folderService";

// Convert a Supabase tender row to our application Tender type
const mapTenderFromDB = (tender: any, milestones: any[] = []): Tender => {
  return {
    id: tender.id,
    title: tender.title,
    externalReference: tender.external_reference || "",
    internalReference: tender.internal_reference || "",
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
    bindingPeriodDate: tender.binding_period_date ? new Date(tender.binding_period_date) : null,
    evaluationScheme: tender.evaluation_scheme || "",
    conceptRequired: tender.concept_required || false,
    
    vergabeplattform: tender.vergabeplattform || "",
    mindestanforderungen: tender.mindestanforderungen || "",
    erforderlicheZertifikate: tender.erforderliche_zertifikate || [],
    objektbesichtigungErforderlich: tender.objektbesichtigung_erforderlich || false,
    objektart: tender.objektart || [],
    vertragsart: tender.vertragsart as Vertragsart || "",
    leistungswertvorgaben: tender.leistungswertvorgaben || false,
    stundenvorgaben: tender.stundenvorgaben || "",
    beraterVergabestelle: tender.berater_vergabestelle || "",
    jahresreinigungsflaeche: tender.jahresreinigungsflaeche || null,
    waschmaschine: tender.waschmaschine || false,
    tariflohn: tender.tariflohn || false,
    qualitaetskontrollen: tender.qualitaetskontrollen || false,
    raumgruppentabelle: tender.raumgruppentabelle || false,
    
    milestones: milestones.map(mapMilestoneFromDB),
  };
};

// Convert a Supabase milestone row to our application Milestone type
const mapMilestoneFromDB = (milestone: any): Milestone => {
  return {
    id: milestone.id,
    title: milestone.title,
    description: milestone.description || "",
    status: milestone.status,
    sequenceNumber: milestone.sequence_number || 0,
    dueDate: milestone.due_date ? new Date(milestone.due_date) : null,
    completionDate: milestone.completion_date ? new Date(milestone.completion_date) : null,
    notes: milestone.notes || "",
    assignees: milestone.assignees || [], // Stellen Sie sicher, dass assignees geladen werden
  };
};

// Convert application Milestone type to Supabase format
const mapMilestoneForDB = (milestone: Partial<Milestone>) => {
  const dbMilestone: any = {
    ...(milestone.id && { id: milestone.id }),
    ...(milestone.title && { title: milestone.title }),
    ...(milestone.description !== undefined && { description: milestone.description }),
    ...(milestone.status && { status: milestone.status }),
    ...(milestone.sequenceNumber !== undefined && { sequence_number: milestone.sequenceNumber }),
    ...(milestone.dueDate && { due_date: milestone.dueDate.toISOString() }),
    ...(milestone.completionDate && { completion_date: milestone.completionDate.toISOString() }),
    ...(milestone.notes !== undefined && { notes: milestone.notes }),
    ...(milestone.assignees !== undefined && { assignees: milestone.assignees }), // Hier die Mitarbeiterzuweisungen speichern
  };
  
  return dbMilestone;
};

// Generate the next internal reference number
const generateInternalReference = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  
  // Get the highest reference number for the current year
  const { data, error } = await supabase
    .from('tenders')
    .select('internal_reference')
    .like('internal_reference', `${currentYear}-%`)
    .order('internal_reference', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('Error fetching reference numbers:', error);
    // Default to 1 if there's an error
    return `${currentYear}-1`;
  }
  
  if (!data || data.length === 0) {
    // No existing references for this year, start with 1
    return `${currentYear}-1`;
  }
  
  // Extract the number from the reference (e.g., "2023-42" -> 42)
  const lastReference = data[0].internal_reference;
  const parts = lastReference.split('-');
  
  if (parts.length !== 2 || isNaN(parseInt(parts[1]))) {
    // Invalid format, default to 1
    return `${currentYear}-1`;
  }
  
  // Increment the number
  const nextNumber = parseInt(parts[1]) + 1;
  return `${currentYear}-${nextNumber}`;
};

// Fetch all tenders for the current user
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
    .in('tender_id', tenderIds)
    .order('sequence_number', { ascending: true });

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

// Fetch a single tender by ID with folders
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
    .eq('tender_id', id)
    .order('sequence_number', { ascending: true });

  if (milestoneError) {
    console.error('Error fetching milestones:', milestoneError);
    // Continue without milestones rather than failing completely
  }

  const tender = mapTenderFromDB(tenderData, milestoneData || []);

  // Fetch folders for the tender
  try {
    const folders = await fetchFolders(id);
    tender.folders = folders;
  } catch (error) {
    console.error('Error fetching folders:', error);
    // Continue without folders rather than failing completely
  }

  return tender;
};

// Create a new tender
export const createTender = async (tenderData: Partial<Tender>): Promise<Tender> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Generate internal reference number
  const internalReference = await generateInternalReference();

  // Format date for Supabase (ISO string)
  const formattedDueDate = tenderData.dueDate 
    ? format(new Date(tenderData.dueDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    
  const formattedBindingPeriodDate = tenderData.bindingPeriodDate 
    ? format(new Date(tenderData.bindingPeriodDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : null;

  // Prepare the tender data for insertion
  const dbTender = {
    title: tenderData.title || "",
    external_reference: tenderData.externalReference || "",
    internal_reference: internalReference,
    client: tenderData.client || "",
    status: tenderData.status || "entwurf",
    due_date: formattedDueDate,
    binding_period_date: formattedBindingPeriodDate,
    budget: tenderData.budget || null,
    description: tenderData.description || "",
    location: tenderData.location || "",
    contact_person: tenderData.contactPerson || "",
    contact_email: tenderData.contactEmail || "",
    contact_phone: tenderData.contactPhone || "",
    notes: tenderData.notes || "",
    evaluation_scheme: tenderData.evaluationScheme || "",
    concept_required: tenderData.conceptRequired || false,
    
    vergabeplattform: tenderData.vergabeplattform || null,
    mindestanforderungen: tenderData.mindestanforderungen || null,
    erforderliche_zertifikate: tenderData.erforderlicheZertifikate || [],
    objektbesichtigung_erforderlich: tenderData.objektbesichtigungErforderlich || false,
    objektart: tenderData.objektart || [],
    vertragsart: tenderData.vertragsart || null,
    leistungswertvorgaben: tenderData.leistungswertvorgaben || false,
    stundenvorgaben: tenderData.stundenvorgaben || null,
    berater_vergabestelle: tenderData.beraterVergabestelle || null,
    jahresreinigungsflaeche: tenderData.jahresreinigungsflaeche || null,
    waschmaschine: tenderData.waschmaschine || false,
    tariflohn: tenderData.tariflohn || false,
    qualitaetskontrollen: tenderData.qualitaetskontrollen || false,
    raumgruppentabelle: tenderData.raumgruppentabelle || false,
    
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

// Update a tender
export const updateTender = async (id: string, updates: Partial<Tender>): Promise<void> => {
  // Format date for Supabase if it exists in updates
  const formattedDueDate = updates.dueDate 
    ? format(new Date(updates.dueDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : undefined;
    
  const formattedBindingPeriodDate = updates.bindingPeriodDate 
    ? format(new Date(updates.bindingPeriodDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : undefined;

  // Convert the updates to the DB format
  const dbUpdates = {
    ...(updates.title !== undefined && { title: updates.title }),
    ...(updates.externalReference !== undefined && { external_reference: updates.externalReference }),
    ...(updates.client !== undefined && { client: updates.client }),
    ...(updates.status !== undefined && { status: updates.status }),
    ...(formattedDueDate && { due_date: formattedDueDate }),
    ...(formattedBindingPeriodDate !== undefined && { binding_period_date: formattedBindingPeriodDate }),
    ...(updates.budget !== undefined && { budget: updates.budget }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.location !== undefined && { location: updates.location }),
    ...(updates.contactPerson !== undefined && { contact_person: updates.contactPerson }),
    ...(updates.contactEmail !== undefined && { contact_email: updates.contactEmail }),
    ...(updates.contactPhone !== undefined && { contact_phone: updates.contactPhone }),
    ...(updates.notes !== undefined && { notes: updates.notes }),
    ...(updates.evaluationScheme !== undefined && { evaluation_scheme: updates.evaluationScheme }),
    ...(updates.conceptRequired !== undefined && { concept_required: updates.conceptRequired }),
    
    ...(updates.vergabeplattform !== undefined && { vergabeplattform: updates.vergabeplattform }),
    ...(updates.mindestanforderungen !== undefined && { mindestanforderungen: updates.mindestanforderungen }),
    ...(updates.erforderlicheZertifikate !== undefined && { erforderliche_zertifikate: updates.erforderlicheZertifikate }),
    ...(updates.objektbesichtigungErforderlich !== undefined && { objektbesichtigung_erforderlich: updates.objektbesichtigungErforderlich }),
    ...(updates.objektart !== undefined && { objektart: updates.objektart }),
    ...(updates.vertragsart !== undefined && { vertragsart: updates.vertragsart }),
    ...(updates.leistungswertvorgaben !== undefined && { leistungswertvorgaben: updates.leistungswertvorgaben }),
    ...(updates.stundenvorgaben !== undefined && { stundenvorgaben: updates.stundenvorgaben }),
    ...(updates.beraterVergabestelle !== undefined && { berater_vergabestelle: updates.beraterVergabestelle }),
    ...(updates.jahresreinigungsflaeche !== undefined && { jahresreinigungsflaeche: updates.jahresreinigungsflaeche }),
    ...(updates.waschmaschine !== undefined && { waschmaschine: updates.waschmaschine }),
    ...(updates.tariflohn !== undefined && { tariflohn: updates.tariflohn }),
    ...(updates.qualitaetskontrollen !== undefined && { qualitaetskontrollen: updates.qualitaetskontrollen }),
    ...(updates.raumgruppentabelle !== undefined && { raumgruppentabelle: updates.raumgruppentabelle }),
    
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

// Delete a tender
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

// Create a milestone
export const createMilestone = async (milestone: Partial<Milestone>): Promise<Milestone> => {
  // Get max sequence number for this tender and add 1
  let sequenceNumber = 1;
  
  if (milestone.tenderId) {
    const { data, error } = await supabase
      .from('milestones')
      .select('sequence_number')
      .eq('tender_id', milestone.tenderId)
      .order('sequence_number', { ascending: false })
      .limit(1);
      
    if (!error && data && data.length > 0) {
      sequenceNumber = (data[0].sequence_number || 0) + 1;
    }
  }

  // Format dates for Supabase
  const formattedDueDate = milestone.dueDate 
    ? format(new Date(milestone.dueDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : null;
  
  const formattedCompletionDate = milestone.completionDate
    ? format(new Date(milestone.completionDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : null;

  // Prepare the milestone data
  const dbMilestone = {
    tender_id: milestone.tenderId, // This is the tender ID, not the milestone ID
    title: milestone.title || "",
    description: milestone.description || "",
    status: milestone.status || "pending",
    sequence_number: milestone.sequenceNumber || sequenceNumber,
    due_date: formattedDueDate,
    completion_date: formattedCompletionDate,
    notes: milestone.notes || "",
    assignees: milestone.assignees || [] // Stelle sicher, dass assignees immer gesetzt ist
  };

  console.log("Creating milestone with data:", dbMilestone);

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

// Update a milestone
export const updateMilestone = async (milestone: Milestone): Promise<void> => {
  // Use the function to update the milestone
  return updateMilestoneService(milestone.id, milestone);
};

// Update a milestone with the service
export const updateMilestoneService = async (id: string, updates: Partial<Milestone>): Promise<void> => {
  // Format dates for Supabase if they exist
  const formattedDueDate = updates.dueDate 
    ? format(new Date(updates.dueDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : undefined;
  
  const formattedCompletionDate = updates.completionDate
    ? format(new Date(updates.completionDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : undefined;

  // Convert the updates to the DB format
  const dbUpdates = mapMilestoneForDB({
    ...updates,
    dueDate: formattedDueDate ? new Date(formattedDueDate) : undefined,
    completionDate: formattedCompletionDate ? new Date(formattedCompletionDate) : undefined,
  });

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
