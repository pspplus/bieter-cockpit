
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface MilestoneTemplate {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  checklist_items: string[];
  created_at: string;
  updated_at: string;
}

interface DbMilestoneTemplate {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  checklist_items: Json;
  created_at: string;
  updated_at: string;
}

// Konvertierungsfunktionen
const toMilestoneTemplate = (dbTemplate: DbMilestoneTemplate): MilestoneTemplate => ({
  ...dbTemplate,
  checklist_items: Array.isArray(dbTemplate.checklist_items) 
    ? dbTemplate.checklist_items as string[]
    : []
});

export const fetchMilestoneTemplates = async (): Promise<MilestoneTemplate[]> => {
  const { data, error } = await supabase
    .from('milestone_templates')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching milestone templates:', error);
    throw error;
  }

  return (data || []).map(toMilestoneTemplate);
};

export const getMilestoneTemplate = async (id: string): Promise<MilestoneTemplate | null> => {
  const { data, error } = await supabase
    .from('milestone_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching milestone template:', error);
    throw error;
  }

  return data ? toMilestoneTemplate(data) : null;
};

export const createMilestoneTemplate = async (template: Omit<MilestoneTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<MilestoneTemplate> => {
  const { data, error } = await supabase
    .from('milestone_templates')
    .insert([{
      title: template.title,
      description: template.description,
      checklist_items: template.checklist_items,
      user_id: template.user_id
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating milestone template:', error);
    throw error;
  }

  return toMilestoneTemplate(data);
};

export const updateMilestoneTemplate = async (id: string, updates: Partial<Omit<MilestoneTemplate, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
  const { error } = await supabase
    .from('milestone_templates')
    .update({
      ...updates,
      checklist_items: updates.checklist_items || []
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating milestone template:', error);
    throw error;
  }
};

export const deleteMilestoneTemplate = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('milestone_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting milestone template:', error);
    throw error;
  }
};
