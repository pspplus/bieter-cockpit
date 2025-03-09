
import { Layout } from "@/components/layout/Layout";
import { TenderCard } from "@/components/tender/TenderCard";
import { useTender } from "@/hooks/useTender";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TenderStatus } from "@/types/tender";

export default function SubmissionsPage() {
  const { tenders, isLoading } = useTender();

  // Helper function to check status
  const checkStatus = (status: TenderStatus, target: TenderStatus) => {
    if (status === target) return true;
    
    // Check aliases
    if (target === "abgegeben" && status === "submitted") return true;
    if (target === "aufklaerung" && status === "clarification") return true;
    if (target === "gewonnen" && status === "won") return true;
    if (target === "verloren" && status === "lost") return true;
    
    return false;
  };

  // Filter tenders by status
  const submittedTenders = tenders.filter(tender => 
    checkStatus(tender.status, "abgegeben")
  );
  
  const clarificationTenders = tenders.filter(tender => 
    checkStatus(tender.status, "aufklaerung")
  );
  
  const wonTenders = tenders.filter(tender => 
    checkStatus(tender.status, "gewonnen")
  );
  
  const lostTenders = tenders.filter(tender => 
    checkStatus(tender.status, "verloren")
  );

  const renderSkeletonCards = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <div key={i} className="border border-border rounded-lg p-4 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    ));
  };

  return (
    <Layout title="Einreichungen">
      <div className="space-y-6">
        <Tabs defaultValue="submitted">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:space-x-2">
            <TabsTrigger value="submitted">Abgegeben</TabsTrigger>
            <TabsTrigger value="clarification">Aufklärung</TabsTrigger>
            <TabsTrigger value="won">Gewonnen</TabsTrigger>
            <TabsTrigger value="lost">Verloren</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submitted" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                renderSkeletonCards(3)
              ) : submittedTenders.length > 0 ? (
                submittedTenders.map(tender => (
                  <TenderCard key={tender.id} tender={tender} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Keine abgegebenen Ausschreibungen vorhanden</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="clarification" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                renderSkeletonCards(3)
              ) : clarificationTenders.length > 0 ? (
                clarificationTenders.map(tender => (
                  <TenderCard key={tender.id} tender={tender} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Keine Ausschreibungen in Aufklärung vorhanden</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="won" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                renderSkeletonCards(3)
              ) : wonTenders.length > 0 ? (
                wonTenders.map(tender => (
                  <TenderCard key={tender.id} tender={tender} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Keine gewonnenen Ausschreibungen vorhanden</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="lost" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                renderSkeletonCards(3)
              ) : lostTenders.length > 0 ? (
                lostTenders.map(tender => (
                  <TenderCard key={tender.id} tender={tender} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Keine verlorenen Ausschreibungen vorhanden</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
