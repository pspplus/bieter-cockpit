
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { fetchTenderById } from "@/services/tenderService";
import { fetchTenderDocuments, isViewableInBrowser } from "@/services/documentService";
import { fetchFolders } from "@/services/folderService";
import { Tender, TenderDocument, Folder, TenderStatus } from "@/types/tender";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { TenderDetailsEditForm } from "@/components/tender/TenderDetailsEditForm";
import { TenderContactEditForm } from "@/components/tender/TenderContactEditForm";
import { useTender } from "@/hooks/useTender";
import { TenderDetailsTab } from "@/components/tender/detail/TenderDetailsTab";
import { DocumentsTab } from "@/components/tender/detail/DocumentsTab";
import { AIAnalysisTab } from "@/components/tender/detail/AIAnalysisTab";
import { TenderDocumentViewerDialog } from "@/components/tender/detail/TenderDocumentViewerDialog";
import { DeleteTenderDialog } from "@/components/tender/detail/DeleteTenderDialog";
import { DocumentAIAnalysis } from "@/components/document/DocumentAIAnalysis";

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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updateTender: contextUpdateTender, deleteTender: contextDeleteTender } = useTender();

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
    if (!tender || !id) return;
    
    try {
      await contextDeleteTender(id);
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
    setDocumentViewerOpen(true);
  };

  const handleTenderUpdate = async (updates: Partial<Tender>) => {
    if (!tender) return;
    
    try {
      await contextUpdateTender(tender.id, updates);
      setTender(prev => prev ? { ...prev, ...updates } : null);
      toast.success(t("notifications.tenderUpdated", "Ausschreibung aktualisiert"));
    } catch (error) {
      console.error("Error updating tender:", error);
      toast.error(t("errorMessages.couldNotUpdateTender", "Fehler beim Aktualisieren der Ausschreibung"));
    }
  };

  const handleAIAnalysisComplete = async (analysisResult: string) => {
    if (!tender || !id) return;
    
    // Update the tender notes with the AI analysis result
    try {
      // Combine existing notes with the analysis result
      const updatedNotes = tender.notes 
        ? `${tender.notes}\n\n--- KI-ANALYSE (${new Date().toLocaleDateString()}) ---\n${analysisResult}`
        : `--- KI-ANALYSE (${new Date().toLocaleDateString()}) ---\n${analysisResult}`;
      
      // Update the tender
      await handleTenderUpdate({ notes: updatedNotes });
      toast.success(t("AI.analysisAddedToNotes", "KI-Analyse wurde zu den Notizen hinzugefügt"));
    } catch (error) {
      console.error("Error updating tender with AI analysis:", error);
      toast.error(t("errorMessages.couldNotUpdateTender"));
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
                  <TabsTrigger value="ai-analysis">KI-Analyse</TabsTrigger>
                </TabsList>
              </div>
            
              <TabsContent value="details" className="mt-4">
                <TenderDetailsTab 
                  tender={tender}
                  onOpenDetailsDialog={() => setDetailsDialogOpen(true)}
                  onOpenContactDialog={() => setContactDialogOpen(true)}
                  onDeleteClick={() => setDeleteDialogOpen(true)}
                />
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <DocumentsTab 
                  documents={documents}
                  tenderId={tender.id}
                  folders={folders}
                  onDocumentAdded={handleDocumentAdded}
                  onDocumentDeleted={handleDocumentDeleted}
                  onPreviewDocument={handlePreviewDocument}
                />
              </TabsContent>

              <TabsContent value="ai-analysis" className="mt-4">
                <AIAnalysisTab 
                  tenderId={tender.id}
                  folders={folders}
                  onAnalysisComplete={handleAIAnalysisComplete}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <DeleteTenderDialog 
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("tenderDetails.editDetails")}</DialogTitle>
            <DialogDescription>
              {t("tenderDetails.editDetailsDescription")}
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
            <DialogTitle>{t("tenderDetails.editContact")}</DialogTitle>
            <DialogDescription>
              {t("tenderDetails.editContactDescription")}
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

      <TenderDocumentViewerDialog 
        isOpen={documentViewerOpen}
        onClose={() => setDocumentViewerOpen(false)}
        document={selectedDocument}
      />
    </Layout>
  );
}
