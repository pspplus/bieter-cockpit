
import { supabase } from "@/integrations/supabase/client";
import { Folder } from "@/types/tender";
import { toast } from "sonner";

// Convert a Supabase folder to our application Folder type
const mapFolderFromDB = (folder: any): Folder => {
  return {
    id: folder.id,
    name: folder.name,
    parentId: folder.parent_id,
    tenderId: folder.tender_id,
    folderOrder: folder.folder_order,
    folderPath: folder.folder_path,
    isDefault: folder.is_default,
    children: []
  };
};

// Fetch folders for a tender
export const fetchFolders = async (tenderId: string): Promise<Folder[]> => {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('tender_id', tenderId)
      .order('folder_order', { ascending: true });

    if (error) {
      console.error("Error fetching folders:", error);
      throw error;
    }

    const folders = data.map(mapFolderFromDB);
    
    // Organize folders into a hierarchy
    const folderMap = new Map<string, Folder>();
    const rootFolders: Folder[] = [];
    
    // First pass: map all folders by their id
    folders.forEach(folder => folderMap.set(folder.id, { ...folder, children: [] }));
    
    // Second pass: set up parent-child relationships
    folders.forEach(folder => {
      const currentFolder = folderMap.get(folder.id)!;
      
      if (folder.parentId) {
        // This is a child folder, add it to its parent's children
        const parentFolder = folderMap.get(folder.parentId);
        if (parentFolder) {
          if (!parentFolder.children) {
            parentFolder.children = [];
          }
          parentFolder.children.push(currentFolder);
        }
      } else {
        // This is a root folder
        rootFolders.push(currentFolder);
      }
    });
    
    return rootFolders;
  } catch (error) {
    console.error("Error in fetchFolders:", error);
    throw error;
  }
};

// Create a new folder
export const createFolder = async (folder: Partial<Folder>): Promise<Folder> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Build folder path
    let folderPath = folder.name || '';
    if (folder.parentId) {
      // Get parent folder to build path
      const { data: parentData, error: parentError } = await supabase
        .from('folders')
        .select('folder_path')
        .eq('id', folder.parentId)
        .single();
      
      if (parentError) {
        console.error("Error fetching parent folder:", parentError);
        throw parentError;
      }
      
      folderPath = `${parentData.folder_path}/${folder.name}`;
    }
    
    // Prepare folder data for database
    const folderData = {
      name: folder.name,
      parent_id: folder.parentId,
      tender_id: folder.tenderId,
      folder_order: folder.folderOrder || 0,
      folder_path: folderPath,
      is_default: folder.isDefault || false,
      user_id: user.id
    };
    
    // Insert the folder
    const { data, error } = await supabase
      .from('folders')
      .insert(folderData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
    
    return mapFolderFromDB(data);
  } catch (error) {
    console.error("Error in createFolder:", error);
    throw error;
  }
};

// Update a folder
export const updateFolder = async (folder: Folder): Promise<void> => {
  try {
    // Prepare folder data for database
    const folderData = {
      name: folder.name,
      folder_order: folder.folderOrder,
      is_default: folder.isDefault
    };
    
    // Update the folder
    const { error } = await supabase
      .from('folders')
      .update(folderData)
      .eq('id', folder.id);
    
    if (error) {
      console.error("Error updating folder:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateFolder:", error);
    throw error;
  }
};

// Delete a folder
export const deleteFolder = async (folderId: string): Promise<void> => {
  try {
    // Check if folder has documents
    const { data: documents, error: docError } = await supabase
      .from('documents')
      .select('id')
      .eq('folder_id', folderId);
    
    if (docError) {
      console.error("Error checking for documents:", docError);
      throw docError;
    }
    
    if (documents && documents.length > 0) {
      toast.error('Cannot delete folder that contains documents');
      throw new Error('Folder contains documents');
    }
    
    // Delete the folder
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);
    
    if (error) {
      console.error("Error deleting folder:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteFolder:", error);
    throw error;
  }
};
