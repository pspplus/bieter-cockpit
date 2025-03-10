
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

// Helper to determine if a file is viewable in browser
export const isViewableInBrowser = (fileType: string): boolean => {
  const viewableTypes = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'image/bmp',
    // PDFs
    'application/pdf',
    // Text files
    'text/plain', 'text/html', 'text/css', 'text/javascript',
    // Video files
    'video/mp4', 'video/webm', 'video/ogg',
    // Audio files
    'audio/mpeg', 'audio/ogg', 'audio/wav'
  ];
  
  return viewableTypes.includes(fileType);
};

// Helper to get file category for UI display
export const getFileCategory = (fileType: string): 'image' | 'pdf' | 'video' | 'audio' | 'text' | 'other' => {
  if (fileType.startsWith('image/')) return 'image';
  if (fileType === 'application/pdf') return 'pdf';
  if (fileType.startsWith('video/')) return 'video';
  if (fileType.startsWith('audio/')) return 'audio';
  if (fileType.startsWith('text/')) return 'text';
  return 'other';
};

// Helper to sanitize file name for storage
const sanitizeFileName = (fileName: string): string => {
  // Remove special characters and replace spaces with underscores
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_');  // Replace multiple underscores with a single one
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
  const uniqueId = uuidv4();
  const sanitizedFileName = sanitizeFileName(file.name);
  const uniqueFileName = `${uniqueId}-${sanitizedFileName}`;
  
  console.log(`Uploading file: ${uniqueFileName}`);
  
  // Upload file to Storage - Using 'documents' bucket
  const { data: fileData, error: uploadError } = await supabase
    .storage
    .from('documents')
    .upload(uniqueFileName, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // Get public URL for the file - Using 'documents' bucket
  const { data: urlData } = await supabase
    .storage
    .from('documents')
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

// Delete multiple documents
export const deleteMultipleDocuments = async (ids: string[]): Promise<void> => {
  if (ids.length === 0) return;

  for (const id of ids) {
    await deleteDocument(id);
  }
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
    // Delete the file from storage - Using 'documents' bucket
    const { error: storageError } = await supabase
      .storage
      .from('documents')
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
