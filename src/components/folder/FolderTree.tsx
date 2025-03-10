
import React, { useState, useEffect } from 'react';
import { Folder as FolderIcon, ChevronRight, ChevronDown, File, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Folder, TenderDocument } from '@/types/tender';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { deleteFolder, createFolder } from '@/services/folderService';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FolderTreeProps {
  folders: Folder[];
  documents?: Record<string, TenderDocument[]>;
  onFolderSelect?: (folder: Folder) => void;
  selectedFolderId?: string | null;
  tenderId: string;
  onFolderCreate?: (folder: Folder) => void;
  onFolderDelete?: (folderId: string) => void;
  readOnly?: boolean;
  onSelectFolder?: (folderId: string | null) => void;
}

export function FolderTree({ 
  folders, 
  documents = {}, 
  onFolderSelect, 
  selectedFolderId, 
  tenderId,
  onFolderCreate,
  onFolderDelete,
  readOnly = false,
  onSelectFolder
}: FolderTreeProps) {
  const { t } = useTranslation();
  // Initialize with empty Set
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  // Use useEffect to ensure all folders are expanded when the component mounts
  // or when the folders array changes
  useEffect(() => {
    const allFolderIds = new Set<string>();
    
    // Recursive function to collect all folder IDs
    const collectFolderIds = (folderList: Folder[]) => {
      folderList.forEach(folder => {
        allFolderIds.add(folder.id);
        if (folder.children && folder.children.length > 0) {
          collectFolderIds(folder.children);
        }
      });
    };
    
    collectFolderIds(folders);
    setExpandedFolders(allFolderIds);
  }, [folders]);

  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleFolderClick = (folder: Folder) => {
    if (onFolderSelect) {
      onFolderSelect(folder);
    }
    if (onSelectFolder) {
      onSelectFolder(folder.id);
    }
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;
    
    try {
      await deleteFolder(folderToDelete);
      toast.success("Ordner erfolgreich gelöscht");
      setDeleteDialogOpen(false);
      setFolderToDelete(null);
      
      if (onFolderDelete) {
        onFolderDelete(folderToDelete);
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      if (error instanceof Error && error.message === 'Folder contains documents') {
        toast.error("Ordner mit Dokumenten kann nicht gelöscht werden");
      } else {
        toast.error("Fehler beim Löschen des Ordners");
      }
    }
  };

  const confirmDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFolderToDelete(folderId);
    setDeleteDialogOpen(true);
  };

  const openNewFolderDialog = (parentId: string | null, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewFolderParentId(parentId);
    setNewFolderName('');
    setNewFolderDialogOpen(true);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Ordnername ist erforderlich");
      return;
    }
    
    try {
      const newFolder = await createFolder({
        name: newFolderName.trim(),
        parentId: newFolderParentId,
        tenderId,
        folderOrder: 0,
        isDefault: false
      });
      
      toast.success("Ordner wurde erstellt");
      setNewFolderDialogOpen(false);
      
      if (onFolderCreate) {
        onFolderCreate(newFolder);
      }
      
      // Expand the parent folder if it exists
      if (newFolderParentId) {
        setExpandedFolders(prev => new Set([...prev, newFolderParentId]));
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Fehler beim Erstellen des Ordners");
    }
  };

  const renderFolder = (folder: Folder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    const isSelected = folder.id === selectedFolderId;
    const documentCount = documents[folder.id]?.length || 0;
    
    return (
      <div key={folder.id} className="font-medium">
        <div 
          className={cn(
            "flex items-center py-1 px-1 rounded hover:bg-muted cursor-pointer",
            isSelected && "bg-muted"
          )}
          style={{ paddingLeft: `${level * 12 + 4}px` }}
          onClick={() => handleFolderClick(folder)}
        >
          <div className="mr-1 w-4 h-4 flex-shrink-0" onClick={(e) => hasChildren && toggleFolder(folder.id, e)}>
            {hasChildren && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
          </div>
          <FolderIcon className="w-4 h-4 mr-2 text-tender-500" />
          <span className="flex-grow truncate">{folder.name}</span>
          
          {documentCount > 0 && (
            <Badge variant="outline" className="ml-2 text-xs">
              {documentCount}
            </Badge>
          )}
          
          {!readOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => openNewFolderDialog(folder.id, e)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Neuer Unterordner
                </DropdownMenuItem>
                
                {!folder.isDefault && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive" 
                      onClick={(e) => confirmDeleteFolder(folder.id, e)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Ordner löschen
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {folder.children!.map(childFolder => renderFolder(childFolder, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {!readOnly && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Ordner</h3>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-2"
            onClick={(e) => openNewFolderDialog(null, e)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Neuer Ordner
          </Button>
        </div>
      )}
      
      <div className={cn("rounded-md border p-2", !readOnly && "h-[calc(100vh-300px)] overflow-y-auto")}>
        {folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
            <FolderIcon className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Keine Ordner vorhanden</p>
          </div>
        ) : (
          folders.map(folder => renderFolder(folder))
        )}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ordner löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diesen Ordner löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFolder}
              className="bg-destructive hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuer Ordner</DialogTitle>
            <DialogDescription>
              Geben Sie einen Namen für den neuen Ordner ein.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="folder-name">Name</Label>
            <Input
              id="folder-name"
              placeholder="Ordnername"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateFolder}>
              Erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
