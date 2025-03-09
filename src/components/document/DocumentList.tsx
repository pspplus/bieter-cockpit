
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatFileSize } from "@/lib/utils";
import { TenderDocument } from "@/types/tender";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface DocumentListProps {
  documents: TenderDocument[];
  readOnly?: boolean;
  onDelete?: (documentId: string) => void;
}

export function DocumentList({ documents, readOnly = false, onDelete }: DocumentListProps) {
  const { t } = useTranslation();
  
  const handleDownload = (document: TenderDocument) => {
    // Hier würde normalerweise der Download-Code stehen
    console.log("Downloading document:", document.name);
  };
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-muted-foreground">{t('documents.noDocuments')}</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4 font-medium">{t('documents.name')}</th>
            <th className="text-left py-2 px-4 font-medium">{t('documents.type')}</th>
            <th className="text-left py-2 px-4 font-medium">{t('documents.size')}</th>
            <th className="text-left py-2 px-4 font-medium">{t('documents.uploadDate')}</th>
            {!readOnly && (
              <th className="text-right py-2 px-4 font-medium">{t('documents.actions')}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b hover:bg-muted/50">
              <td className="py-2 px-4">{doc.name}</td>
              <td className="py-2 px-4">{doc.type}</td>
              <td className="py-2 px-4">{formatFileSize(doc.size)}</td>
              <td className="py-2 px-4">
                {doc.uploadedAt instanceof Date
                  ? doc.uploadedAt.toLocaleDateString()
                  : new Date(doc.uploadedAt).toLocaleDateString()}
              </td>
              {!readOnly && (
                <td className="py-2 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(doc)}
                      title={t('documents.download')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {onDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t('documents.delete')}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('documents.deleteDocument')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('documents.deleteDocumentConfirmation')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('general.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(doc.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {t('documents.delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
