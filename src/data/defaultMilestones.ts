
import { Milestone, MilestoneStatus } from "@/types/tender";

export const getDefaultMilestones = (): Partial<Milestone>[] => {
  const today = new Date();
  
  // Berechne Fälligkeitsdaten basierend auf dem aktuellen Datum
  const dueDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),   // Quick Check: in 3 Tagen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),   // Besichtigung: in 1 Woche
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),  // Konzept: in 2 Wochen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 18),  // Kalkulation: in 18 Tagen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 25),  // Dokumente prüfen: in 25 Tagen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30),  // Ausschreibung einreichen: in 30 Tagen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 33),  // Aufklärung: in 33 Tagen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 38),  // Implementierung: in 38 Tagen
  ];
  
  return [
    {
      title: "Quick Check",
      description: "Erste Analyse der Ausschreibungsanforderungen",
      status: "ausstehend" as MilestoneStatus,
      sequenceNumber: 1,
      dueDate: dueDates[0],
      assignees: []
    },
    {
      title: "Besichtigung",
      description: "Objektbesichtigung durchführen",
      status: "ausstehend" as MilestoneStatus,
      sequenceNumber: 2,
      dueDate: dueDates[1],
      assignees: []
    },
    {
      title: "Konzept",
      description: "Konzeptentwicklung für die Ausschreibung",
      status: "ausstehend" as MilestoneStatus,
      sequenceNumber: 3,
      dueDate: dueDates[2],
      assignees: []
    },
    {
      title: "Kalkulation",
      description: "Kosten- und Leistungskalkulation erstellen",
      status: "ausstehend" as MilestoneStatus,
      sequenceNumber: 4,
      dueDate: dueDates[3],
      assignees: []
    },
    {
      title: "Dokumente prüfen",
      description: "Finale Prüfung aller Angebotsdokumente",
      status: "ausstehend" as MilestoneStatus,
      sequenceNumber: 5,
      dueDate: dueDates[4],
      assignees: []
    },
    {
      title: "Ausschreibung einreichen",
      description: "Einreichung des vollständigen Angebots",
      status: "ausstehend" as MilestoneStatus,
      sequenceNumber: 6,
      dueDate: dueDates[5],
      assignees: []
    },
    {
      title: "Aufklärung",
      description: "Rückfragen und Klärungen zur Ausschreibung bearbeiten",
      status: "ausstehend" as MilestoneStatus,
      sequenceNumber: 7,
      dueDate: dueDates[6],
      assignees: []
    },
    {
      title: "Implementierung",
      description: "Implementierung der Anforderungen nach Zuschlag",
      status: "ausstehend" as MilestoneStatus,
      sequenceNumber: 8,
      dueDate: dueDates[7],
      assignees: []
    }
  ];
};
