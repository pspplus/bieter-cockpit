import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTender } from "@/hooks/useTender";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User2 } from "lucide-react";
import { format } from "date-fns";
import { Tender, Milestone } from "@/types/tender";
import { supabase } from "@/integrations/supabase/client";

interface MilestoneTemplate {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  checklist_items: string[];
  created_at: string;
  updated_at: string;
}

export default function MilestoneDetailPage() {
  const { tenderId, milestoneId } = useParams<{ tenderId: string; milestoneId: string }>();
  const { tenders, loadTender } = useTender();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tender, setTender] = useState<Tender | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [template, setTemplate] = useState<MilestoneTemplate | null>(null);

  useEffect(() => {
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

        setTender(currentTender);
        
        const foundMilestone = currentTender.milestones.find(m => m.id === milestoneId);
        if (!foundMilestone) {
          setError("Meilenstein nicht gefunden");
          setIsLoading(false);
          return;
        }

        setMilestone(foundMilestone);

        // Lade die Meilensteinvorlage, falls vorhanden
        const { data: templateData } = await supabase
          .from('milestone_templates')
          .select('*')
          .eq('title', foundMilestone.title)
          .single();

        if (templateData) {
          setTemplate(templateData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading milestone data:", error);
        setError("Fehler beim Laden der Daten");
        setIsLoading(false);
      }
    };

    loadData();
  }, [tenderId, milestoneId, tenders, loadTender]);

  if (isLoading) {
    return (
      <Layout title="Meilenstein wird geladen...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !tender || !milestone) {
    return (
      <Layout title="Fehler">
        <Card className="mt-10 mx-auto max-w-xl text-center">
          <CardHeader>
            <CardTitle>Fehler beim Laden des Meilensteins</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Ein unerwarteter Fehler ist aufgetreten"}</p>
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
            {/* Vorlagenbereich */}
            <div className="border rounded-lg p-4 bg-slate-50">
              <h3 className="font-semibold mb-2">Meilensteinvorlage</h3>
              {template ? (
                <>
                  <div className="text-sm text-gray-600 mb-4">
                    <h4 className="font-medium mb-1">Vorlagenbeschreibung:</h4>
                    <p>{template.description}</p>
                  </div>
                  {template.checklist_items && template.checklist_items.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Checkliste aus Vorlage:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {template.checklist_items.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Für diesen Meilenstein wurde noch keine Vorlage erstellt. 
                  Sie können eine Vorlage in den Einstellungen erstellen.
                </p>
              )}
            </div>

            {/* Bestehender Meilensteininhalt */}
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
