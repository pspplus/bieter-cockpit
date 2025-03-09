
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout/Layout";
import { ActivityLogList } from "@/components/activity/ActivityLogList";
import { getTenderActivityLogs } from "@/services/activityLogService";
import { ActivityLog } from "@/types/activity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const MessagesPage = () => {
  const { t } = useTranslation();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        setLoading(true);
        const logs = await getTenderActivityLogs();
        setActivityLogs(logs);
      } catch (error) {
        console.error("Fehler beim Laden der Aktivitätslogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("navigation.activityLog")}</h1>
            <p className="text-muted-foreground">
              Alle Änderungen und Aktivitäten zu Ihren Ausschreibungen
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle>Aktivitätsprotokoll</CardTitle>
              <CardDescription>
                Chronologische Aufzeichnung aller Änderungen an Ausschreibungen
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)]">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {Array(5).fill(0).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ActivityLogList logs={activityLogs} />
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
