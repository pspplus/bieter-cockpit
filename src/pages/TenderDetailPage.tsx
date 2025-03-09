
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { TenderDetails } from "@/components/tender/TenderDetails";
import { MilestonesList } from "@/components/tender/MilestonesList";
import { TenderEditForm } from "@/components/tender/TenderEditForm";
import { DocumentList } from "@/components/document/DocumentList";
import { fetchTenderById, deleteTender } from "@/services/tenderService";
import { fetchTenderDocuments } from "@/services/documentService";
import { fetchFolders } from "@/services/folderService";
import { Tender, TenderDocument, Folder } from "@/types/tender";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
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

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [documents, setDocuments] = useState<TenderDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const loadTender = async () => {
      try {
        if (!id) return;
        const tenderData = await fetchTenderById(id);
        setTender(tenderData);

        // Load documents
        const docsData = await fetchTenderDocuments(id);
        setDocuments(docsData);

        // Load folders separately to ensure they're available
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
              <TabsList>
                <TabsTrigger value="details">{t("tenderDetails.details")}</TabsTrigger>
                <TabsTrigger value="documents">{t("tenderDetails.documents")}</TabsTrigger>
                <TabsTrigger value="milestones">{t("tenderDetails.milestones")}</TabsTrigger>
                <TabsTrigger value="edit">{t("tenderDetails.edit")}</TabsTrigger>
              </TabsList>
            
              <TabsContent value="details" className="mt-4">
                <div className="flex justify-between">
                  <div className="flex-grow">
                    <TenderDetails tender={tender} />
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
                />
              </TabsContent>
              
              <TabsContent value="milestones" className="mt-4">
                <MilestonesList tender={tender} />
              </TabsContent>
              
              <TabsContent value="edit" className="mt-4">
                <TenderEditForm tender={tender} onCancel={() => setActiveTab("details")} />
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
    </Layout>
  );
}
