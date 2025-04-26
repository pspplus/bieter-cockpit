import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTender } from "@/hooks/useTender";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User2, ListCheck } from "lucide-react";
import { format } from "date-fns";
import { Tender, Milestone } from "@/types/tender";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

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
        const { data: templateData, error: templateError } = await supabase
          .from('milestone_templates')
          .select('*')
          .eq('title', foundMilestone.title)
          .single();

        if (templateData) {
          // Konvertiere das JSON-Array in ein string[]
          const template: MilestoneTemplate = {
            ...templateData,
            checklist_items: Array.isArray(templateData.checklist_items) 
              ? templateData.checklist_items as string[]
              : []
          };
          setTemplate(template);
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

  const handleCheckboxChange = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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
    <Layout title={milestone?.title || "Meilenstein"}>
      <div className="max-w-3xl mx-auto mt-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to={`/tenders/${tenderId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Ausschreibung
          </Link>
        </Button>

        <div className="space-y-6">
          {/* Erste Karte: Meilenstein-Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{milestone?.title}</CardTitle>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  milestone?.status === 'ausstehend' ? 'bg-gray-200 text-gray-700' :
                  milestone?.status === 'in-bearbeitung' ? 'bg-blue-200 text-blue-700' :
                  milestone?.status === 'abgeschlossen' ? 'bg-green-200 text-green-700' :
                  'bg-amber-200 text-amber-700'
                }`}>
                  {milestone?.status === 'ausstehend' ? 'Ausstehend' :
                   milestone?.status === 'in-bearbeitung' ? 'In Bearbeitung' :
                   milestone?.status === 'abgeschlossen' ? 'Abgeschlossen' :
                   'Übersprungen'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Beschreibung</h3>
                <p className="text-gray-600">{milestone?.description}</p>
              </div>

              {milestone?.dueDate && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Fällig am: {format(new Date(milestone.dueDate), 'dd.MM.yyyy')}</span>
                </div>
              )}

              {milestone?.assignees && milestone.assignees.length > 0 && (
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

              {milestone?.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notizen</h3>
                  <p className="text-gray-600">{milestone.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zweite Karte: Vorlagen-Details */}
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-[#1A1F2C] text-xl">Aufgabenbeschreibung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {template ? (
                <>
                  <div className="space-y-4">
                    {template.description && (
                      <div>
                        <h3 className="font-semibold mb-2 text-[#9b87f5] text-lg">Arbeitsanweisung</h3>
                        <p className="text-gray-600">{template.description}</p>
                      </div>
                    )}
                    
                    {template.checklist_items && template.checklist_items.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <ListCheck className="h-4 w-4 mr-2" />
                          <h3 className="font-semibold text-[#9b87f5] text-lg">Aufgaben</h3>
                        </div>
                        <div className="space-y-2">
                          {template.checklist_items.map((item, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Checkbox
                                id={`checklist-${index}`}
                                checked={checkedItems[index] || false}
                                onCheckedChange={() => handleCheckboxChange(index)}
                              />
                              <label
                                htmlFor={`checklist-${index}`}
                                className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {item}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Für diesen Meilenstein wurde noch keine Vorlage erstellt. 
                  Sie können eine Vorlage in den Einstellungen erstellen.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
