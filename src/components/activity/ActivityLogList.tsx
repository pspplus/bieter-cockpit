
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { ActivityLog } from "@/types/activity";
import {
  FileText,
  Edit,
  Trash,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  User,
  FileCheck,
  History
} from "lucide-react";

interface ActivityLogListProps {
  logs: ActivityLog[];
}

export const ActivityLogList = ({ logs }: ActivityLogListProps) => {
  const getIcon = (action: string) => {
    switch (action) {
      case "create":
        return <PlusCircle className="h-5 w-5 text-green-500" />;
      case "update":
        return <Edit className="h-5 w-5 text-blue-500" />;
      case "delete":
        return <Trash className="h-5 w-5 text-red-500" />;
      case "status_change":
        return <History className="h-5 w-5 text-purple-500" />;
      case "milestone_complete":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "milestone_create":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "document_upload":
        return <FileText className="h-5 w-5 text-indigo-500" />;
      case "document_delete":
        return <FileCheck className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (logs.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">Keine Aktivitäten gefunden</h3>
        <p className="text-muted-foreground mt-1">
          Es wurden noch keine Änderungen an Ausschreibungen vorgenommen.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {logs.map((log) => (
        <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
          <div className="flex items-start gap-4">
            <div className="mt-1">{getIcon(log.action)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{log.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{log.description}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center">
                  {formatDistanceToNow(new Date(log.timestamp), { 
                    addSuffix: true,
                    locale: de 
                  })}
                </div>
              </div>
              
              {log.tenderTitle && (
                <div className="mt-2 flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">
                    {log.tenderTitle}
                  </span>
                </div>
              )}
              
              {log.userName && (
                <div className="mt-1 flex items-center text-xs">
                  <User className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {log.userName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
