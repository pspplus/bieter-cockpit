
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Milestone } from "@/types/tender";

interface MilestoneTemplate {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  checklist_items: string[];
  created_at: string;
  updated_at: string;
}

export function useMilestoneTemplate(milestone: Milestone | null) {
  const [template, setTemplate] = useState<MilestoneTemplate | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!milestone?.title) return;

      const { data: templateData } = await supabase
        .from('milestone_templates')
        .select('*')
        .eq('title', milestone.title)
        .maybeSingle();

      if (templateData) {
        const template: MilestoneTemplate = {
          ...templateData,
          checklist_items: Array.isArray(templateData.checklist_items) 
            ? templateData.checklist_items as string[]
            : []
        };
        setTemplate(template);
      }
    };

    loadTemplate();
  }, [milestone?.title]);

  return template;
}
