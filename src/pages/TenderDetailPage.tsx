
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

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [documents, setDocuments] = useState<TenderDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
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
        toast.error("Ausschreibung konnte nicht geladen werden");
      } finally {
        setIsLoading(false);
      }
    };

    loadTender();
  }, [id]);

  const handleDelete = async () => {
    if (!tender) return;
    
    try {
      await deleteTender(tender.id);
      toast.success("Ausschreibung erfolgreich gelöscht");
      navigate("/tenders");
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast.error("Ausschreibung konnte nicht gelöscht werden");
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
      <Layout title="Wird geladen...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!tender) {
    return (
      <Layout title="Nicht gefunden">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">Ausschreibung nicht gefunden</h2>
          <p className="text-muted-foreground mt-2">Diese Ausschreibung existiert möglicherweise nicht</p>
          <Button 
            onClick={() => navigate("/tenders")} 
            className="mt-4"
            variant="outline"
          >
            Zurück zu Ausschreibungen
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
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
                <TabsTrigger value="milestones">Meilensteine</TabsTrigger>
                <TabsTrigger value="edit">Bearbeiten</TabsTrigger>
              </TabsList>
            
              <TabsContent value="details" className="mt-4">
                <TenderDetails tender={tender} />
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
          
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            className="ml-2 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Löschen</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
