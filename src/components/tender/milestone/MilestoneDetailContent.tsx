
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Client } from "@/types/client";  // Corrected import
import { Milestone } from "@/types/tender";
import { ArrowLeft, Calendar, ListCheck, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ClientMilestoneInfo } from "./ClientMilestoneInfo";
import { useState } from "react";

interface MilestoneDetailContentProps {
  milestone: Milestone;
  template: any | null;
  client: Client | null;
  tenderId: string;
}

export function MilestoneDetailContent({ 
  milestone, 
  template, 
  client, 
  tenderId 
}: MilestoneDetailContentProps) {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const handleCheckboxChange = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to={`/tenders/${tenderId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Ausschreibung
        </Link>
      </Button>

      <div className="space-y-6">
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
                  Zuständige Mitarbeiter
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

        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-[#1A1F2C] text-xl">Aufgabenbeschreibung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {template ? (
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
                      {template.checklist_items.map((item: string, index: number) => (
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
            ) : (
              <p className="text-sm text-gray-500">
                Für diesen Meilenstein wurde noch keine Vorlage erstellt. 
                Sie können eine Vorlage in den Einstellungen erstellen.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {client && milestone && (
        <ClientMilestoneInfo client={client} milestone={milestone} />
      )}
    </div>
  );
}
