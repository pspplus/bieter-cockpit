
import React from 'react';
import { TenderDocument } from '@/types/tender';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { getFileCategory } from '@/services/documentService';

interface DocumentViewerProps {
  document: TenderDocument;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  document: fileDocument,
  isOpen,
  onClose
}) => {
  const fileCategory = getFileCategory(fileDocument.fileType);
  
  const downloadDocument = () => {
    window.open(fileDocument.fileUrl, '_blank');
  };

  // Render different content based on file type
  const renderContent = () => {
    switch (fileCategory) {
      case 'pdf':
        return (
          <iframe 
            src={fileDocument.fileUrl}
            className="w-full h-[60vh]"
            title={fileDocument.name}
          />
        );
      case 'image':
        return (
          <div className="flex items-center justify-center max-h-[60vh]">
            <img 
              src={fileDocument.fileUrl} 
              alt={fileDocument.name} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      case 'video':
        return (
          <video 
            src={fileDocument.fileUrl} 
            controls 
            className="w-full max-h-[60vh]"
          >
            Ihr Browser unterstützt das Video-Tag nicht.
          </video>
        );
      case 'audio':
        return (
          <audio 
            src={fileDocument.fileUrl} 
            controls 
            className="w-full mt-4"
          >
            Ihr Browser unterstützt das Audio-Tag nicht.
          </audio>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="mb-4 text-center">Diese Datei kann nicht im Browser angezeigt werden.</p>
            <Button onClick={downloadDocument}>
              <Download className="mr-2 h-4 w-4" />
              Datei herunterladen
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};
