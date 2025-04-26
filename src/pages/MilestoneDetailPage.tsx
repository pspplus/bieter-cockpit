
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTender } from "@/hooks/useTender";
import { Layout } from "@/components/layout/Layout";
import { Milestone } from "@/types/tender";
import { useClient } from "@/context/ClientContext";
import { MilestoneDetailLoading } from "@/components/tender/milestone/MilestoneDetailLoading";
import { MilestoneDetailError } from "@/components/tender/milestone/MilestoneDetailError";
import { MilestoneDetailContent } from "@/components/tender/milestone/MilestoneDetailContent";
import { useMilestoneTemplate } from "@/hooks/useMilestoneTemplate";

export default function MilestoneDetailPage() {
  const { tenderId, milestoneId } = useParams<{ tenderId: string; milestoneId: string }>();
  const { tenders, loadTender } = useTender();
  const { clients } = useClient();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const template = useMilestoneTemplate(milestone);
  const [client, setClient] = useState<Client | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      if (!tenderId || !milestoneId) {
        setError("Ungültige Parameter");
        setIsLoading(false);
        return;
      }

      try {
        let currentTender = tenders.find(t => t.id === tenderId);
        
        if (!currentTender) {
          currentTender = await loadTender(tenderId);
        }

        if (!currentTender) {
          setError("Ausschreibung nicht gefunden");
          setIsLoading(false);
          return;
        }
        
        if (currentTender.client) {
          const clientData = clients.find(c => c.name === currentTender?.client);
          setClient(clientData || null);
        }
        
        const foundMilestone = currentTender.milestones.find(m => m.id === milestoneId);
        if (!foundMilestone) {
          setError("Meilenstein nicht gefunden");
          setIsLoading(false);
          return;
        }

        setMilestone(foundMilestone);
        setIsLoading(false);
      } catch (error) {
        setError("Fehler beim Laden der Daten");
        setIsLoading(false);
      }
    };

    loadData();
  }, [tenderId, milestoneId, tenders, loadTender, clients]);

  if (isLoading) {
    return <MilestoneDetailLoading />;
  }

  if (error || !milestone) {
    return <MilestoneDetailError error={error || ""} tenderId={tenderId} />;
  }

  return (
    <Layout title={milestone.title || "Meilenstein"}>
      <MilestoneDetailContent 
        milestone={milestone}
        template={template}
        client={client}
        tenderId={tenderId!}
      />
    </Layout>
  );
}
