
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { TenderDetails } from "@/components/tender/TenderDetails";
import { DocumentList } from "@/components/document/DocumentList";
import { DocumentViewer } from "@/components/document/DocumentViewer";
import { fetchTenderById, deleteTender, updateTender } from "@/services/tenderService";
import { fetchTenderDocuments, isViewableInBrowser } from "@/services/documentService";
import { fetchFolders } from "@/services/folderService";
import { Tender, TenderDocument, Folder, TenderStatus } from "@/types/tender";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Trash2, X, PencilLine } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TenderDetailsEditForm } from "@/components/tender/TenderDetailsEditForm";
import { TenderContactEditForm } from "@/components/tender/TenderContactEditForm";
import { Badge } from "@/components/ui/badge";
import { statusDisplayMap, statusColors } from "@/utils/statusUtils";
import { useTender } from "@/hooks/useTender";
import { MilestoneProcess } from "@/components/tender/MilestoneProcess";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [documents, setDocuments] = useState<TenderDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TenderDocument | null>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updateTender: contextUpdateTender } = useTender();

  useEffect(() => {
    const loadTender = async () => {
      try {
        if (!id) return;
        const tenderData = await fetchTenderById(id);
        setTender(tenderData);

        const docsData = await fetchTenderDocuments(id);
        setDocuments(docsData);

        const foldersData = await fetchFolders(id);
        setFolders(foldersData);
      } catch (error) {
        console.error("Error loading tender:", error);
        toast.error(t("errorMessages.couldNotLoadTenders"));
      } finally {
        setIsLoading(false);
      }
    };

    loadTender();
  }, [id, t]);

  const handleDelete = async () => {
    if (!tender) return;
    
    try {
      await deleteTender(tender.id);
      toast.success(t("notifications.tenderDeleted"));
      navigate("/tenders");
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast.error(t("errorMessages.couldNotDeleteTender"));
    }
  };

  const handleDocumentAdded = (document: TenderDocument) => {
    setDocuments(prev => [document, ...prev]);
  };

  const handleDocumentDeleted = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handlePreviewDocument = (document: TenderDocument) => {
    setSelectedDocument(document);
    
    const canViewInBrowser = isViewableInBrowser(document.fileType);
    
    if (canViewInBrowser) {
      setDocumentViewerOpen(true);
    } else {
      window.open(document.fileUrl, '_blank');
    }
  };

  const handleTenderUpdate = async (updates: Partial<Tender>) => {
    if (!tender) return;
    
    try {
      await updateTender(tender.id, updates);
      setTender(prev => prev ? { ...prev, ...updates } : null);
      toast.success(t("notifications.tenderUpdated", "Ausschreibung aktualisiert"));
    } catch (error) {
      console.error("Error updating tender:", error);
      toast.error(t("errorMessages.couldNotUpdateTender", "Fehler beim Aktualisieren der Ausschreibung"));
    }
  };

  const handleStatusChange = async (newStatus: TenderStatus) => {
    if (!tender || !id) return;
    
    setIsUpdatingStatus(true);
    try {
      await contextUpdateTender(id, { status: newStatus });
      setTender(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(t("notifications.statusUpdated", "Status aktualisiert"));
      setStatusPopoverOpen(false);
    } catch (error) {
      console.error("Error updating tender status:", error);
      toast.error(t("errorMessages.couldNotUpdateStatus", "Fehler beim Aktualisieren des Status"));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title={t("loading")}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!tender) {
    return (
      <Layout title={t("tenderDetails.notFound")}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">{t("tenderDetails.tenderNotFound")}</h2>
          <p className="text-muted-foreground mt-2">{t("tenderDetails.tenderMayNotExist")}</p>
          <Button 
            onClick={() => navigate("/tenders")} 
            className="mt-4"
            variant="outline"
          >
            {t("backToTenders")}
          </Button>
        </div>
      </Layout>
    );
  }

  const { bg, text } = statusColors[tender.status];

  return (
    <Layout title={tender.title}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="details">{t("tenderDetails.details")}</TabsTrigger>
                  <TabsTrigger value="documents">{t("tenderDetails.documents")}</TabsTrigger>
                </TabsList>
                <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={`cursor-pointer ml-4 flex items-center gap-1 ${bg} ${text}`}
                    >
                      {statusDisplayMap[tender.status]}
                      <PencilLine className="h-3 w-3" />
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        {t("tender.changeStatus", "Status ändern")}
                      </h4>
                      <Select
                        value={tender.status}
                        onValueChange={(value) => handleStatusChange(value as TenderStatus)}
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("tender.selectStatus", "Status auswählen")} />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusDisplayMap).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            
              <TabsContent value="details" className="mt-4">
                <div className="flex justify-between">
                  <div className="flex-grow">
                    <TenderDetails 
                      tender={tender} 
                      onOpenDetailsDialog={() => setDetailsDialogOpen(true)} 
                      onOpenContactDialog={() => setContactDialogOpen(true)} 
                    />

                    {tender.milestones.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">{t("milestones.title", "Meilensteine")}</h3>
                        <MilestoneProcess milestones={tender.milestones} tenderId={tender.id} />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="ml-2 flex-shrink-0 h-10"
                    aria-label={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t("delete")}</span>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <DocumentList 
                  documents={documents}
                  tenderId={tender.id}
                  folders={folders}
                  onDocumentAdded={handleDocumentAdded}
                  onDocumentDeleted={handleDocumentDeleted}
                  onPreviewDocument={handlePreviewDocument}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmation.title", "Ausschreibung löschen")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmation.description", "Sind Sie sicher, dass Sie diese Ausschreibung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel", "Abbrechen")}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("deleteConfirmation.confirm", "Ausschreibung löschen")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("tenderDetails.editDetails", "Ausschreibungsdetails bearbeiten")}</DialogTitle>
            <DialogDescription>
              {t("tenderDetails.editDetailsDescription", "Aktualisieren Sie die grundlegenden Informationen dieser Ausschreibung.")}
            </DialogDescription>
          </DialogHeader>
          <TenderDetailsEditForm 
            tender={tender} 
            onSubmit={(updates) => {
              handleTenderUpdate(updates);
              setDetailsDialogOpen(false);
            }}
            onCancel={() => setDetailsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("tenderDetails.editContact", "Kontaktinformationen bearbeiten")}</DialogTitle>
            <DialogDescription>
              {t("tenderDetails.editContactDescription", "Aktualisieren Sie die Kontaktinformationen dieser Ausschreibung.")}
            </DialogDescription>
          </DialogHeader>
          <TenderContactEditForm 
            tender={tender} 
            onSubmit={(updates) => {
              handleTenderUpdate(updates);
              setContactDialogOpen(false);
            }}
            onCancel={() => setContactDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={documentViewerOpen} onOpenChange={setDocumentViewerOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="pr-8">
                {selectedDocument?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedDocument?.description}
              </DialogDescription>
            </div>
            <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <X className="h-4 w-4" />
              <span className="sr-only">Schließen</span>
            </DialogClose>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {selectedDocument && (
              <DocumentViewer 
                document={selectedDocument}
                isOpen={documentViewerOpen}
                onClose={() => setDocumentViewerOpen(false)}
              />
            )}
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDocumentViewerOpen(false)}>
              Schließen
            </Button>
            {selectedDocument && (
              <Button 
                variant="default"
                onClick={() => {
                  if (selectedDocument) {
                    window.open(selectedDocument.fileUrl, '_blank');
                  }
                }}
              >
                Herunterladen
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
