
import { TenderDocument } from "@/types/tender";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Analyze documents by calling the Supabase Edge Function that uses OpenAI
export const analyzeDocumentsWithAI = async (
  documents: TenderDocument[],
  customPrompt?: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  console.log("Starting AI analysis of", documents.length, "documents");
  console.log("Custom prompt:", customPrompt || "None provided");
  
  if (documents.length === 0) {
    return "Keine Dokumente zur Analyse vorhanden.";
  }
  
  try {
    // Call Supabase Edge Function for document analysis
    if (onProgress) {
      onProgress(10); // Starting progress
    }

    const { data, error } = await supabase.functions.invoke('analyze-documents', {
      body: { 
        documentUrls: documents.map(doc => doc.fileUrl),
        customPrompt: customPrompt
      }
    });

    if (error) {
      console.error('Error analyzing documents:', error);
      throw new Error('Fehler bei der Dokumentenanalyse: ' + error.message);
    }

    if (onProgress) {
      onProgress(100); // Completed
    }

    return data.analysis;
  } catch (error) {
    console.error('Error in document analysis:', error);
    toast.error('Fehler bei der KI-Analyse: ' + (error instanceof Error ? error.message : String(error)));
    throw error;
  }
}
