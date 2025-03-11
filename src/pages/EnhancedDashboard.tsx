
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  BarChart as BarChartIcon,
  PieChart,
  FileCheck,
  FileText,
  Flag,
  Clock,
  ArrowRight,
  Calendar,
  TrendingUp,
  Loader2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { fetchDashboardData } from "@/services/dashboardService";
import { DashboardData, TenderStatusStat } from "@/types/tender";
import { toast } from "sonner";
import { statusDisplayMap, statusColors } from "@/utils/statusUtils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

export default function EnhancedDashboard() {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Fehler beim Laden der Dashboard-Daten:", error);
        toast.error("Fehler beim Laden der Dashboard-Daten");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Hilfsfunktionen für die Diagrammdarstellung
  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      'entwurf': '#94a3b8',
      'in-pruefung': '#60a5fa',
      'in-bearbeitung': '#3b82f6',
      'abgegeben': '#a855f7',
      'aufklaerung': '#8b5cf6',
      'gewonnen': '#22c55e',
      'verloren': '#ef4444',
      'abgeschlossen': '#6b7280',
    };
    return colorMap[status] || '#94a3b8';
  };

  const formatStatusLabel = (status: string): string => {
    return statusDisplayMap[status] || status;
  };

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout title="Dashboard">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold mb-2">Keine Daten verfügbar</h2>
          <p className="text-muted-foreground">
            Es konnten keine Dashboard-Daten geladen werden. Bitte versuchen Sie es später erneut.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Erneut versuchen
          </Button>
        </div>
      </Layout>
    );
  }

  // Pie chart data for status distribution
  const pieChartData = dashboardData.statusStats
    .filter(stat => stat.count > 0)
    .map(stat => ({
      name: formatStatusLabel(stat.status),
      value: stat.count,
      color: getStatusColor(stat.status)
    }));

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="col-span-2 lg:col-span-1 animate-blur-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ausschreibungen Gesamt</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalTenders}</div>
              <p className="text-xs text-muted-foreground">Alle Ausschreibungsprojekte</p>
            </CardContent>
          </Card>
          
          <Card className="animate-blur-in" style={{ animationDelay: "50ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aktive Projekte</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.activeTenders}</div>
              <p className="text-xs text-muted-foreground">In Bearbeitung</p>
            </CardContent>
          </Card>
          
          <Card className="animate-blur-in" style={{ animationDelay: "100ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Eingereicht</CardTitle>
              <FileCheck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.submittedTenders}</div>
              <p className="text-xs text-muted-foreground">Warten auf Antwort</p>
            </CardContent>
          </Card>
          
          <Card className="animate-blur-in" style={{ animationDelay: "150ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gewonnene Projekte</CardTitle>
              <Flag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.wonTenders}</div>
              <p className="text-xs text-muted-foreground">Erfolgsquote: {dashboardData.successRate}%</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Success Rate */}
        <Card className="animate-blur-in" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Zuschlagsquote</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="text-2xl font-bold">{dashboardData.successRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.wonTenders} gewonnen von {dashboardData.wonTenders + dashboardData.lostTenders} abgeschlossenen Ausschreibungen
                </p>
              </div>
              <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${dashboardData.successRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Charts and Data */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Distribution Chart */}
          <Card className="md:col-span-1 animate-blur-in" style={{ animationDelay: "250ms" }}>
            <CardHeader>
              <CardTitle>Status-Verteilung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} Ausschreibungen`, '']}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Keine Daten verfügbar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Statistics */}
          <Card className="md:col-span-1 animate-blur-in" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle>Monatliche Statistik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Gesamt" 
                      fill="#3b82f6" 
                    />
                    <Bar 
                      dataKey="won" 
                      name="Gewonnen" 
                      fill="#22c55e" 
                    />
                    <Bar 
                      dataKey="lost" 
                      name="Verloren" 
                      fill="#ef4444" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Milestones */}
        <Card className="animate-blur-in" style={{ animationDelay: "350ms" }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Anstehende Meilensteine</CardTitle>
              <Link to="/milestones">
                <Button variant="ghost" size="sm" className="gap-1">
                  <span>Alle anzeigen</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData.upcomingMilestones.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.upcomingMilestones.slice(0, 5).map((milestone) => {
                  // Icon and color based on time to deadline
                  let icon = <Calendar className="h-5 w-5 text-blue-500" />;
                  let textColor = "text-gray-700";
                  
                  if (milestone.isOverdue) {
                    icon = <AlertTriangle className="h-5 w-5 text-red-500" />;
                    textColor = "text-red-600";
                  } else if (milestone.daysLeft !== undefined && milestone.daysLeft <= 3) {
                    icon = <Clock className="h-5 w-5 text-amber-500" />;
                    textColor = "text-amber-600";
                  }

                  return (
                    <div key={milestone.id} className="flex items-start">
                      <div className="mr-4 mt-0.5">
                        {icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Link to={`/tenders/${milestone.tenderId}`} className="font-medium hover:underline">
                            {milestone.title}
                          </Link>
                          <div className={`text-sm ${textColor} font-medium`}>
                            {milestone.isOverdue ? (
                              <span>
                                {milestone.daysLeft && Math.abs(milestone.daysLeft)} Tage überfällig
                              </span>
                            ) : (
                              <span>
                                {milestone.daysLeft} Tage übrig
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Für Ausschreibung: <span className="text-gray-700">{milestone.tenderTitle}</span>
                        </div>
                        <div className="text-sm">
                          Fällig am: <span className="text-gray-700">
                            {format(new Date(milestone.dueDate), "dd. MMMM yyyy", { locale: de })}
                          </span>
                          {milestone.status === "in-progress" && (
                            <span className="inline-flex items-center ml-2 text-blue-500">
                              <Clock className="h-3 w-3 mr-1" />
                              In Bearbeitung
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {dashboardData.upcomingMilestones.length > 5 && (
                  <div className="pt-2 text-center">
                    <Link to="/milestones">
                      <Button variant="outline" size="sm">
                        {dashboardData.upcomingMilestones.length - 5} weitere Meilensteine anzeigen
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
                <p className="text-muted-foreground">Keine anstehenden Meilensteine</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
