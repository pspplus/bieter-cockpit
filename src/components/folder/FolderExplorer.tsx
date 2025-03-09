import { useState, useEffect } from "react";
import { Folder, TenderDocument } from "@/types/tender";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  FolderIcon, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  FileIcon,
  Edit,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createFolder, deleteFolder, updateFolder } from "@/services/folderService";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderExplorerProps {
  folders: Folder[];
  documents: TenderDocument[];
  tenderId: string;
  onFolderCreated?: (folder: Folder) => void;
  onFolderDeleted?: (folderId: string) => void;
  onFolderUpdated?: (folder: Folder) => void;
  onSelectDocument?: (document: TenderDocument) => void;
  onDeleteDocument?: (documentId: string) => void;
}

export function FolderExplorer({ 
  folders, 
  documents, 
  tenderId,
  onFolderCreated,
  onFolderDeleted,
  onFolderUpdated,
  onSelectDocument,
  onDeleteDocument
}: FolderExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isEditingFolder, setIsEditingFolder] = useState(false);
  const { t } = useTranslation();

  // Initialize root folders as expanded
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    folders
      .filter(folder => !folder.parentId)
      .forEach(folder => {
        initialExpanded[folder.id] = true;
      });
    setExpandedFolders(initialExpanded);
  }, []);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error(t("folderExplorer.folderNameRequired"));
      return;
    }

    try {
      const newFolder = await createFolder({
        name: newFolderName,
        tenderId,
        parentId: null
      });
      
      toast.success(t("folderExplorer.folderCreated"));
      setNewFolderName("");
      setIsCreatingFolder(false);
      
      if (onFolderCreated) {
        onFolderCreated(newFolder);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error(t("folderExplorer.errorCreatingFolder"));
    }
  };

  const handleUpdateFolder = async () => {
    if (!editingFolder || !editedFolderName.trim()) {
      toast.error(t("folderExplorer.folderNameRequired"));
      return;
    }

    try {
      const updatedFolder = await updateFolder(editingFolder.id, {
        name: editedFolderName
      });
      
      toast.success(t("folderExplorer.folderUpdated"));
      setEditingFolder(null);
      setEditedFolderName("");
      setIsEditingFolder(false);
      
      if (onFolderUpdated) {
        onFolderUpdated(updatedFolder);
      }
    } catch (error) {
      console.error("Error updating folder:", error);
      toast.error(t("folderExplorer.errorUpdatingFolder"));
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder(folderId);
      toast.success(t("folderExplorer.folderDeleted"));
      
      if (onFolderDeleted) {
        onFolderDeleted(folderId);
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error(t("folderExplorer.errorDeletingFolder"));
    }
  };

  const startEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setEditedFolderName(folder.name);
    setIsEditingFolder(true);
  };

  // Recursive function to render folder tree
  const renderFolder = (folder: Folder) => {
    const isExpanded = expandedFolders[folder.id] || false;
    const childFolders = folders.filter(f => f.parentId === folder.id);
    const folderDocuments = documents.filter(d => d.folderId === folder.id);
    
    return (
      <div key={folder.id} className="folder-item">
        <div className="flex items-center group">
          <button 
            onClick={() => toggleFolder(folder.id)}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          <div className="flex items-center flex-grow p-1 hover:bg-gray-100 rounded cursor-pointer" onClick={() => toggleFolder(folder.id)}>
            <FolderIcon className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-sm">{folder.name}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => startEditFolder(folder)}>
                <Edit className="h-4 w-4 mr-2" />
                {t("folderExplorer.rename")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteFolder(folder.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("folderExplorer.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {isExpanded && (
          <div className="pl-6 mt-1">
            {childFolders.map(childFolder => renderFolder(childFolder))}
            
            {folderDocuments.map(doc => (
              <div key={doc.id} className="flex items-center group py-1">
                <div 
                  className="flex items-center flex-grow p-1 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => onSelectDocument && onSelectDocument(doc)}
                >
                  <FileIcon className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm truncate">{doc.name}</span>
                </div>
                
                {onDeleteDocument && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    onClick={() => onDeleteDocument(doc.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Get root folders (those without a parent)
  const rootFolders = folders.filter(folder => !folder.parentId);
  
  // Get documents without a folder
  const unfiledDocuments = documents.filter(doc => !doc.folderId);

  return (
    <div className="folder-explorer border rounded-md p-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">{t("folderExplorer.folders")}</h3>
        
        <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-1" />
              {t("folderExplorer.newFolder")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("folderExplorer.createNewFolder")}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder={t("folderExplorer.folderName")}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>
              <Button onClick={handleCreateFolder}>{t("create")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditingFolder} onOpenChange={setIsEditingFolder}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("folderExplorer.renameFolder")}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder={t("folderExplorer.folderName")}
                value={editedFolderName}
                onChange={(e) => setEditedFolderName(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>
              <Button onClick={handleUpdateFolder}>{t("save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-1">
        {rootFolders.map(folder => renderFolder(folder))}
        
        {/* Unfiled documents section */}
        {unfiledDocuments.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <FileIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm font-medium">{t("folderExplorer.unfiledDocuments")}</span>
            </div>
            
            <div className="pl-6 space-y-1">
              {unfiledDocuments.map(doc => (
                <div key={doc.id} className="flex items-center group py-1">
                  <div 
                    className="flex items-center flex-grow p-1 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => onSelectDocument && onSelectDocument(doc)}
                  >
                    <FileIcon className="h-4 w-4 text-blue-400 mr-2" />
                    <span className="text-sm truncate">{doc.name}</span>
                  </div>
                  
                  {onDeleteDocument && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => onDeleteDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {folders.length === 0 && documents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FolderIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">{t("folderExplorer.noFilesOrFolders")}</p>
            <p className="text-xs mt-1">{t("folderExplorer.createFolderOrUpload")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
