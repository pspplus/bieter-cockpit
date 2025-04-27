import React, { useEffect, useState } from 'react';
import { TenderDocument } from '@/types/tender';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, AlertCircle } from 'lucide-react';
import { getFileCategory, isViewableInBrowser } from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';

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
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileCategory = getFileCategory(fileDocument.fileType);
  
  useEffect(() => {
    const getFileUrl = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Extract the file path from the URL
        const url = new URL(fileDocument.fileUrl);
        const filePath = url.pathname.split('/').pop();
        
        if (!filePath) {
          throw new Error('Invalid file path');
        }
        
        console.log('Fetching document with path:', filePath);
        
        // Get a fresh public URL for the file
        // Note: getPublicUrl no longer returns an error property in newer Supabase versions
        const { data } = await supabase
          .storage
          .from('tender_documents')
          .getPublicUrl(filePath);
        
        console.log('Retrieved public URL:', data.publicUrl);
        setFileUrl(data.publicUrl);
      } catch (err: any) {
        console.error('Error loading document:', err);
        setError(err.message || 'Could not load document');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen && fileDocument) {
      getFileUrl();
    }
  }, [isOpen, fileDocument]);
  
  const openInExcel = (url: string) => {
    const encodedUrl = encodeURIComponent(url);
    const excelWebAppUrl = `https://excel.officeapps.live.com/x/_layouts/workbench.aspx?WOPISrc=${encodedUrl}`;
    window.open(excelWebAppUrl, '_blank');
  };

  const downloadDocument = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      window.open(fileDocument.fileUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="animate-pulse text-center">
          <p>Dokument wird geladen...</p>
        </div>
      </div>
    );
  }
  
  if (error || !fileUrl) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Fehler beim Laden des Dokuments</h3>
        <p className="text-sm text-gray-500 mb-4">{error || 'Dokument konnte nicht geladen werden'}</p>
        <Button onClick={downloadDocument}>
          <Download className="mr-2 h-4 w-4" />
          Download versuchen
        </Button>
      </div>
    );
  }

  const renderContent = () => {
    switch (fileCategory) {
      case 'pdf':
        return (
          <iframe 
            src={fileUrl}
            className="w-full h-[60vh]"
            title={fileDocument.name}
          />
        );
      case 'image':
        return (
          <div className="flex items-center justify-center max-h-[60vh]">
            <img 
              src={fileUrl} 
              alt={fileDocument.name} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      case 'video':
        return (
          <video 
            src={fileUrl} 
            controls 
            className="w-full max-h-[60vh]"
          >
            Ihr Browser unterstützt das Video-Tag nicht.
          </video>
        );
      case 'audio':
        return (
          <audio 
            src={fileUrl} 
            controls 
            className="w-full mt-4"
          >
            Ihr Browser unterstützt das Audio-Tag nicht.
          </audio>
        );
      case 'spreadsheet':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-center">Für die beste Bearbeitungserfahrung öffnen Sie die Excel-Datei direkt in Microsoft 365.</p>
            <div className="flex gap-4">
              <Button
                onClick={() => openInExcel(fileUrl)}
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                In Excel öffnen
              </Button>
              <Button
                variant="outline"
                onClick={downloadDocument}
              >
                <Download className="mr-2 h-4 w-4" />
                Herunterladen
              </Button>
            </div>
          </div>
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
