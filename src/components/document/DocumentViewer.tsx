
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, ZoomIn, ZoomOut, RotateCw, Download, X } from "lucide-react";
import { getFileCategory } from "@/services/documentService";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface DocumentViewerProps {
  document: {
    id: string;
    name: string;
    fileUrl: string;
    fileType: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when document changes
    if (document) {
      setZoom(1);
      setRotation(0);
      setPageNumber(1);
      setLoading(true);
      setError(null);
    }
  }, [document]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!document) return null;

  const handleFullscreen = () => {
    const viewer = document.getElementById('document-viewer');
    if (!viewer) return;

    if (!isFullscreen) {
      if (viewer.requestFullscreen) {
        viewer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handlePrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => {
    if (numPages !== null) {
      setPageNumber((prev) => Math.min(prev + 1, numPages));
    }
  };

  const fileCategory = document ? getFileCategory(document.fileType) : 'other';

  const renderContent = () => {
    if (loading && fileCategory === 'pdf') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-destructive text-xl mb-4">Fehler beim Laden des Dokuments</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" asChild>
            <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" download>
              <Download className="mr-2 h-4 w-4" /> Herunterladen
            </a>
          </Button>
        </div>
      );
    }

    switch (fileCategory) {
      case 'image':
        return (
          <div className="flex items-center justify-center h-full">
            <img
              src={document.fileUrl}
              alt={document.name}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError('Bild konnte nicht geladen werden');
              }}
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="flex flex-col items-center">
            <Document
              file={document.fileUrl}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setLoading(false);
              }}
              onLoadError={(error) => {
                console.error('Error loading PDF:', error);
                setLoading(false);
                setError('PDF konnte nicht geladen werden');
              }}
            >
              <Page
                pageNumber={pageNumber}
                scale={zoom}
                rotate={rotation}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
            
            {numPages && numPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Button
                  onClick={handlePrevPage}
                  disabled={pageNumber <= 1}
                  variant="outline"
                  size="sm"
                >
                  Vorherige
                </Button>
                <span className="text-sm">
                  Seite {pageNumber} von {numPages}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={pageNumber >= numPages}
                  variant="outline"
                  size="sm"
                >
                  Nächste
                </Button>
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="flex items-center justify-center h-full">
            <video
              controls
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
              onLoadedData={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError('Video konnte nicht geladen werden');
              }}
            >
              <source src={document.fileUrl} type={document.fileType} />
              Ihr Browser unterstützt dieses Videoformat nicht.
            </video>
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex items-center justify-center h-full">
            <audio
              controls
              onLoadedData={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError('Audio konnte nicht geladen werden');
              }}
            >
              <source src={document.fileUrl} type={document.fileType} />
              Ihr Browser unterstützt dieses Audioformat nicht.
            </audio>
          </div>
        );
      
      default:
        setLoading(false);
        return (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground mb-4">
              Vorschau nicht verfügbar für Dateityp: {document.fileType}
            </p>
            <Button variant="outline" asChild>
              <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="mr-2 h-4 w-4" /> Herunterladen
              </a>
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[90vw]" id="document-viewer">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="truncate max-w-[70%]">{document.name}</DialogTitle>
          <div className="flex items-center space-x-2">
            {(fileCategory === 'image' || fileCategory === 'pdf') && (
              <>
                <Button variant="outline" size="icon" onClick={handleZoomIn} title="Vergrößern">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut} title="Verkleinern">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleRotate} title="Drehen">
                  <RotateCw className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="outline" size="icon" onClick={handleFullscreen} title="Vollbild ein/aus">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" asChild title="Herunterladen">
              <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} title="Schließen">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="min-h-[50vh] flex items-center justify-center overflow-auto relative">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
