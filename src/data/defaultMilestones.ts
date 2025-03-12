
import { Milestone } from "@/types/tender";

export const getDefaultMilestones = (): Partial<Milestone>[] => {
  const today = new Date();
  
  // Berechne Fälligkeitsdaten basierend auf dem aktuellen Datum
  const dueDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),  // Ausschreibung analysieren: in 1 Woche
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14), // Angebot vorbereiten: in 2 Wochen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 21), // Angebot abgeben: in 3 Wochen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30), // Präsentation: in 30 Tagen
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 45)  // Vertragsabschluss: in 45 Tagen
  ];
  
  return [
    {
      title: "Ausschreibung analysieren",
      description: "Anforderungen und Leistungsbeschreibung analysieren",
      status: "pending",
      sequenceNumber: 1,
      dueDate: dueDates[0]
    },
    {
      title: "Angebot vorbereiten",
      description: "Kalkulation und Angebotserstellung",
      status: "pending",
      sequenceNumber: 2,
      dueDate: dueDates[1]
    },
    {
      title: "Angebot abgeben",
      description: "Finales Angebot an den Kunden übermitteln",
      status: "pending",
      sequenceNumber: 3,
      dueDate: dueDates[2]
    },
    {
      title: "Präsentation",
      description: "Vorstellung des Angebots beim Kunden",
      status: "pending",
      sequenceNumber: 4,
      dueDate: dueDates[3]
    },
    {
      title: "Vertragsabschluss",
      description: "Finalisierung und Unterschrift des Vertrags",
      status: "pending",
      sequenceNumber: 5,
      dueDate: dueDates[4]
    }
  ];
};
