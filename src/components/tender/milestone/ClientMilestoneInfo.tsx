
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/client";
import { Milestone } from "@/types/tender";

interface ClientMilestoneInfoProps {
  client: Client | null;
  milestone: Milestone;
}

export function ClientMilestoneInfo({ client, milestone }: ClientMilestoneInfoProps) {
  const getMilestoneInfo = (milestone: Milestone, client: Client | null) => {
    if (!client) return null;

    switch (milestone.title) {
      case "Quick Check":
        return client.quick_check_info;
      case "Besichtigung":
        return client.besichtigung_info;
      case "Konzept":
        return client.konzept_info;
      case "Kalkulation":
        return client.kalkulation_info;
      case "Dokumente prüfen":
        return client.dokumente_pruefen_info;
      case "Ausschreibung einreichen":
        return client.ausschreibung_einreichen_info;
      case "Aufklärung":
        return client.aufklaerung_info;
      case "Implementierung":
        return client.implementierung_info;
      default:
        return null;
    }
  };

  const milestoneInfo = getMilestoneInfo(milestone, client);

  if (!milestoneInfo) {
    return null;
  }

  return (
    <Card className="bg-slate-50 mt-6">
      <CardHeader>
        <CardTitle className="text-[#1A1F2C] text-xl">Vergabestellen-Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 whitespace-pre-wrap">{milestoneInfo}</p>
      </CardContent>
    </Card>
  );
}
