
export type ActivityLogAction = 
  | "create" 
  | "update" 
  | "delete" 
  | "status_change" 
  | "milestone_complete" 
  | "milestone_create" 
  | "document_upload" 
  | "document_delete";

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: ActivityLogAction;
  title: string;
  description: string;
  tenderID?: string;
  tenderTitle?: string;
  userName?: string;
  userID?: string;
  milestoneID?: string;
  milestoneTitle?: string;
  documentID?: string;
  documentName?: string;
}
