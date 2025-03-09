
import { Milestone } from "@/types/tender";

export const getDefaultMilestones = (): Partial<Milestone>[] => {
  return [
    {
      title: "Quick-Check",
      description: "Schnelle Prüfung der Ausschreibungsunterlagen",
      status: "pending",
      sequenceNumber: 1
    },
    {
      title: "Besichtigung",
      description: "Vor-Ort-Besichtigung des Objekts",
      status: "pending",
      sequenceNumber: 2
    },
    {
      title: "Konzept",
      description: "Erstellung des Angebotskonzepts",
      status: "pending",
      sequenceNumber: 3
    },
    {
      title: "Kalkulation",
      description: "Detaillierte Preiskalkulation",
      status: "pending",
      sequenceNumber: 4
    },
    {
      title: "Dokumente prüfen",
      description: "Finale Prüfung aller Angebotsunterlagen",
      status: "pending",
      sequenceNumber: 5
    },
    {
      title: "Ausschreibung einreichen",
      description: "Einreichung des vollständigen Angebots",
      status: "pending",
      sequenceNumber: 6
    }
  ];
};
