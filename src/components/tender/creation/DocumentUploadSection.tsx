
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FolderTree } from "@/components/folder/FolderTree";
import { Upload, File } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadSectionProps {
  onFileUpload: (files: File[], names: string[], description: string, folderId: string | null) => void;
  isUploading: boolean;
}

export function DocumentUploadSection({ onFileUpload, isUploading }: DocumentUploadSectionProps) {
  // Simulate the default folder structure as it would be created for a new tender
  const [defaultFolders, setDefaultFolders] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [documentDescription, setDocumentDescription] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");

  useEffect(() => {
    // Generate simulated folder structure - in real operation this will be created by the database trigger
    const originalFolder = {
      id: "original-folder",
      name: "01 Original",
      parentId: null,
      tenderId: "temp",
      folderOrder: 1,
      folderPath: "01 Original",
      isDefault: true,
      children: [
        {
          id: "dateien-angebot",
          name: "01 Dateien für Angebot",
          parentId: "original-folder",
          tenderId: "temp",
          folderOrder: 1,
          folderPath: "01 Original/01 Dateien für Angebot",
          isDefault: true,
          children: []
        },
        {
          id: "leistungsverzeichnis",
          name: "02 Leistungsverzeichnis",
          parentId: "original-folder",
          tenderId: "temp",
          folderOrder: 2,
          folderPath: "01 Original/02 Leistungsverzeichnis",
          isDefault: true,
          children: []
        },
        {
          id: "zusaetzliche-info",
          name: "03 Zusätzliche Informationen",
          parentId: "original-folder",
          tenderId: "temp",
          folderOrder: 3,
          folderPath: "01 Original/03 Zusätzliche Informationen",
          isDefault: true,
          children: []
        }
      ]
    };

    setDefaultFolders([originalFolder]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      
      const newNames = filesArray.map(file => file.name.split('.')[0]);
      setDocumentNames(newNames);
    }
  };
  
  const handleNameChange = (index: number, value: string) => {
    const newNames = [...documentNames];
    newNames[index] = value;
    setDocumentNames(newNames);
  };

  const handleFolderSelect = (folder: any) => {
    setSelectedFolderId(folder.id);
    setSelectedFolderName(folder.folderPath || folder.name);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Bitte wählen Sie mindestens eine Datei aus");
      return;
    }
    
    if (!selectedFolderId) {
      toast.error("Bitte wählen Sie einen Ordner aus");
      return;
    }
    
    const emptyNameIndex = documentNames.findIndex(name => !name.trim());
    if (emptyNameIndex !== -1) {
      toast.error(`Bitte geben Sie einen Namen für Dokument ${emptyNameIndex + 1} ein`);
      return;
    }
    
    onFileUpload(selectedFiles, documentNames, documentDescription, selectedFolderId);
    
    // Reset form after upload
    setSelectedFiles([]);
    setDocumentNames([]);
    setDocumentDescription("");
  };
  
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unbekannte Größe';
    
    if (bytes < 1024) return bytes + ' Bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Folder selection */}
        <div className="w-full md:w-1/3">
          <div className="space-y-2">
            <Label>Ordnerauswahl</Label>
            <div className="border rounded-md p-3 h-[300px] overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-2">
                Bitte wählen Sie einen Unterordner von "01 Original" aus:
              </p>
              {defaultFolders.length > 0 ? (
                <FolderTree
                  folders={defaultFolders}
                  onFolderSelect={handleFolderSelect}
                  selectedFolderId={selectedFolderId}
                  tenderId="temp"
                  readOnly={true}
                />
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-muted-foreground">Lädt Ordnerstruktur...</p>
                </div>
              )}
            </div>
            {selectedFolderName && (
              <p className="text-sm mt-2">
                Ausgewählter Ordner: <span className="font-medium">{selectedFolderName}</span>
              </p>
            )}
          </div>
        </div>

        {/* File upload */}
        <div className="w-full md:w-2/3">
          <div className="space-y-4">
            <Label>Dokumente hochladen</Label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                multiple
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
                
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-muted flex items-center justify-center rounded">
                        <File className="w-4 h-4" />
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
            
            <div className="space-y-2">
              <Label htmlFor="document-description">Beschreibung</Label>
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
            
            <div className="flex justify-end">
              <Button 
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0 || !selectedFolderId}
              >
                {isUploading ? "Wird hochgeladen..." : "Dateien vorbereiten"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
