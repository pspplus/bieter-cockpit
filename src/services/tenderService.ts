
import { supabase } from "@/integrations/supabase/client";
import { Tender, TenderStatus } from "@/types/tender";
import { format } from "date-fns";
import { fetchMilestones } from "./milestoneService";
import { fetchFolders } from "./folderService";

// Convert a Supabase tender row to our application Tender type
const mapTenderFromDB = async (tender: any): Promise<Tender> => {
  const milestones = await fetchMilestones(tender.id);
  
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
    vertragsart: tender.vertragsart || "",
    leistungswertvorgaben: tender.leistungswertvorgaben || false,
    stundenvorgaben: tender.stundenvorgaben || "",
    beraterVergabestelle: tender.berater_vergabestelle || "",
    jahresreinigungsflaeche: tender.jahresreinigungsflaeche || null,
    waschmaschine: tender.waschmaschine || false,
    tariflohn: tender.tariflohn || false,
    qualitaetskontrollen: tender.qualitaetskontrollen || false,
    raumgruppentabelle: tender.raumgruppentabelle || false,
    milestones: milestones,
  };
};

// Generate the next internal reference number
const generateInternalReference = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  
  const { data, error } = await supabase
    .from('tenders')
    .select('internal_reference')
    .like('internal_reference', `${currentYear}-%`)
    .order('internal_reference', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('Error fetching reference numbers:', error);
    return `${currentYear}-1`;
  }
  
  if (!data || data.length === 0) {
    return `${currentYear}-1`;
  }
  
  const lastReference = data[0].internal_reference;
  const parts = lastReference.split('-');
  
  if (parts.length !== 2 || isNaN(parseInt(parts[1]))) {
    return `${currentYear}-1`;
  }
  
  const nextNumber = parseInt(parts[1]) + 1;
  return `${currentYear}-${nextNumber}`;
};

// Fetch all tenders
export const fetchTenders = async (): Promise<Tender[]> => {
  const { data: tenderData, error } = await supabase
    .from('tenders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tenders:', error);
    throw error;
  }

  const tenders = await Promise.all((tenderData || []).map(mapTenderFromDB));
  return tenders;
};

// Fetch a single tender by ID
export const fetchTenderById = async (id: string): Promise<Tender | null> => {
  const { data: tenderData, error } = await supabase
    .from('tenders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching tender:', error);
    throw error;
  }

  const tender = await mapTenderFromDB(tenderData);
  
  try {
    const folders = await fetchFolders(id);
    tender.folders = folders;
  } catch (error) {
    console.error('Error fetching folders:', error);
  }

  return tender;
};

// Create a new tender
export const createTender = async (tenderData: Partial<Tender>): Promise<Tender> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const internalReference = await generateInternalReference();
  
  const formattedDueDate = tenderData.dueDate 
    ? format(new Date(tenderData.dueDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    
  const formattedBindingPeriodDate = tenderData.bindingPeriodDate 
    ? format(new Date(tenderData.bindingPeriodDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : null;

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

  const { data, error } = await supabase
    .from('tenders')
    .insert(dbTender)
    .select()
    .single();

  if (error) {
    console.error('Error creating tender:', error);
    throw error;
  }

  return mapTenderFromDB(data);
};

// Update a tender
export const updateTender = async (id: string, updates: Partial<Tender>): Promise<void> => {
  const formattedDueDate = updates.dueDate 
    ? format(new Date(updates.dueDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : undefined;
    
  const formattedBindingPeriodDate = updates.bindingPeriodDate 
    ? format(new Date(updates.bindingPeriodDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : undefined;

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
  const { error } = await supabase
    .from('tenders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tender:', error);
    throw error;
  }
};

