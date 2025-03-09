
import { supabase } from "@/integrations/supabase/client";
import { TenderDocument } from "@/types/tender";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const STORAGE_BUCKET = 'tender_documents';

// Upload a file to Supabase Storage and create a document record
export const uploadDocument = async (
  file: File,
  name: string,
  description: string,
  tenderId?: string,
  milestoneId?: string
): Promise<TenderDocument> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Generate a unique file path to avoid name collisions
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${uuidv4()}.${fileExt}`;

    // Upload the file to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    // Create a document record in the database
    const documentData = {
      name,
      description,
      tender_id: tenderId || null,
      milestone_id: milestoneId || null,
      file_url: publicUrl,
      file_type: file.type,
      file_size: file.size,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();

    if (error) {
      console.error("Error creating document record:", error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      fileUrl: data.file_url,
      fileType: data.file_type,
      fileSize: data.file_size,
      uploadDate: new Date(data.upload_date)
    };
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

// Fetch documents for a tender
export const fetchTenderDocuments = async (tenderId: string): Promise<TenderDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('tender_id', tenderId)
      .order('upload_date', { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }

    return data.map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || undefined,
      fileUrl: doc.file_url,
      fileType: doc.file_type,
      fileSize: doc.file_size,
      uploadDate: new Date(doc.upload_date)
    }));
  } catch (error) {
    console.error("Error fetching tender documents:", error);
    throw error;
  }
};

// Fetch documents for a milestone
export const fetchMilestoneDocuments = async (milestoneId: string): Promise<TenderDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('milestone_id', milestoneId)
      .order('upload_date', { ascending: false });

    if (error) {
      console.error("Error fetching milestone documents:", error);
      throw error;
    }

    return data.map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || undefined,
      fileUrl: doc.file_url,
      fileType: doc.file_type,
      fileSize: doc.file_size,
      uploadDate: new Date(doc.upload_date)
    }));
  } catch (error) {
    console.error("Error fetching milestone documents:", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    // First get the document to find the file path
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('file_url')
      .eq('id', documentId)
      .single();

    if (fetchError) {
      console.error("Error fetching document:", fetchError);
      throw fetchError;
    }

    // Extract the file path from the URL
    // The file path is in the format: {user_id}/{uuid}.{extension}
    const urlParts = doc.file_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const userId = urlParts[urlParts.length - 2];
    const filePath = `${userId}/${fileName}`;

    if (filePath) {
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue to delete the database record even if storage deletion fails
      }
    }

    // Delete the document record
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    throw error;
  }
};
