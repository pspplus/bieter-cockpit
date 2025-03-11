
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { format, differenceInDays } from "date-fns";
import { de } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { CalendarClock, CheckCircle, AlertTriangle, BarChart, Clock, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Milestone } from "@/types/tender";
import { fetchAllMilestones, updateMilestoneStatus } from "@/services/milestoneService";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MilestoneDashboard() {
  const { t } = useTranslation();
  const [milestones, setMilestones] = useState<(Milestone & { tenderTitle?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("dueDate");

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        setLoading(true);
        const data = await fetchAllMilestones();
        setMilestones(data);
      } catch (error) {
        console.error("Fehler beim Laden der Meilensteine:", error);
        toast.error("Fehler beim Laden der Meilensteine");
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, []);

  const handleStatusChange = async (milestoneId: string, newStatus: "pending" | "in-progress" | "completed" | "skipped") => {
    try {
      await updateMilestoneStatus(milestoneId, newStatus);
      setMilestones(prev => 
        prev.map(m => m.id === milestoneId ? { ...m, status: newStatus } : m)
      );
      toast.success(`Meilenstein-Status geändert zu "${newStatus}"`);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Meilenstein-Status:", error);
      toast.error("Fehler beim Ändern des Status");
    }
  };

  // Filter milestones based on active filter
  const filteredMilestones = milestones.filter(milestone => {
    if (activeFilter === "all") return true;
    if (activeFilter === "upcoming") {
      return milestone.status !== "completed" && milestone.status !== "skipped";
    }
    if (activeFilter === "overdue") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = milestone.dueDate ? new Date(milestone.dueDate) : null;
      return milestone.status !== "completed" && 
             milestone.status !== "skipped" && 
             dueDate && 
             dueDate < today;
    }
    return milestone.status === activeFilter;
  });

  // Sort milestones
  const sortedMilestones = [...filteredMilestones].sort((a, b) => {
    if (sortOption === "dueDate") {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return dateA - dateB;
    }
    if (sortOption === "status") {
      const statusOrder = { "in-progress": 1, "pending": 2, "completed": 3, "skipped": 4 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    if (sortOption === "tender") {
      return (a.tenderTitle || "").localeCompare(b.tenderTitle || "");
    }
    return 0;
  });

  // Calculate statistics
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.status === "completed").length;
  const pendingMilestones = milestones.filter(m => m.status === "pending").length;
  const inProgressMilestones = milestones.filter(m => m.status === "in-progress").length;
  const skippedMilestones = milestones.filter(m => m.status === "skipped").length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const overdueMilestones = milestones.filter(m => {
    const dueDate = m.dueDate ? new Date(m.dueDate) : null;
    return m.status !== "completed" && 
           m.status !== "skipped" && 
           dueDate && 
           dueDate < today;
  }).length;

  const upcomingMilestones = milestones.filter(m => {
    const dueDate = m.dueDate ? new Date(m.dueDate) : null;
    return m.status !== "completed" && 
           m.status !== "skipped" && 
           dueDate && 
           dueDate >= today;
  }).length;

  const completionRate = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : 0;

  // Status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Ausstehend</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">In Bearbeitung</Badge>;
      case "completed":
        return <Badge variant="outline" className="text-green-500 border-green-500">Abgeschlossen</Badge>;
      case "skipped":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Übersprungen</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  // Due date formatting and coloring
  const getDueDateDisplay = (dueDate: Date | null | undefined) => {
    if (!dueDate) return "Kein Fälligkeitsdatum";
    
    const date = new Date(dueDate);
    const daysLeft = differenceInDays(date, today);
    
    if (daysLeft < 0) {
      return (
        <span className="text-red-600 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {format(date, "dd.MM.yyyy", { locale: de })} 
          <span className="ml-2">({Math.abs(daysLeft)} Tage überfällig)</span>
        </span>
      );
    } else if (daysLeft === 0) {
      return (
        <span className="text-orange-500 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Heute ({format(date, "dd.MM.yyyy", { locale: de })})
        </span>
      );
    } else if (daysLeft <= 7) {
      return (
        <span className="text-orange-500 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {format(date, "dd.MM.yyyy", { locale: de })} 
          <span className="ml-2">({daysLeft} Tage übrig)</span>
        </span>
      );
    } else {
      return (
        <span className="text-gray-600 flex items-center">
          <CalendarClock className="h-4 w-4 mr-1" />
          {format(date, "dd.MM.yyyy", { locale: de })} 
          <span className="ml-2">({daysLeft} Tage übrig)</span>
        </span>
      );
    }
  };

  if (loading) {
    return (
      <Layout title="Meilenstein-Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Meilenstein-Dashboard">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alle Meilensteine</CardTitle>
              <Flag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMilestones}</div>
              <p className="text-xs text-muted-foreground">Für alle Ausschreibungen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedMilestones}</div>
              <div className="flex items-center space-x-2">
                <div className="h-2 flex-grow bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground">{completionRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingMilestones + inProgressMilestones}</div>
              <p className="text-xs text-muted-foreground">
                {pendingMilestones} ausstehend, {inProgressMilestones} in Bearbeitung
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Überfällig</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overdueMilestones}</div>
              <p className="text-xs text-muted-foreground">
                Benötigen sofortige Aufmerksamkeit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">Alle</TabsTrigger>
                <TabsTrigger value="upcoming">Anstehende</TabsTrigger>
                <TabsTrigger value="overdue">Überfällige</TabsTrigger>
                <TabsTrigger value="completed">Abgeschlossene</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex space-x-2 w-full sm:w-auto">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sortieren nach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Fälligkeitsdatum</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="tender">Ausschreibung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredMilestones.length === 0 ? (
            <Card>
              <CardContent className="flex justify-center items-center py-12">
                <div className="text-center text-muted-foreground">
                  <BarChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Keine Meilensteine gefunden</p>
                  <p className="text-sm mt-1">Für diesen Filter gibt es keine Ergebnisse.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedMilestones.map((milestone) => (
                <Card key={milestone.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5">
                        <h3 className="font-medium">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {milestone.description}
                        </p>
                      </div>
                      
                      <div className="md:col-span-3 text-sm">
                        {getDueDateDisplay(milestone.dueDate)}
                      </div>
                      
                      <div className="md:col-span-2">
                        <Link to={`/tenders/${milestone.tenderId}`} className="text-sm text-primary hover:underline">
                          {milestone.tenderTitle || "Ausschreibung"}
                        </Link>
                      </div>
                      
                      <div className="md:col-span-2 flex justify-end items-center space-x-2">
                        {getStatusBadge(milestone.status)}
                        
                        <Select
                          value={milestone.status}
                          onValueChange={(value) => handleStatusChange(
                            milestone.id, 
                            value as "pending" | "in-progress" | "completed" | "skipped"
                          )}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status ändern" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Ausstehend</SelectItem>
                            <SelectItem value="in-progress">In Bearbeitung</SelectItem>
                            <SelectItem value="completed">Abgeschlossen</SelectItem>
                            <SelectItem value="skipped">Übersprungen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
