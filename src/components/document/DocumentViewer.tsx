
import React, { useEffect, useState } from 'react';
import { TenderDocument } from '@/types/tender';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Eye, AlertCircle } from 'lucide-react';
import { getFileCategory, isViewableInBrowser } from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';

interface DocumentViewerProps {
  document: TenderDocument;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
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
        const url = new URL(fileDocument.fileUrl);
        const filePath = url.pathname.split('/').pop();
        
        if (!filePath) {
          throw new Error('Invalid file path');
        }
        
        console.log('Fetching document with path:', filePath);
        
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
  
  const getExcelOnlineUrl = (url: string, mode: 'view' | 'edit'): string => {
    const encodedUrl = encodeURIComponent(url);
    if (mode === 'edit') {
      return `https://www.office.com/launch/excel/copy?url=${encodedUrl}`;
    }
    return `https://excel.officeapps.live.com/x/_layouts/xlviewerinternal.aspx?ui=de-DE&rs=de-DE&WOPISrc=${encodedUrl}`;
  };

  const downloadDocument = () => {
    if (fileUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.href = fileUrl;
      downloadLink.download = fileDocument.name;
      downloadLink.click();
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
            <p className="text-center mb-2">Excel-Datei Optionen:</p>
            <div className="flex flex-col gap-4 w-full max-w-md">
              <Button
                onClick={() => window.open(getExcelOnlineUrl(fileUrl!, 'edit'), '_blank')}
                className="flex items-center justify-center w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                In Microsoft 365 bearbeiten
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(getExcelOnlineUrl(fileUrl!, 'view'), '_blank')}
                className="flex items-center justify-center w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                In Excel anzeigen
              </Button>
              <Button
                variant="outline"
                onClick={downloadDocument}
                className="flex items-center justify-center w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Herunterladen
              </Button>
              <p className="text-sm text-gray-500 text-center mt-2">
                Hinweis: Zum Bearbeiten wird Ihre Microsoft 365 Business Premium Lizenz verwendet.
              </p>
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

export default DocumentViewer;
