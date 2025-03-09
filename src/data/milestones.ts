
import { Milestone } from "@/types/tender";
import { v4 as uuidv4 } from "uuid";

export const milestoneTemplates: Omit<Milestone, "id">[] = [
  {
    title: "Ausschreibung analysieren",
    description: "Initiale Analyse der Ausschreibungsunterlagen",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 1
  },
  {
    title: "Entscheidung über Teilnahme",
    description: "Evaluierung und Entscheidung zur Teilnahme an der Ausschreibung",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 2
  },
  {
    title: "Team zusammenstellen",
    description: "Festlegung des Angebotsteams und Verantwortlichkeiten",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 3
  },
  {
    title: "Kostenkalkulation",
    description: "Detaillierte Kostenkalkulation für das Angebot",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 4
  },
  {
    title: "Technisches Konzept",
    description: "Erstellung des technischen Konzepts",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 5
  },
  {
    title: "Entwurf des Angebots",
    description: "Erstellung eines Angebotsentwurfs",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 6
  },
  {
    title: "Interne Prüfung",
    description: "Interne Qualitätsprüfung des Angebots",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 7
  },
  {
    title: "Finalisierung",
    description: "Finales Angebot zusammenstellen",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 8
  },
  {
    title: "Abgabe des Angebots",
    description: "Formelle Einreichung des Angebots beim Auftraggeber",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 9
  },
  {
    title: "Nachverfolgung",
    description: "Nachverfolgung des Angebotsstatus und Anpassungen wenn nötig",
    status: "pending",
    dueDate: null,
    completionDate: null,
    sequenceNumber: 10
  }
];

export const createDefaultMilestones = (): Milestone[] => {
  return milestoneTemplates.map(template => ({
    ...template,
    id: uuidv4()
  }));
};
