
import { supabase } from "@/integrations/supabase/client";
import { TenderDocument } from "@/types/tender";
import { v4 as uuidv4 } from "uuid";

// Convert a Supabase document row to our application TenderDocument type
const mapDocumentFromDB = (document: any): TenderDocument => {
  return {
    id: document.id,
    name: document.name,
    description: document.description || "",
    fileUrl: document.file_url,
    fileType: document.file_type,
    fileSize: document.file_size,
    uploadDate: new Date(document.upload_date),
    tenderId: document.tender_id,
    milestoneId: document.milestone_id,
    folderId: document.folder_id
  };
};

// Fetch documents for a tender
export const fetchTenderDocuments = async (tenderId: string): Promise<TenderDocument[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('tender_id', tenderId)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }

  return (data || []).map(mapDocumentFromDB);
};

// Fetch documents for a milestone
export const fetchMilestoneDocuments = async (milestoneId: string): Promise<TenderDocument[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('milestone_id', milestoneId)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error fetching milestone documents:', error);
    throw error;
  }

  return (data || []).map(mapDocumentFromDB);
};

// Fetch documents for a specific folder
export const fetchFolderDocuments = async (folderId: string): Promise<TenderDocument[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('folder_id', folderId)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error fetching folder documents:', error);
    throw error;
  }

  return (data || []).map(mapDocumentFromDB);
};

// Upload a single document
export const uploadDocument = async (
  file: File,
  name: string,
  description: string = "",
  tenderId?: string,
  milestoneId?: string,
  folderId?: string | null
): Promise<TenderDocument> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Create a unique file name to prevent overwriting
  const uniqueFileName = `${uuidv4()}-${file.name}`;
  
  // Upload file to Storage - CHANGED FROM 'documents' to 'tender_documents'
  const { data: fileData, error: uploadError } = await supabase
    .storage
    .from('tender_documents')
    .upload(uniqueFileName, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // Get public URL for the file - CHANGED FROM 'documents' to 'tender_documents'
  const { data: urlData } = await supabase
    .storage
    .from('tender_documents')
    .getPublicUrl(uniqueFileName);

  const fileUrl = urlData.publicUrl;

  // Create document entry in database
  const documentData = {
    name,
    description,
    file_url: fileUrl,
    file_type: file.type,
    file_size: file.size,
    upload_date: new Date().toISOString(),
    user_id: user.id,
    tender_id: tenderId || null,
    milestone_id: milestoneId || null,
    folder_id: folderId || null
  };

  const { data: document, error: documentError } = await supabase
    .from('documents')
    .insert(documentData)
    .select()
    .single();

  if (documentError) {
    console.error('Error creating document entry:', documentError);
    throw documentError;
  }

  return mapDocumentFromDB(document);
};

// Upload multiple documents at once
export const uploadMultipleDocuments = async (
  files: File[],
  names: string[],
  description: string = "",
  tenderId?: string,
  milestoneId?: string,
  folderId?: string | null
): Promise<TenderDocument[]> => {
  const uploadedDocuments: TenderDocument[] = [];
  
  for (let i = 0; i < files.length; i++) {
    // Use the file name if no custom name is provided
    const documentName = names[i] || files[i].name.split('.')[0];
    
    try {
      const document = await uploadDocument(
        files[i],
        documentName,
        description,
        tenderId,
        milestoneId,
        folderId
      );
      
      uploadedDocuments.push(document);
    } catch (error) {
      console.error(`Error uploading file ${files[i].name}:`, error);
      // Continue with other files even if one fails
    }
  }
  
  return uploadedDocuments;
};

// Delete a document
export const deleteDocument = async (id: string): Promise<void> => {
  // First get the document to get the file URL
  const { data: document, error: getError } = await supabase
    .from('documents')
    .select('file_url')
    .eq('id', id)
    .single();

  if (getError) {
    console.error('Error fetching document for deletion:', getError);
    throw getError;
  }

  // Extract the file name from the URL
  const fileUrl = document.file_url;
  const fileName = fileUrl.split('/').pop();

  if (fileName) {
    // Delete the file from storage - CHANGED FROM 'documents' to 'tender_documents'
    const { error: storageError } = await supabase
      .storage
      .from('tender_documents')
      .remove([fileName]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue with deleting the database entry even if storage delete fails
    }
  }

  // Delete the document entry from the database
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting document from database:', deleteError);
    throw deleteError;
  }
};
