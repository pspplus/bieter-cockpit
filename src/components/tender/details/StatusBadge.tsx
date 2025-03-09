
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TenderStatus } from "@/types/tender";
import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  status: TenderStatus;
}

const statusColors: Record<TenderStatus, { bg: string; text: string }> = {
  "entwurf": { bg: "bg-tender-100", text: "text-tender-600" },
  "in-pruefung": { bg: "bg-amber-100", text: "text-amber-600" },
  "in-bearbeitung": { bg: "bg-blue-100", text: "text-blue-600" },
  "abgegeben": { bg: "bg-indigo-100", text: "text-indigo-600" },
  "aufklaerung": { bg: "bg-purple-100", text: "text-purple-600" },
  "gewonnen": { bg: "bg-green-100", text: "text-green-600" },
  "verloren": { bg: "bg-red-100", text: "text-red-600" },
  "abgeschlossen": { bg: "bg-teal-100", text: "text-teal-600" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  const statusColor = statusColors[status];
  
  // Format status text
  const formatStatusText = (status: TenderStatus): string => {
    const statusMap: Record<TenderStatus, string> = {
      "entwurf": t('tenders.drafts', 'Entwurf'),
      "in-pruefung": t('tenders.review', 'In Prüfung'),
      "in-bearbeitung": t('tenders.active', 'In Bearbeitung'),
      "abgegeben": t('tenders.submitted', 'Abgegeben'),
      "aufklaerung": t('tenders.inClarification', 'Aufklärung'),
      "gewonnen": t('tenders.won', 'Gewonnen'),
      "verloren": t('tenders.lost', 'Verloren'),
      "abgeschlossen": t('tenders.completed', 'Abgeschlossen')
    };
    
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge className={cn(statusColor.bg, statusColor.text)}>
      {formatStatusText(status)}
    </Badge>
  );
}
