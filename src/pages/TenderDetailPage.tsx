
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
import { Tender, TenderDocument } from "@/types/tender";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [documents, setDocuments] = useState<TenderDocument[]>([]);
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
      } catch (error) {
        console.error("Error loading tender:", error);
        toast.error(t('errorMessages.couldNotLoadTender'));
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
      toast.success(t('notifications.tenderDeleted'));
      navigate("/tenders");
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast.error(t('errorMessages.couldNotDeleteTender'));
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
      <Layout title={t('tenderDetails.loading')}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!tender) {
    return (
      <Layout title={t('tenderDetails.notFound')}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">{t('tenderDetails.tenderNotFound')}</h2>
          <p className="text-muted-foreground mt-2">{t('tenderDetails.tenderMayNotExist')}</p>
          <Button 
            onClick={() => navigate("/tenders")} 
            className="mt-4"
            variant="outline"
          >
            {t('general.backToTenders')}
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
                <TabsTrigger value="details">{t('tenderDetails.details')}</TabsTrigger>
                <TabsTrigger value="documents">{t('tenderDetails.documents')}</TabsTrigger>
                <TabsTrigger value="milestones">{t('tenderDetails.milestones')}</TabsTrigger>
                <TabsTrigger value="edit">{t('tenderDetails.edit')}</TabsTrigger>
              </TabsList>
            
              <TabsContent value="details" className="mt-4">
                <TenderDetails tender={tender} />
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <DocumentList 
                  documents={documents}
                  tenderId={tender.id}
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
            <span className="sr-only">{t('tenderDetails.delete')}</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
