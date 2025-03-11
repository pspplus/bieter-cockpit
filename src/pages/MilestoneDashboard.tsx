
import { useEffect, useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { fetchMilestones, fetchMilestonesByStatus } from "@/services/milestoneService";
import { Milestone } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MilestoneProcess } from "@/components/tender/MilestoneProcess";
import { CheckCircle, Clock, Circle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTender } from "@/hooks/useTender";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function MilestoneDashboard() {
  const { t } = useTranslation();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { updateMilestone } = useTender();
  
  useEffect(() => {
    const loadMilestones = async () => {
      setIsLoading(true);
      try {
        let data: Milestone[];
        
        if (statusFilter) {
          data = await fetchMilestonesByStatus(statusFilter as "pending" | "in-progress" | "completed" | "skipped");
        } else {
          data = await fetchMilestones();
        }
        
        setMilestones(data);
      } catch (error) {
        console.error("Error loading milestones:", error);
        toast.error(t("milestones.loadError", "Fehler beim Laden der Meilensteine"));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMilestones();
  }, [statusFilter, t]);
  
  const handleStatusUpdate = async (milestone: Milestone, newStatus: "pending" | "in-progress" | "completed" | "skipped") => {
    try {
      const updatedMilestone = {
        ...milestone,
        status: newStatus,
        completionDate: newStatus === 'completed' ? new Date() : null
      };
      
      await updateMilestone(updatedMilestone);
      
      // Update local state
      setMilestones(prev => 
        prev.map(m => m.id === milestone.id ? updatedMilestone : m)
      );
      
      toast.success(t("milestones.statusUpdated", "Meilenstein-Status aktualisiert"));
    } catch (error) {
      console.error("Error updating milestone status:", error);
      toast.error(t("milestones.updateError", "Fehler beim Aktualisieren des Status"));
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "skipped":
        return <XCircle className="h-5 w-5 text-tender-400" />;
      default:
        return <Circle className="h-5 w-5 text-tender-300" />;
    }
  };
  
  // Group milestones by their tender
  const milestonesByTender = milestones.reduce((acc, milestone) => {
    if (!milestone.tenderId) return acc;
    
    if (!acc[milestone.tenderId]) {
      acc[milestone.tenderId] = [];
    }
    
    acc[milestone.tenderId].push(milestone);
    return acc;
  }, {} as Record<string, Milestone[]>);
  
  return (
    <Layout title={t("milestones.dashboard", "Meilenstein-Dashboard")}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("milestones.dashboard", "Meilenstein-Dashboard")}</h1>
          
          <div className="flex items-center space-x-2">
            <Select 
              value={statusFilter || "all"} 
              onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("milestones.filterByStatus", "Nach Status filtern")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("milestones.allStatuses", "Alle Status")}</SelectItem>
                <SelectItem value="pending">{t("milestoneStatus.pending", "Ausstehend")}</SelectItem>
                <SelectItem value="in-progress">{t("milestoneStatus.in-progress", "In Bearbeitung")}</SelectItem>
                <SelectItem value="completed">{t("milestoneStatus.completed", "Abgeschlossen")}</SelectItem>
                <SelectItem value="skipped">{t("milestoneStatus.skipped", "Übersprungen")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : Object.keys(milestonesByTender).length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">
              {t("milestones.noMilestonesFound", "Keine Meilensteine gefunden")}
            </h2>
            <p className="text-gray-500 mt-2">
              {statusFilter 
                ? t("milestones.noMilestonesWithStatus", "Es wurden keine Meilensteine mit diesem Status gefunden")
                : t("milestones.noMilestonesYet", "Es wurden noch keine Meilensteine hinzugefügt")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(milestonesByTender).map(([tenderId, tenderMilestones]) => (
              <Card key={tenderId} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle>
                    <Link to={`/tenders/${tenderId}`} className="hover:text-primary transition-colors">
                      {tenderMilestones[0]?.tenderTitle || t("milestones.untitledTender", "Ausschreibung ohne Titel")}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {t("milestones.count", "{{count}} Meilensteine", { count: tenderMilestones.length })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MilestoneProcess milestones={tenderMilestones} tenderId={tenderId} />
                  
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-sm">{t("milestones.listView", "Listenansicht")}</h4>
                    <div className="space-y-2">
                      {tenderMilestones
                        .sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0))
                        .map((milestone) => (
                          <div key={milestone.id} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center space-x-3">
                              <div className={cn(
                                "rounded-full p-1.5",
                                milestone.status === "completed" ? "bg-green-100" :
                                milestone.status === "in-progress" ? "bg-blue-100" :
                                milestone.status === "skipped" ? "bg-tender-100" : 
                                "bg-gray-100"
                              )}>
                                {getStatusIcon(milestone.status)}
                              </div>
                              <div>
                                <div className="font-medium">{milestone.title}</div>
                                {milestone.description && (
                                  <div className="text-sm text-muted-foreground line-clamp-1">{milestone.description}</div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant={milestone.status === "in-progress" ? "default" : "outline"}
                                onClick={() => handleStatusUpdate(milestone, "in-progress")}
                                disabled={milestone.status === "in-progress"}
                                className="text-xs h-8"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {t("milestoneStatus.in-progress", "In Bearbeitung")}
                              </Button>
                              <Button
                                size="sm"
                                variant={milestone.status === "completed" ? "default" : "outline"}
                                onClick={() => handleStatusUpdate(milestone, "completed")}
                                disabled={milestone.status === "completed"}
                                className="text-xs h-8"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t("milestoneStatus.completed", "Abgeschlossen")}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
