
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { TenderDetails } from "@/components/tender/TenderDetails";
import { TenderEditForm } from "@/components/tender/TenderEditForm";
import { MilestonesList } from "@/components/tender/MilestonesList";
import { useTender } from "@/context/TenderContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TenderDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { loadTender, activeTender } = useTender();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (id) {
      loadTender(id);
    }
  }, [id, loadTender]);
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  if (!activeTender) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold mb-4">{t('tenders.tenderNotFound')}</h1>
          <p className="text-tender-500 mb-6">
            {t('tenders.tenderNotFoundDescription')}
          </p>
          <Button onClick={() => navigate("/tenders")}>
            {t('tenders.backToTenders')}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={activeTender.title}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => navigate("/tenders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('tenders.backToTenders')}
          </Button>
          
          {!isEditing && (
            <Button onClick={toggleEdit} className="self-end">
              <Edit className="h-4 w-4 mr-2" />
              {t('tenders.editTender')}
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <TenderEditForm 
            tender={activeTender} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="milestones">{t('tabs.milestones')}</TabsTrigger>
              <TabsTrigger value="documents">{t('tabs.documents')}</TabsTrigger>
              <TabsTrigger value="notes">{t('tabs.notes')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in">
              <TenderDetails tender={activeTender} />
            </TabsContent>
            
            <TabsContent value="milestones" className="animate-fade-in">
              <MilestonesList tender={activeTender} />
            </TabsContent>
            
            <TabsContent value="documents" className="animate-fade-in">
              <div className="rounded-lg border border-tender-100 p-8 text-center">
                <h3 className="text-lg font-medium mb-2">{t('tabs.documentManagement')}</h3>
                <p className="text-tender-500 mb-4">{t('tabs.documentDescription')}</p>
                <Button>{t('tabs.uploadDocuments')}</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="animate-fade-in">
              <div className="rounded-lg border border-tender-100 p-8 text-center">
                <h3 className="text-lg font-medium mb-2">{t('tabs.tenderNotes')}</h3>
                <p className="text-tender-500 mb-4">{t('tabs.notesDescription')}</p>
                <Button>{t('tabs.addNotes')}</Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
