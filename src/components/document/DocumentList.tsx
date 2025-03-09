import { useState } from "react";
import { TenderDocument, Folder } from "@/types/tender";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  FileIcon, 
  Trash2, 
  Download, 
  File, 
  Upload,
  FolderClosed 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { toast } from "sonner";
import { uploadDocument, uploadMultipleDocuments, deleteDocument, fetchFolderDocuments } from "@/services/documentService";
import { FolderTree } from "@/components/folder/FolderTree";

interface DocumentListProps {
  documents: TenderDocument[];
  tenderId?: string;
  milestoneId?: string;
  folders?: Folder[];
  onDocumentAdded: (document: TenderDocument) => void;
  onDocumentDeleted: (documentId: string) => void;
}

export function DocumentList({
  documents,
  tenderId,
  milestoneId,
  folders = [], // Default to empty array if not provided
  onDocumentAdded,
  onDocumentDeleted
}: DocumentListProps) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [documentDescription, setDocumentDescription] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [currentDocuments, setCurrentDocuments] = useState<TenderDocument[]>(documents);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      
      // Generate names from file names (removing extension)
      const newNames = filesArray.map(file => file.name.split('.')[0]);
      setDocumentNames(newNames);
    }
  };
  
  const handleNameChange = (index: number, value: string) => {
    const newNames = [...documentNames];
    newNames[index] = value;
    setDocumentNames(newNames);
  };
  
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Bitte wählen Sie mindestens eine Datei aus");
      return;
    }
    
    // Verify all files have names
    const emptyNameIndex = documentNames.findIndex(name => !name.trim());
    if (emptyNameIndex !== -1) {
      toast.error(`Bitte geben Sie einen Namen für Dokument ${emptyNameIndex + 1} ein`);
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload multiple files
      const uploadedDocuments = await uploadMultipleDocuments(
        selectedFiles,
        documentNames,
        documentDescription,
        tenderId,
        milestoneId,
        selectedFolder
      );
      
      // Update UI with all newly uploaded documents
      uploadedDocuments.forEach(doc => {
        onDocumentAdded(doc);
      });
      
      setCurrentDocuments(prev => [...uploadedDocuments, ...prev]);
      
      const messageText = uploadedDocuments.length === 1 
        ? "Dokument erfolgreich hochgeladen"
        : `${uploadedDocuments.length} Dokumente erfolgreich hochgeladen`;
      
      toast.success(messageText);
      
      // Reset form
      setSelectedFiles([]);
      setDocumentNames([]);
      setDocumentDescription("");
      
      // Close dialog by clicking the close button
      const closeButton = document.querySelector('[data-dialog-close]') as HTMLButtonElement;
      if (closeButton) closeButton.click();
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Fehler beim Hochladen der Dokumente");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      onDocumentDeleted(documentId);
      setCurrentDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success("Dokument erfolgreich gelöscht");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Fehler beim Löschen des Dokuments");
    }
  };
  
  // Function to format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unbekannte Größe';
    
    if (bytes < 1024) return bytes + ' Bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Function to get icon for file type
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileIcon className="text-red-500" />;
    if (fileType.includes('image')) return <FileIcon className="text-blue-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileIcon className="text-indigo-500" />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FileIcon className="text-green-500" />;
    return <File />;
  };

  // New function to handle folder selection
  const handleFolderSelect = async (folder: Folder) => {
    try {
      setCurrentFolderId(folder.id);
      const folderDocuments = await fetchFolderDocuments(folder.id);
      setCurrentDocuments(folderDocuments);
    } catch (error) {
      console.error("Error fetching folder documents:", error);
      toast.error("Fehler beim Laden der Ordnerdokumente");
    }
  };

  // Function to reset to all documents view
  const handleResetView = () => {
    setCurrentFolderId(null);
    setCurrentDocuments(documents);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Dokumente</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-1" />
              Hochladen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Dokument hochladen</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple // Enable multiple file selection
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFiles.length > 0 
                      ? `${selectedFiles.length} ${selectedFiles.length === 1 ? "Datei ausgewählt" : "Dateien ausgewählt"}`
                      : "Klicken Sie zum Hochladen"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Maximale Dateigröße: 10MB
                  </span>
                </label>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Ausgewählte Dateien</h4>
                  
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-muted flex items-center justify-center rounded">
                          <FileIcon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1">
                          <Input
                            value={documentNames[index] || ''}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            placeholder="Name für diese Datei"
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {folders && folders.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Ordner auswählen
                  </label>
                  <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                    <FolderTree 
                      folders={folders} 
                      onSelectFolder={(folderId) => setSelectedFolder(folderId)}
                      selectedFolderId={selectedFolder}
                      readOnly={true}
                      tenderId={tenderId || ""}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="document-description" className="text-sm font-medium">
                  Beschreibung
                </label>
                <Textarea
                  id="document-description"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Optionale Beschreibung für die Dokumente"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Diese Beschreibung wird auf alle hochgeladenen Dateien angewendet
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" data-dialog-close>
                  Abbrechen
                </Button>
              </DialogClose>
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Wird hochgeladen..." : "Hochladen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex space-x-4">
        <div className="w-1/3 border rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <FolderClosed className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">Ordnerstruktur</h4>
          </div>
          {folders && folders.length > 0 ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-2 text-sm" 
                onClick={handleResetView}
              >
                Alle Dokumente
              </Button>
              <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                <FolderTree 
                  folders={folders} 
                  onFolderSelect={handleFolderSelect}
                  selectedFolderId={currentFolderId}
                  tenderId={tenderId || ""}
                  readOnly={true}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Keine Ordner verfügbar
              </p>
            </div>
          )}
        </div>
        
        <div className="w-2/3">
          {currentDocuments.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <File className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {currentFolderId 
                  ? "Keine Dokumente in diesem Ordner" 
                  : "Keine Dokumente verfügbar"}
              </p>
            </div>
          ) : (
            <div className="border rounded-md divide-y max-h-[calc(100vh-300px)] overflow-y-auto">
              {currentDocuments.map((document) => (
                <div 
                  key={document.id} 
                  className="flex items-center justify-between p-3 hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded">
                      {getFileTypeIcon(document.fileType)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium">
                        {document.name}
                      </h4>
                      <div className="flex space-x-3 text-xs text-muted-foreground">
                        <span>{formatFileSize(document.fileSize)}</span>
                        <span>•</span>
                        <span>{format(new Date(document.uploadDate), 'PPP')}</span>
                      </div>
                      {document.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {document.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      asChild
                    >
                      <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="w-4 h-4" />
                        <span className="sr-only">Herunterladen</span>
                      </a>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(document.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Löschen</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
