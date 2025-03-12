
import { Layout } from "@/components/layout/Layout";
import { useTender } from "@/hooks/useTender";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { TenderCard } from "@/components/tender/TenderCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  FileCheck, 
  FileText, 
  Flag, 
  Clock, 
  AlertCircle, 
  BarChart,
  CheckCircle2,
  Circle,
  CircleDashed,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { statusGroups } from "@/utils/statusUtils";
import { MilestoneStatus } from "@/types/tender";

export default function Dashboard() {
  const { tenders } = useTender();
  const { t } = useTranslation();
  
  // Filter tenders by status
  const activeTenders = tenders.filter(t => statusGroups.active.includes(t.status));
  const draftTenders = tenders.filter(t => statusGroups.draft.includes(t.status));
  const submittedTenders = tenders.filter(t => statusGroups.submitted.includes(t.status));
  const completedTenders = tenders.filter(t => statusGroups.completed.includes(t.status));
  
  // Calculate statistics
  const totalTenders = tenders.length;
  const tendersInProgress = activeTenders.length;
  const tendersSubmitted = submittedTenders.length;
  const tendersWon = tenders.filter(t => t.status === "gewonnen").length;
  
  // Calculate success rate (Zuschlagsquote)
  const allSubmittedTenders = tenders.filter(t => statusGroups.allSubmitted.includes(t.status)).length;
  const successRate = allSubmittedTenders > 0 ? Math.round((tendersWon / allSubmittedTenders) * 100) : 0;
  
  // Find upcoming deadlines (due in the next 7 days)
  const now = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  
  const upcomingDeadlines = tenders
    .filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate > now && dueDate <= oneWeekFromNow && statusGroups.active.includes(t.status);
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Get all milestones across all tenders
  const allMilestones = tenders.flatMap(tender => 
    tender.milestones.map(milestone => ({
      ...milestone,
      tenderTitle: tender.title
    }))
  );

  // Group milestones by status - removing the 'skipped' status
  const milestonesByStatus = {
    pending: allMilestones.filter(m => m.status === 'pending'),
    'in-progress': allMilestones.filter(m => m.status === 'in-progress'),
    completed: allMilestones.filter(m => m.status === 'completed')
  };

  // Get counts for each status - removed skipped from the count
  const milestoneStatusCounts = {
    pending: milestonesByStatus.pending.length,
    inProgress: milestonesByStatus['in-progress'].length,
    completed: milestonesByStatus.completed.length,
    total: allMilestones.length
  };

  // Get the milestone status icon
  const getMilestoneStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case 'pending':
        return <Circle className="h-4 w-4 text-slate-400" />;
      case 'in-progress':
        return <CircleDashed className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-blur-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
              <FileText className="h-4 w-4 text-bieter-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTenders}</div>
              <p className="text-xs text-tender-500">All tender projects</p>
            </CardContent>
          </Card>
          
          <Card className="animate-blur-in" style={{ animationDelay: "50ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
              <Clock className="h-4 w-4 text-bieter-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tendersInProgress}</div>
              <p className="text-xs text-tender-500">Currently in progress</p>
            </CardContent>
          </Card>
          
          <Card className="animate-blur-in" style={{ animationDelay: "100ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <FileCheck className="h-4 w-4 text-bieter-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tendersSubmitted}</div>
              <p className="text-xs text-tender-500">Awaiting response</p>
            </CardContent>
          </Card>
          
          <Card className="animate-blur-in" style={{ animationDelay: "150ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Won Tenders</CardTitle>
              <Flag className="h-4 w-4 text-bieter-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tendersWon}</div>
              <p className="text-xs text-tender-500">Success rate: {totalTenders > 0 ? Math.round((tendersWon / totalTenders) * 100) : 0}%</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-blur-in" style={{ animationDelay: "200ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Zuschlagsquote</CardTitle>
              <BarChart className="h-4 w-4 text-bieter-blue" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="text-2xl font-bold">{successRate}%</div>
                  <p className="text-xs text-tender-500">
                    {tendersWon} won out of {allSubmittedTenders} submitted tenders
                  </p>
                </div>
                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-bieter-blue rounded-full"
                    style={{ width: `${successRate}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-blur-in" style={{ animationDelay: "250ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Meilenstein Übersicht</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-bieter-blue" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Circle className="h-4 w-4 text-slate-400 mr-2" />
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm">Ausstehend</span>
                      <span className="font-medium">{milestoneStatusCounts.pending}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CircleDashed className="h-4 w-4 text-blue-500 mr-2" />
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm">In Bearbeitung</span>
                      <span className="font-medium">{milestoneStatusCounts.inProgress}</span>
                    </div>
                  </div>
                  <div className="flex items-center col-span-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm">Abgeschlossen</span>
                      <span className="font-medium">{milestoneStatusCounts.completed}</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  {milestoneStatusCounts.total > 0 && (
                    <>
                      <div 
                        className="h-full bg-blue-500 float-left"
                        style={{ width: `${(milestoneStatusCounts.inProgress / milestoneStatusCounts.total) * 100}%` }}
                      ></div>
                      <div 
                        className="h-full bg-green-500 float-left"
                        style={{ width: `${(milestoneStatusCounts.completed / milestoneStatusCounts.total) * 100}%` }}
                      ></div>
                    </>
                  )}
                </div>
                
                <div className="text-xs text-center text-tender-500">
                  {milestoneStatusCounts.total} Meilensteine insgesamt
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Active Tenders</h2>
              <Link to="/tenders" className="text-sm text-bieter-blue flex items-center hover:underline">
                View all
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
            
            {activeTenders.length > 0 ? (
              <div className="space-y-4">
                {activeTenders.slice(0, 3).map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            ) : (
              <Card className="bg-tender-50/50">
                <CardContent className="py-8 text-center text-tender-500">
                  <p>No active tenders at the moment</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Upcoming Deadlines</h2>
              </div>
              
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {upcomingDeadlines.map((tender) => {
                    const daysLeft = Math.ceil(
                      (new Date(tender.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    let urgencyClass = "text-tender-600";
                    if (daysLeft <= 2) {
                      urgencyClass = "text-red-600";
                    } else if (daysLeft <= 4) {
                      urgencyClass = "text-amber-600";
                    }
                    
                    return (
                      <Link key={tender.id} to={`/tenders/${tender.id}`}>
                        <Card className="hover:border-bieter-blue/30 transition-all">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{tender.title}</h3>
                                <p className="text-sm text-tender-500">{tender.internalReference}</p>
                              </div>
                              <div className={`rounded-full px-3 py-1 text-sm flex items-center gap-1.5 ${urgencyClass} font-medium`}>
                                <AlertCircle className="h-4 w-4" />
                                {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <Card className="bg-tender-50/50">
                  <CardContent className="py-8 text-center text-tender-500">
                    <p>No upcoming deadlines in the next 7 days</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Draft Tenders</h2>
              </div>
              
              {draftTenders.length > 0 ? (
                <div className="space-y-4">
                  {draftTenders.slice(0, 2).map((tender) => (
                    <TenderCard key={tender.id} tender={tender} />
                  ))}
                </div>
              ) : (
                <Card className="bg-tender-50/50">
                  <CardContent className="py-8 text-center text-tender-500">
                    <p>No draft tenders</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
