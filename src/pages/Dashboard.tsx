
import { Layout } from "@/components/layout/Layout";
import { TenderCard } from "@/components/tender/TenderCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTender } from "@/context/TenderContext";
import { ArrowRight, FileCheck, FileText, Flag, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { tenders } = useTender();
  
  // Filter tenders by status
  const activeTenders = tenders.filter(t => t.status === "active");
  const draftTenders = tenders.filter(t => t.status === "draft");
  const submittedTenders = tenders.filter(t => ["submitted", "clarification"].includes(t.status));
  const completedTenders = tenders.filter(t => ["won", "lost", "completed"].includes(t.status));
  
  // Calculate statistics
  const totalTenders = tenders.length;
  const tendersInProgress = activeTenders.length;
  const tendersSubmitted = submittedTenders.length;
  const tendersWon = tenders.filter(t => t.status === "won").length;
  
  // Find upcoming deadlines (due in the next 7 days)
  const now = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  
  const upcomingDeadlines = tenders
    .filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate > now && dueDate <= oneWeekFromNow && t.status === "active";
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-blur-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
              <FileText className="h-4 w-4 text-tender-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTenders}</div>
              <p className="text-xs text-tender-500">All tender projects</p>
            </CardContent>
          </Card>
          
          <Card className="animate-blur-in" style={{ animationDelay: "50ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tendersInProgress}</div>
              <p className="text-xs text-tender-500">Currently in progress</p>
            </CardContent>
          </Card>
          
          <Card className="animate-blur-in" style={{ animationDelay: "100ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <FileCheck className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tendersSubmitted}</div>
              <p className="text-xs text-tender-500">Awaiting response</p>
            </CardContent>
          </Card>
          
          <Card className="animate-blur-in" style={{ animationDelay: "150ms" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Won Tenders</CardTitle>
              <Flag className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tendersWon}</div>
              <p className="text-xs text-tender-500">Success rate: {totalTenders > 0 ? Math.round((tendersWon / totalTenders) * 100) : 0}%</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Active Tenders</h2>
              <Link to="/tenders" className="text-sm text-primary flex items-center hover:underline">
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
                        <Card className="hover:border-primary/30 transition-all">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{tender.title}</h3>
                                <p className="text-sm text-tender-500">{tender.reference}</p>
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
