
import { supabase } from "@/integrations/supabase/client";
import { ActivityLog } from "@/types/activity";
import { format } from "date-fns";

// Funktion, um alle Aktivitätslogs für Ausschreibungen zu holen
export const getTenderActivityLogs = async (): Promise<ActivityLog[]> => {
  try {
    // In einer echten Anwendung würden wir die Logs aus der Datenbank ziehen
    // Da wir noch keine Datenbanktabelle dafür haben, generieren wir Beispieldaten
    const mockLogs = generateMockActivityLogs();
    
    // Sortiere die Logs nach Zeitstempel (neueste zuerst)
    return mockLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Fehler beim Abrufen der Aktivitätslogs:", error);
    throw error;
  }
};

// Funktion zum Erstellen eines neuen Aktivitätslogs
export const createActivityLog = async (logData: Omit<ActivityLog, "id" | "timestamp">): Promise<ActivityLog> => {
  try {
    // In einer echten Anwendung würden wir den Log in die Datenbank schreiben
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...logData
    };
    
    return newLog;
  } catch (error) {
    console.error("Fehler beim Erstellen eines Aktivitätslogs:", error);
    throw error;
  }
};

// Hilfsfunktion zur Generierung von Mock-Daten
const generateMockActivityLogs = (): ActivityLog[] => {
  const now = new Date();
  const days = (days: number) => 
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  
  return [
    {
      id: "log-1",
      timestamp: days(0),
      action: "status_change",
      title: "Status geändert auf 'Abgegeben'",
      description: "Die Ausschreibung 'Meine erste Ausschreibung' wurde von 'In Bearbeitung' auf 'Abgegeben' geändert.",
      tenderTitle: "Meine erste Ausschreibung",
      tenderID: "7b241689-422e-4acb-a0a5-9b5124e6bd6a",
      userName: "Philipp Schmitz"
    },
    {
      id: "log-2",
      timestamp: days(0.5),
      action: "milestone_complete",
      title: "Meilenstein abgeschlossen",
      description: "Der Meilenstein 'Dokumente prüfen' wurde als abgeschlossen markiert.",
      tenderTitle: "Meine erste Ausschreibung",
      tenderID: "7b241689-422e-4acb-a0a5-9b5124e6bd6a",
      userName: "Philipp Schmitz"
    },
    {
      id: "log-3",
      timestamp: days(1),
      action: "update",
      title: "Ausschreibung aktualisiert",
      description: "Kontaktdaten wurden aktualisiert.",
      tenderTitle: "Grundreinigung München",
      tenderID: "7b241689-422e-4acb-a0a5-9b5124e6bd6a",
      userName: "Philipp Schmitz"
    },
    {
      id: "log-4",
      timestamp: days(2),
      action: "document_upload",
      title: "Dokument hochgeladen",
      description: "Eine neue Datei 'Angebot.pdf' wurde hochgeladen.",
      tenderTitle: "Erste Ausschreibung",
      tenderID: "1887fbb0-606a-4a39-b094-686076ec5972",
      userName: "Philipp Schmitz"
    },
    {
      id: "log-5",
      timestamp: days(3),
      action: "milestone_create",
      title: "Meilenstein erstellt",
      description: "Ein neuer Meilenstein 'Konzeptionierungs-Meeting' wurde erstellt.",
      tenderTitle: "Erste Ausschreibung",
      tenderID: "1887fbb0-606a-4a39-b094-686076ec5972",
      userName: "Philipp Schmitz"
    },
    {
      id: "log-6",
      timestamp: days(5),
      action: "create",
      title: "Ausschreibung erstellt",
      description: "Eine neue Ausschreibung 'Erste Ausschreibung' wurde erstellt.",
      tenderTitle: "Erste Ausschreibung",
      tenderID: "1887fbb0-606a-4a39-b094-686076ec5972",
      userName: "Philipp Schmitz"
    },
    {
      id: "log-7",
      timestamp: days(7),
      action: "status_change",
      title: "Status geändert auf 'In Bearbeitung'",
      description: "Die Ausschreibung 'Erste Ausschreibung' wurde von 'Entwurf' auf 'In Bearbeitung' geändert.",
      tenderTitle: "Erste Ausschreibung",
      tenderID: "1887fbb0-606a-4a39-b094-686076ec5972",
      userName: "Philipp Schmitz"
    },
    {
      id: "log-8",
      timestamp: days(10),
      action: "create",
      title: "Ausschreibung erstellt",
      description: "Eine neue Ausschreibung 'Meine erste Ausschreibung' wurde erstellt.",
      tenderTitle: "Meine erste Ausschreibung",
      tenderID: "7b241689-422e-4acb-a0a5-9b5124e6bd6a",
      userName: "Philipp Schmitz"
    }
  ];
};
