
import React from 'react';
import { TenderDocument } from '@/types/tender';
import { Button } from '@/components/ui/button';
import { Trash2, Download, Eye, FileText, FileImage, FilePdf, FileArchive } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export interface DocumentListProps {
  documents: TenderDocument[];
  onDelete?: (documentId: string) => void;
  readOnly?: boolean;
}

export function DocumentList({ documents, onDelete, readOnly = false }: DocumentListProps) {
  const [previewDoc, setPreviewDoc] = React.useState<TenderDocument | null>(null);
  const [deleteDoc, setDeleteDoc] = React.useState<TenderDocument | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FileImage className="h-5 w-5" />;
    if (mimeType === 'application/pdf') return <FilePdf className="h-5 w-5" />;
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return <FileArchive className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const handlePreview = (doc: TenderDocument) => {
    setPreviewDoc(doc);
  };

  const handleConfirmDelete = () => {
    if (deleteDoc && onDelete) {
      onDelete(deleteDoc.id);
      setShowDeleteAlert(false);
      setDeleteDoc(null);
      toast.success("Dokument erfolgreich gelöscht");
    }
  };

  const initiateDelete = (doc: TenderDocument, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDoc(doc);
    setShowDeleteAlert(true);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Keine Dokumente vorhanden
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {documents.map((doc) => (
            <Card 
              key={doc.id} 
              className="hover:bg-secondary/50 transition-colors"
              onClick={() => handlePreview(doc)}
            >
              <CardContent className="p-3 flex justify-between items-center cursor-pointer">
                <div className="flex items-center space-x-3">
                  {getFileIcon(doc.mimeType)}
                  <div>
                    <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                      {doc.fileName}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                      <span>{formatBytes(doc.fileSize)}</span>
                      <span>•</span>
                      <span>{format(new Date(doc.uploadDate), 'dd.MM.yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(doc.url, '_blank');
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Download logic
                      const a = document.createElement('a');
                      a.href = doc.url;
                      a.download = doc.fileName;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {!readOnly && onDelete && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => initiateDelete(doc, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={previewDoc !== null}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">{previewDoc?.fileName}</DialogTitle>
          </DialogHeader>
          <div className="p-3 max-h-[70vh] overflow-auto">
            {previewDoc?.mimeType.startsWith('image/') ? (
              <img 
                src={previewDoc.url} 
                alt={previewDoc.fileName} 
                className="w-full h-auto rounded-md"
              />
            ) : previewDoc?.mimeType === 'application/pdf' ? (
              <iframe 
                src={`${previewDoc.url}#toolbar=0`} 
                title={previewDoc.fileName}
                className="w-full h-[70vh] rounded-md"
              />
            ) : (
              <div className="text-center p-10">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="mb-4">Vorschau ist nicht verfügbar für diesen Dateityp.</p>
                <Button asChild>
                  <a href={previewDoc?.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Datei herunterladen
                  </a>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dokument löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie dieses Dokument löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDoc(null)}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
