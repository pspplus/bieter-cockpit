
import React, { useState, useEffect, useRef } from 'react';
import { TenderDocument } from '@/types/tender';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { isViewableInBrowser } from '@/services/documentService';

interface DocumentViewerProps {
  document: TenderDocument;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document: fileDocument, isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isPDF = fileDocument.fileType === 'application/pdf';
  const isImage = fileDocument.fileType.startsWith('image/');
  const isVideo = fileDocument.fileType.startsWith('video/');
  const isViewable = isViewableInBrowser(fileDocument.fileType);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!window.document.fullscreenElement);
    };

    window.document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      window.document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen().catch(err => {
        toast.error("Fehler beim Aktivieren des Vollbildmodus");
        console.error(err);
      });
    } else {
      if (window.document.exitFullscreen) {
        window.document.exitFullscreen().catch(err => {
          console.error(err);
        });
      }
    }
  };

  const downloadDocument = () => {
    const link = window.document.createElement('a');
    link.href = fileDocument.fileUrl;
    link.download = fileDocument.name;
    link.click();
  };

  // Render different content based on file type
  const renderDocumentContent = () => {
    if (!isViewable) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-lg mb-4">Dieser Dokumenttyp kann nicht direkt angezeigt werden.</p>
          <Button onClick={downloadDocument}>
            <Download className="mr-2 h-4 w-4" />
            Herunterladen
          </Button>
        </div>
      );
    }

    if (isPDF) {
      return (
        <iframe 
          ref={iframeRef}
          src={`${fileDocument.fileUrl}#toolbar=0`} 
          className="w-full h-full border-0"
          title={fileDocument.name}
        />
      );
    }

    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full overflow-auto">
          <img 
            src={fileDocument.fileUrl} 
            alt={fileDocument.name} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex items-center justify-center h-full">
          <video 
            src={fileDocument.fileUrl} 
            controls 
            className="max-w-full max-h-full"
          >
            Ihr Browser unterstützt das Video-Tag nicht.
          </video>
        </div>
      );
    }

    // Default iframe viewer for other viewable documents
    return (
      <iframe 
        ref={iframeRef}
        src={fileDocument.fileUrl} 
        className="w-full h-full border-0"
        title={fileDocument.name}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg truncate max-w-[calc(100%-100px)]">
              {fileDocument.name}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} title={isFullscreen ? "Vollbild beenden" : "Vollbild"}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={downloadDocument} title="Herunterladen">
                <Download className="h-4 w-4" />
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" title="Schließen">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>
        
        <div 
          ref={containerRef} 
          className="flex-1 overflow-auto bg-muted"
        >
          {renderDocumentContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
