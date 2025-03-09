
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
import { uploadDocument, deleteDocument } from "@/services/documentService";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Use file name as document name if none is provided
      if (!documentName) {
        setDocumentName(file.name.split('.')[0]);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(t('errorMessages.selectFile', 'Please select a file'));
      return;
    }
    
    if (!documentName.trim()) {
      toast.error(t('errorMessages.enterDocumentName', 'Please enter a document name'));
      return;
    }
    
    try {
      setIsUploading(true);
      const newDocument = await uploadDocument(
        selectedFile,
        documentName,
        documentDescription,
        tenderId,
        milestoneId,
        selectedFolder
      );
      
      onDocumentAdded(newDocument);
      toast.success(t('documents.uploadSuccess', 'Document uploaded successfully'));
      
      // Reset form
      setSelectedFile(null);
      setDocumentName("");
      setDocumentDescription("");
      setSelectedFolder(null);
      
      // Close dialog by clicking the close button
      const closeButton = document.querySelector('[data-dialog-close]') as HTMLButtonElement;
      if (closeButton) closeButton.click();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(t('errorMessages.uploadFailed', 'Failed to upload document'));
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      onDocumentDeleted(documentId);
      toast.success(t('documents.deleteSuccess', 'Document deleted successfully'));
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(t('errorMessages.deleteFailed', 'Failed to delete document'));
    }
  };
  
  // Function to format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    
    if (bytes < 1024) return bytes + ' bytes';
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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('documents.documents')}</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-1" />
              {t('documents.upload')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t('documents.uploadDocument')}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFile ? selectedFile.name : t('documents.clickToUpload')}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {t('documents.maxFileSize')}
                  </span>
                </label>
              </div>
              
              {folders && folders.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('documents.selectFolder', 'Select Folder')}
                  </label>
                  <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                    <FolderTree 
                      folders={folders} 
                      onSelectFolder={(folderId) => setSelectedFolder(folderId)}
                      selectedFolderId={selectedFolder}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="document-name" className="text-sm font-medium">
                  {t('documents.name')} *
                </label>
                <Input
                  id="document-name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder={t('documents.namePlaceholder')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="document-description" className="text-sm font-medium">
                  {t('documents.description')}
                </label>
                <Textarea
                  id="document-description"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder={t('documents.descriptionPlaceholder')}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" data-dialog-close>
                  {t('general.cancel')}
                </Button>
              </DialogClose>
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? t('documents.uploading') : t('documents.upload')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {folders && folders.length > 0 && (
        <div className="border rounded-md p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FolderClosed className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">{t('documents.folderStructure', 'Folder Structure')}</h4>
          </div>
          <FolderTree folders={folders} readOnly />
        </div>
      )}
      
      {documents.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <File className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {t('documents.noDocuments')}
          </p>
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          {documents.map((document) => (
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
                    <span className="sr-only">{t('documents.download')}</span>
                  </a>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(document.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">{t('documents.delete')}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
