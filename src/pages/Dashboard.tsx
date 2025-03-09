
import { Layout } from "@/components/layout/Layout";
import { TenderCard } from "@/components/tender/TenderCard";
import { useTender } from "@/hooks/useTender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { TenderStatus } from "@/types/tender";

export default function Dashboard() {
  const { tenders, isLoading } = useTender();
  const navigate = useNavigate();

  // Helper function to check status
  const checkStatus = (status: TenderStatus, target: TenderStatus) => {
    if (status === target) return true;
    
    // Check aliases
    if (target === "in-bearbeitung" && status === "active") return true;
    if (target === "entwurf" && status === "draft") return true;
    if (target === "gewonnen" && status === "won") return true;
    
    return false;
  };

  const activeTenders = tenders.filter(tender => 
    checkStatus(tender.status, "in-bearbeitung")
  );
  
  const draftTenders = tenders.filter(tender => 
    checkStatus(tender.status, "entwurf")
  );
  
  const recentlyUpdatedTenders = [...tenders]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  const wonTenders = tenders.filter(tender => 
    checkStatus(tender.status, "gewonnen")
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
    <Layout title="Dashboard">
      <div className="grid gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Willkommen in Ihrem Bieter Cockpit</h1>
            <p className="text-muted-foreground mt-1">
              Hier finden Sie eine Übersicht Ihrer aktuellen Ausschreibungen und Aktivitäten.
            </p>
          </div>
          <Button 
            onClick={() => navigate("/tenders/new")} 
            className="w-full sm:w-auto flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            Neue Ausschreibung
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Aktive Ausschreibungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? <Skeleton className="h-9 w-16" /> : activeTenders.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Aktuell in Bearbeitung
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Entwürfe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? <Skeleton className="h-9 w-16" /> : draftTenders.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Nicht fertiggestellte Ausschreibungen
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Erfolgsquote</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  `${tenders.length > 0 
                    ? Math.round((wonTenders.length / tenders.length) * 100) 
                    : 0}%`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Gewonnene Ausschreibungen
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Kürzlich aktualisiert</TabsTrigger>
            <TabsTrigger value="active">Aktive Ausschreibungen</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                renderSkeletonCards(3)
              ) : recentlyUpdatedTenders.length > 0 ? (
                recentlyUpdatedTenders.map(tender => (
                  <TenderCard key={tender.id} tender={tender} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Keine aktualisierten Ausschreibungen vorhanden</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                renderSkeletonCards(3)
              ) : activeTenders.length > 0 ? (
                activeTenders.map(tender => (
                  <TenderCard key={tender.id} tender={tender} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Keine aktiven Ausschreibungen vorhanden</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
