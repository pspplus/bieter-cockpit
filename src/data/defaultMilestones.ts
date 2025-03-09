
import { Milestone } from "@/types/tender";

export const getDefaultMilestones = (): Partial<Milestone>[] => {
  return [
    {
      title: "Quick-Check",
      description: "Schnelle Prüfung der Ausschreibungsunterlagen",
      status: "pending"
    },
    {
      title: "Besichtigung",
      description: "Vor-Ort-Besichtigung des Objekts",
      status: "pending"
    },
    {
      title: "Konzept",
      description: "Erstellung des Angebotskonzepts",
      status: "pending"
    },
    {
      title: "Kalkulation",
      description: "Detaillierte Preiskalkulation",
      status: "pending"
    },
    {
      title: "Dokumente prüfen",
      description: "Finale Prüfung aller Angebotsunterlagen",
      status: "pending"
    },
    {
      title: "Ausschreibung einreichen",
      description: "Einreichung des vollständigen Angebots",
      status: "pending"
    }
  ];
};
