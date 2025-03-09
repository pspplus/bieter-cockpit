
import { Omit } from "@/types/tender";

// Diese Datei wird nicht mehr verwendet, aber wir behalten sie bei 
// und aktualisieren sie, um Build-Fehler zu vermeiden
export const defaultMilestones: Omit<Milestone, "id">[] = [
  {
    title: "Ausschreibung analysieren",
    description: "Initiale Analyse der Ausschreibung und Anforderungen.",
    status: "pending",
    sequenceNumber: 1,
    dueDate: null,
    completionDate: null,
    notes: ""
  },
  {
    title: "Team zusammenstellen",
    description: "Passende Teammitglieder für das Projekt auswählen.",
    status: "pending",
    sequenceNumber: 2,
    dueDate: null,
    completionDate: null,
    notes: ""
  },
  {
    title: "Angebot erstellen",
    description: "Detailiertes Angebot basierend auf den Anforderungen erstellen.",
    status: "pending",
    sequenceNumber: 3,
    dueDate: null,
    completionDate: null,
    notes: ""
  },
  {
    title: "Kalkulation durchführen",
    description: "Kostenberechnung und Preiskalkulation durchführen.",
    status: "pending",
    sequenceNumber: 4,
    dueDate: null,
    completionDate: null,
    notes: ""
  },
  {
    title: "Qualitätskontrolle",
    description: "Überprüfung des Angebots durch andere Teammitglieder.",
    status: "pending",
    sequenceNumber: 5,
    dueDate: null,
    completionDate: null,
    notes: ""
  },
  {
    title: "Angebot finalisieren",
    description: "Finale Überarbeitung und Fertigstellung des Angebots.",
    status: "pending",
    sequenceNumber: 6,
    dueDate: null,
    completionDate: null,
    notes: ""
  },
  {
    title: "Angebot einreichen",
    description: "Einreichung des fertigen Angebots beim Auftraggeber.",
    status: "pending",
    sequenceNumber: 7,
    dueDate: null,
    completionDate: null,
    notes: ""
  },
  {
    title: "Dokumentation ablegen",
    description: "Archivierung aller Dokumente und Unterlagen.",
    status: "pending",
    sequenceNumber: 8,
    dueDate: null,
    completionDate: null,
    notes: ""
  },
  {
    title: "Nachfassen",
    description: "Beim Auftraggeber nach dem Status der Entscheidung fragen.",
    status: "pending",
    sequenceNumber: 9,
    dueDate: null,
    completionDate: null,
    notes: ""
  },
  {
    title: "Projektübergabe (bei Erfolg)",
    description: "Bei erfolgreicher Ausschreibung Übergabe an das Projektteam.",
    status: "pending",
    sequenceNumber: 10,
    dueDate: null,
    completionDate: null,
    notes: ""
  }
];
