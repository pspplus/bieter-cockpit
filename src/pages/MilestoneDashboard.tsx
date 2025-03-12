
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { MilestonesList } from "@/components/tender/MilestonesList";
import { Milestone } from "@/types/tender";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarIcon, ClockIcon, BellIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { fetchMilestones } from "@/services/milestoneService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MilestoneDashboard() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        setIsLoading(true);
        // For now, we'll use mock data or fetch all milestones from all tenders
        // In a real app, you might want to filter by user or by active tenders
        const response = await fetchMilestones("all"); // Special "all" parameter to get all milestones
        setMilestones(response);
      } catch (error) {
        console.error("Error loading milestones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMilestones();
  }, []);

  // Filter milestones by status
  const upcomingMilestones = milestones.filter(
    (m) => m.status === "pending" && new Date(m.due_date) > new Date()
  ).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const lateMilestones = milestones.filter(
    (m) => m.status === "pending" && new Date(m.due_date) < new Date()
  );

  const inProgressMilestones = milestones.filter((m) => m.status === "in-progress");
  const completedMilestones = milestones.filter((m) => m.status === "completed");

  // Get milestones due this week
  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const thisWeekMilestones = milestones.filter(
    (m) => 
      m.status !== "completed" && 
      new Date(m.due_date) >= today && 
      new Date(m.due_date) <= endOfWeek
  );

  return (
    <Layout title={t("milestones.dashboard", "Meilensteine Dashboard")}>
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-yellow-500" />
                    {t("milestones.upcoming", "Anstehende Meilensteine")}
                  </CardTitle>
                  <CardDescription>
                    {t("milestones.nextDeadlines", "Ihre nächsten Fristen")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingMilestones.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("milestones.noUpcoming", "Keine anstehenden Meilensteine")}</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingMilestones.slice(0, 3).map((milestone) => (
                        <div key={milestone.id} className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{milestone.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {milestone.tender_title || t("milestones.noTenderTitle", "Ohne Ausschreibungstitel")}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(milestone.due_date).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BellIcon className="h-5 w-5 mr-2 text-red-500" />
                    {t("milestones.late", "Überfällige Meilensteine")}
                  </CardTitle>
                  <CardDescription>
                    {t("milestones.needsAttention", "Benötigen sofortige Aufmerksamkeit")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lateMilestones.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("milestones.noLate", "Keine überfälligen Meilensteine")}</p>
                  ) : (
                    <div className="space-y-3">
                      {lateMilestones.slice(0, 3).map((milestone) => (
                        <div key={milestone.id} className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{milestone.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {milestone.tender_title || t("milestones.noTenderTitle", "Ohne Ausschreibungstitel")}
                            </p>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            {formatDistanceToNow(new Date(milestone.due_date), { addSuffix: true, locale: de })}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    {t("milestones.thisWeek", "Diese Woche")}
                  </CardTitle>
                  <CardDescription>
                    {t("milestones.dueThisWeek", "In dieser Woche fällig")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {thisWeekMilestones.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("milestones.noneThisWeek", "Keine Meilensteine diese Woche")}</p>
                  ) : (
                    <div className="space-y-3">
                      {thisWeekMilestones.slice(0, 3).map((milestone) => (
                        <div key={milestone.id} className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{milestone.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {milestone.tender_title || t("milestones.noTenderTitle", "Ohne Ausschreibungstitel")}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(milestone.due_date).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">{t("milestones.all", "Alle")}</TabsTrigger>
                <TabsTrigger value="upcoming">{t("milestones.upcoming", "Anstehend")}</TabsTrigger>
                <TabsTrigger value="in-progress">{t("milestones.inProgress", "In Bearbeitung")}</TabsTrigger>
                <TabsTrigger value="completed">{t("milestones.completed", "Abgeschlossen")}</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <MilestonesList milestones={milestones} />
              </TabsContent>
              <TabsContent value="upcoming">
                <MilestonesList milestones={upcomingMilestones} />
              </TabsContent>
              <TabsContent value="in-progress">
                <MilestonesList milestones={inProgressMilestones} />
              </TabsContent>
              <TabsContent value="completed">
                <MilestonesList milestones={completedMilestones} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
}
