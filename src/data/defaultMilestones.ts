
import { Milestone } from "@/types/tender";

export const getDefaultMilestones = (): Partial<Milestone>[] => {
  return [
    {
      title: "Quick-Check",
      description: "Schnelle Prüfung der Ausschreibungsunterlagen",
      status: "pending",
      sequenceNumber: 1,
      dueDate: null,
      completionDate: null
    },
    {
      title: "Besichtigung",
      description: "Vor-Ort-Besichtigung des Objekts",
      status: "pending",
      sequenceNumber: 2,
      dueDate: null,
      completionDate: null
    },
    {
      title: "Konzept",
      description: "Erstellung des Angebotskonzepts",
      status: "pending",
      sequenceNumber: 3,
      dueDate: null,
      completionDate: null
    },
    {
      title: "Kalkulation",
      description: "Detaillierte Preiskalkulation",
      status: "pending",
      sequenceNumber: 4,
      dueDate: null,
      completionDate: null
    },
    {
      title: "Dokumente prüfen",
      description: "Finale Prüfung aller Angebotsunterlagen",
      status: "pending",
      sequenceNumber: 5,
      dueDate: null,
      completionDate: null
    },
    {
      title: "Ausschreibung einreichen",
      description: "Einreichung des vollständigen Angebots",
      status: "pending",
      sequenceNumber: 6,
      dueDate: null,
      completionDate: null
    }
  ];
};
