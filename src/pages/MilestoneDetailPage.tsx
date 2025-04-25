
import { useParams, Link } from "react-router-dom";
import { useTender } from "@/hooks/useTender";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function MilestoneDetailPage() {
  const { tenderId, milestoneId } = useParams<{ tenderId: string; milestoneId: string }>();
  const { tenders } = useTender();

  const tender = tenders.find((t) => t.id === tenderId);
  const milestone = tender?.milestones.find((m) => m.id === milestoneId);

  // Optional: Den Zustand der Checkboxen lokal verwalten
  const [checkedStates, setCheckedStates] = useState<{ [idx: number]: boolean }>({});

  if (!tender || !milestone) {
    return (
      <Layout title="Meilenstein nicht gefunden">
        <Card className="mt-10 mx-auto max-w-xl text-center">
          <CardHeader>
            <CardTitle>Meilenstein nicht gefunden</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Der gewünschte Meilenstein konnte nicht gefunden werden.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to={`/tenders/${tenderId}`}>Zurück zur Ausschreibung</Link>
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const checklist = milestone.checklist || [
    "Vertragsunterlagen prüfen",
    "Dokumente sammeln",
    "Rückfragen mit dem Kunden klären"
  ]; // Beispiel-Checkliste als Fallback

  return (
    <Layout title={milestone.title}>
      <div className="max-w-xl mx-auto mt-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to={`/tenders/${tenderId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Ausschreibung
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{milestone.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h3 className="font-semibold mb-1">Beschreibung</h3>
              <p className="mb-4">{milestone.description}</p>
              <h4 className="font-semibold mb-2">Checkliste</h4>
              <ul className="space-y-2">
                {checklist.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Checkbox
                      checked={checkedStates[idx] || false}
                      onCheckedChange={(val) =>
                        setCheckedStates((prev) => ({ ...prev, [idx]: Boolean(val) }))
                      }
                      id={`check-${idx}`}
                    />
                    <label htmlFor={`check-${idx}`}>{item}</label>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
