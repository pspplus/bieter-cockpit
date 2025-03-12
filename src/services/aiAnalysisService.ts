
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
    
    // Filter out documents without URLs
    const validDocuments = documents.filter(doc => doc.fileUrl && doc.fileUrl.trim() !== '');
    
    if (validDocuments.length === 0) {
      throw new Error('Keine gültigen Dokument-URLs zur Analyse vorhanden.');
    }
    
    // Set intermediate progress as we're starting to process
    if (onProgress) {
      onProgress(20);
    }

    const { data, error } = await supabase.functions.invoke('analyze-documents', {
      body: { 
        documentUrls: validDocuments.map(doc => doc.fileUrl),
        customPrompt: customPrompt
      }
    });

    if (error) {
      console.error('Error analyzing documents:', error);
      throw new Error('Fehler bei der Dokumentenanalyse: ' + error.message);
    }

    // Set progress to almost complete
    if (onProgress) {
      onProgress(90);
    }

    // Small delay to show completion progress
    setTimeout(() => {
      if (onProgress) {
        onProgress(100); // Completed
      }
    }, 500);

    return data.analysis;
  } catch (error) {
    console.error('Error in document analysis:', error);
    toast.error('Fehler bei der KI-Analyse: ' + (error instanceof Error ? error.message : String(error)));
    throw error;
  }
}
