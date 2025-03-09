
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { TenderDetails } from "@/components/tender/TenderDetails";
import { MilestonesList } from "@/components/tender/MilestonesList";
import { TenderEditForm } from "@/components/tender/TenderEditForm";
import { fetchTenderById, deleteTender } from "@/services/tenderService";
import { Tender } from "@/types/tender";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const loadTender = async () => {
      try {
        if (!id) return;
        const tenderData = await fetchTenderById(id);
        setTender(tenderData);
      } catch (error) {
        console.error("Error loading tender:", error);
        toast({
          title: t('errorMessages.loadFailed'),
          description: t('errorMessages.couldNotLoadTender'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTender();
  }, [id, toast, t]);

  const handleDelete = async () => {
    if (!tender) return;
    
    try {
      await deleteTender(tender.id);
      toast({
        title: t('notifications.deleted'),
        description: t('notifications.tenderDeleted'),
      });
      navigate("/tenders");
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast({
        title: t('errorMessages.deleteFailed'),
        description: t('errorMessages.couldNotDeleteTender'),
        variant: "destructive",
      });
    }
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="details">{t('tenderDetails.details')}</TabsTrigger>
              <TabsTrigger value="milestones">{t('tenderDetails.milestones')}</TabsTrigger>
              <TabsTrigger value="edit">{t('tenderDetails.edit')}</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            className="ml-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t('tenderDetails.delete')}</span>
          </Button>
        </div>

        <TabsContent value="details" className="mt-0">
          <TenderDetails tender={tender} />
        </TabsContent>
        
        <TabsContent value="milestones" className="mt-0">
          <MilestonesList tender={tender} />
        </TabsContent>

        <TabsContent value="edit" className="mt-0">
          <TenderEditForm tender={tender} onCancel={() => setActiveTab("details")} />
        </TabsContent>
      </div>
    </Layout>
  );
}
