
import { Milestone, MilestoneStatus } from "@/types/tender";

export const getDefaultMilestones = (): Partial<Milestone>[] => {
  const today = new Date();
  
  // Berechne Fälligkeitsdaten basierend auf dem aktuellen Datum
  const dueDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),  // Quick Check: in 3 Tagen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),  // Besichtigung: in 1 Woche
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14), // Konzept: in 2 Wochen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 18), // Kalkulation: in 18 Tagen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 25), // Dokumente prüfen: in 25 Tagen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)  // Ausschreibung einreichen: in 30 Tagen
  ];
  
  return [
    {
      title: "Quick Check",
      description: "Erste Analyse der Ausschreibungsanforderungen",
      status: "pending" as MilestoneStatus,
      sequenceNumber: 1,
      dueDate: dueDates[0],
      assignees: []
    },
    {
      title: "Besichtigung",
      description: "Objektbesichtigung durchführen",
      status: "pending" as MilestoneStatus,
      sequenceNumber: 2,
      dueDate: dueDates[1],
      assignees: []
    },
    {
      title: "Konzept",
      description: "Konzeptentwicklung für die Ausschreibung",
      status: "pending" as MilestoneStatus,
      sequenceNumber: 3,
      dueDate: dueDates[2],
      assignees: []
    },
    {
      title: "Kalkulation",
      description: "Kosten- und Leistungskalkulation erstellen",
      status: "pending" as MilestoneStatus,
      sequenceNumber: 4,
      dueDate: dueDates[3],
      assignees: []
    },
    {
      title: "Dokumente prüfen",
      description: "Finale Prüfung aller Angebotsdokumente",
      status: "pending" as MilestoneStatus,
      sequenceNumber: 5,
      dueDate: dueDates[4],
      assignees: []
    },
    {
      title: "Ausschreibung einreichen",
      description: "Einreichung des vollständigen Angebots",
      status: "pending" as MilestoneStatus,
      sequenceNumber: 6,
      dueDate: dueDates[5],
      assignees: []
    }
  ];
};
