
import { MilestoneStatus } from "@/types/tender";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";

interface StatusIconProps {
  status: MilestoneStatus;
}

export function MilestoneStatusIcon({ status }: StatusIconProps) {
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
}
