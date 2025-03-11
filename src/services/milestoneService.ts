
import { supabase } from "@/integrations/supabase/client";
import { Milestone, MilestoneStatus, TenderDocument } from "@/types/tender";
import { fetchMilestoneDocuments } from "./documentService";

// Datenbankzeile zu Milestone-Objekt konvertieren
const mapMilestoneFromDB = (milestone: any): Milestone => {
  return {
    id: milestone.id,
    title: milestone.title,
    description: milestone.description,
    status: milestone.status as MilestoneStatus,
    sequenceNumber: milestone.sequence_number,
    dueDate: milestone.due_date ? new Date(milestone.due_date) : null,
    completionDate: milestone.completion_date ? new Date(milestone.completion_date) : null,
    notes: milestone.notes,
    tenderId: milestone.tender_id
  };
};

// Alle Meilensteine für ein Tender abrufen
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

// Meilenstein nach ID abrufen
export const fetchMilestoneById = async (milestoneId: string): Promise<Milestone> => {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('id', milestoneId)
    .single();

  if (error) {
    console.error('Error fetching milestone:', error);
    throw error;
  }

  return mapMilestoneFromDB(data);
};

// Meilenstein mit Dokumenten abrufen
export const fetchMilestoneWithDocuments = async (milestoneId: string): Promise<Milestone & { documents: TenderDocument[] }> => {
  const milestone = await fetchMilestoneById(milestoneId);
  const documents = await fetchMilestoneDocuments(milestoneId);
  
  return {
    ...milestone,
    documents
  };
};

// Meilenstein erstellen
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
      notes: milestone.notes || null,
      tender_id: milestone.tenderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }

  return mapMilestoneFromDB(data);
};

// Meilenstein aktualisieren
export const updateMilestone = async (id: string, updates: Partial<Milestone>): Promise<Milestone> => {
  const updateObject: any = {
    updated_at: new Date().toISOString()
  };

  if (updates.title !== undefined) updateObject.title = updates.title;
  if (updates.description !== undefined) updateObject.description = updates.description;
  if (updates.status !== undefined) updateObject.status = updates.status;
  if (updates.sequenceNumber !== undefined) updateObject.sequence_number = updates.sequenceNumber;
  if (updates.dueDate !== undefined) updateObject.due_date = updates.dueDate?.toISOString() || null;
  if (updates.completionDate !== undefined) updateObject.completion_date = updates.completionDate?.toISOString() || null;
  if (updates.notes !== undefined) updateObject.notes = updates.notes;

  const { data, error } = await supabase
    .from('milestones')
    .update(updateObject)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }

  return mapMilestoneFromDB(data);
};

// Meilenstein-Status aktualisieren
export const updateMilestoneStatus = async (id: string, status: MilestoneStatus): Promise<Milestone> => {
  const updates: any = {
    status,
    updated_at: new Date().toISOString()
  };
  
  // Wenn als "completed" markiert, Abschlussdatum setzen
  if (status === 'completed') {
    updates.completion_date = new Date().toISOString();
  }
  // Wenn von "completed" zurückgesetzt, Abschlussdatum entfernen
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

// Meilenstein löschen
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

// Alle Meilensteine für alle Ausschreibungen abrufen
export const fetchAllMilestones = async (): Promise<(Milestone & { tenderTitle?: string })[]> => {
  const { data, error } = await supabase
    .from('milestones')
    .select(`
      *,
      tenders (
        title,
        id
      )
    `)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching all milestones:', error);
    throw error;
  }

  return (data || []).map(milestone => ({
    ...mapMilestoneFromDB(milestone),
    tenderTitle: milestone.tenders?.title
  }));
};

