
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MilestoneTemplate {
  id: string;
  title: string;
  description: string | null;
  checklist_items: string[];
  created_at: string;
  updated_at: string;
}

export const fetchMilestoneTemplates = async (): Promise<MilestoneTemplate[]> => {
  const { data, error } = await supabase
    .from('milestone_templates')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching milestone templates:', error);
    throw error;
  }

  return data || [];
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

  return data;
};

export const createMilestoneTemplate = async (template: Partial<MilestoneTemplate>): Promise<MilestoneTemplate> => {
  const { data, error } = await supabase
    .from('milestone_templates')
    .insert([template])
    .select()
    .single();

  if (error) {
    console.error('Error creating milestone template:', error);
    throw error;
  }

  return data;
};

export const updateMilestoneTemplate = async (id: string, updates: Partial<MilestoneTemplate>): Promise<void> => {
  const { error } = await supabase
    .from('milestone_templates')
    .update(updates)
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
