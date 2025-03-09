import React, { useState, useEffect } from 'react';
import { FolderTree } from './FolderTree';
import { Folder, TenderDocument } from '@/types/tender';
import { fetchFolders } from '@/services/folderService';
import { fetchFolderDocuments, fetchTenderDocuments } from '@/services/documentService';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { DocumentListAdapter } from '@/components/document/DocumentListAdapter';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FolderExplorerProps {
  tenderId: string;
  onUploadClick?: (folderId: string) => void;
  readOnly?: boolean;
}

export function FolderExplorer({ tenderId, onUploadClick, readOnly = false }: FolderExplorerProps) {
  const { t } = useTranslation();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Record<string, TenderDocument[]>>({});
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        setLoading(true);
        const folderData = await fetchFolders(tenderId);
        setFolders(folderData);
        
        if (folderData.length > 0 && !selectedFolder) {
          setSelectedFolder(folderData[0]);
        }
        
        const allDocs = await fetchTenderDocuments(tenderId);
        
        const docsByFolder: Record<string, TenderDocument[]> = {};
        allDocs.forEach(doc => {
          if (doc.folderId) {
            if (!docsByFolder[doc.folderId]) {
              docsByFolder[doc.folderId] = [];
            }
            docsByFolder[doc.folderId].push(doc);
          }
        });
        
        setDocuments(docsByFolder);
      } catch (error) {
        console.error("Error loading folders:", error);
        toast.error(t('errorMessages.couldNotLoadFolders'));
      } finally {
        setLoading(false);
      }
    };
    
    if (tenderId) {
      loadFolders();
    }
  }, [tenderId, t]);

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
  };

  const handleFolderCreate = (newFolder: Folder) => {
    setFolders(prevFolders => {
      const updatedFolders = [...prevFolders];
      
      if (!newFolder.parentId) {
        return [...updatedFolders, newFolder];
      }
      
      const updateFolderRecursive = (folders: Folder[]): Folder[] => {
        return folders.map(folder => {
          if (folder.id === newFolder.parentId) {
            return {
              ...folder,
              children: [...(folder.children || []), newFolder]
            };
          } else if (folder.children && folder.children.length > 0) {
            return {
              ...folder,
              children: updateFolderRecursive(folder.children)
            };
          }
          return folder;
        });
      };
      
      return updateFolderRecursive(updatedFolders);
    });
  };

  const handleFolderDelete = (folderId: string) => {
    setFolders(prevFolders => {
      const filteredRootFolders = prevFolders.filter(f => f.id !== folderId);
      
      if (filteredRootFolders.length !== prevFolders.length) {
        return filteredRootFolders;
      }
      
      const removeFolderRecursive = (folders: Folder[]): Folder[] => {
        return folders.map(folder => {
          if (folder.children && folder.children.length > 0) {
            return {
              ...folder,
              children: folder.children.filter(c => c.id !== folderId).map(child => {
                if (child.children && child.children.length > 0) {
                  return {
                    ...child,
                    children: removeFolderRecursive(child.children)
                  };
                }
                return child;
              })
            };
          }
          return folder;
        });
      };
      
      return removeFolderRecursive(prevFolders);
    });
    
    if (selectedFolder && selectedFolder.id === folderId) {
      if (folders.length > 0) {
        setSelectedFolder(folders[0]);
      } else {
        setSelectedFolder(null);
      }
    }
  };

  const handleDocumentDelete = (documentId: string) => {
    setDocuments(prevDocuments => {
      const updatedDocuments = { ...prevDocuments };
      
      Object.keys(updatedDocuments).forEach(folderId => {
        updatedDocuments[folderId] = updatedDocuments[folderId].filter(
          doc => doc.id !== documentId
        );
      });
      
      return updatedDocuments;
    });
  };

  const handleUploadClick = () => {
    if (selectedFolder && onUploadClick) {
      onUploadClick(selectedFolder.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-tender-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:gap-6">
      <div className="w-full md:w-1/4 mb-6 md:mb-0">
        <FolderTree 
          folders={folders} 
          documents={documents}
          onFolderSelect={handleFolderSelect}
          selectedFolderId={selectedFolder?.id}
          tenderId={tenderId}
          onFolderCreate={handleFolderCreate}
          onFolderDelete={handleFolderDelete}
          readOnly={readOnly}
        />
      </div>
      
      <Separator orientation="vertical" className="hidden md:block" />
      
      <div className="w-full md:w-3/4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            {selectedFolder ? selectedFolder.name : t('folders.noFolderSelected')}
          </h3>
          
          {!readOnly && selectedFolder && (
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              {t('documents.uploadDocument')}
            </button>
          )}
        </div>
        
        {selectedFolder ? (
          documents[selectedFolder.id] && documents[selectedFolder.id].length > 0 ? (
            <DocumentListAdapter 
              documents={documents[selectedFolder.id] || []} 
              onDelete={handleDocumentDelete}
              readOnly={readOnly}
            />
          ) : (
            <div className="text-center py-16 border rounded-md bg-muted/20">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">{t('documents.noDocuments')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('documents.uploadToGetStarted')}
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-16 border rounded-md bg-muted/20">
            <h3 className="text-lg font-medium">{t('folders.selectFolderToViewDocuments')}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
