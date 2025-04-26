
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTender } from "@/hooks/useTender";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User2 } from "lucide-react";
import { format } from "date-fns";

export default function MilestoneDetailPage() {
  const { tenderId, milestoneId } = useParams<{ tenderId: string; milestoneId: string }>();
  const { tenders } = useTender();
  
  const tender = tenders.find((t) => t.id === tenderId);
  const milestone = tender?.milestones.find((m) => m.id === milestoneId);

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

  return (
    <Layout title={milestone.title}>
      <div className="max-w-3xl mx-auto mt-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to={`/tenders/${tenderId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Ausschreibung
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{milestone.title}</CardTitle>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                milestone.status === 'ausstehend' ? 'bg-gray-200 text-gray-700' :
                milestone.status === 'in-bearbeitung' ? 'bg-blue-200 text-blue-700' :
                milestone.status === 'abgeschlossen' ? 'bg-green-200 text-green-700' :
                'bg-amber-200 text-amber-700'
              }`}>
                {milestone.status === 'ausstehend' ? 'Ausstehend' :
                 milestone.status === 'in-bearbeitung' ? 'In Bearbeitung' :
                 milestone.status === 'abgeschlossen' ? 'Abgeschlossen' :
                 'Übersprungen'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Beschreibung</h3>
              <p className="text-gray-600">{milestone.description}</p>
            </div>

            {milestone.dueDate && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Fällig am: {format(new Date(milestone.dueDate), 'dd.MM.yyyy')}</span>
              </div>
            )}

            {milestone.assignees && milestone.assignees.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <User2 className="h-4 w-4 mr-2" />
                  Zugewiesene Mitarbeiter
                </h3>
                <ul className="list-disc list-inside">
                  {milestone.assignees.map((assignee, index) => (
                    <li key={index} className="text-gray-600">{assignee}</li>
                  ))}
                </ul>
              </div>
            )}

            {milestone.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notizen</h3>
                <p className="text-gray-600">{milestone.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
