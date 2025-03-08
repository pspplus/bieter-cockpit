
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { TenderDetails } from "@/components/tender/TenderDetails";
import { MilestonesList } from "@/components/tender/MilestonesList";
import { useTender } from "@/context/TenderContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { loadTender, activeTender } = useTender();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      loadTender(id);
    }
  }, [id, loadTender]);
  
  if (!activeTender) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold mb-4">Tender Not Found</h1>
          <p className="text-tender-500 mb-6">
            The tender you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/tenders")}>
            Back to Tenders
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={activeTender.title}>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/tenders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tenders
        </Button>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            <TenderDetails tender={activeTender} />
          </TabsContent>
          
          <TabsContent value="milestones" className="animate-fade-in">
            <MilestonesList tender={activeTender} />
          </TabsContent>
          
          <TabsContent value="documents" className="animate-fade-in">
            <div className="rounded-lg border border-tender-100 p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Document Management</h3>
              <p className="text-tender-500 mb-4">Upload and manage all tender-related documents here.</p>
              <Button>Upload Documents</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="animate-fade-in">
            <div className="rounded-lg border border-tender-100 p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Tender Notes</h3>
              <p className="text-tender-500 mb-4">Add important notes and comments about this tender.</p>
              <Button>Add Notes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
