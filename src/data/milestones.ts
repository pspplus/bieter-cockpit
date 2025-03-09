
// Diese Daten sind statische Meilenstein-Definitionen, 
// die für jeden neuen Tender verwendet werden können

export const publicationMilestone = {
  title: "Veröffentlichung",
  description: "Die Ausschreibung wird veröffentlicht",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 10
};

export const submissionDeadlineMilestone = {
  title: "Abgabefrist",
  description: "Frist für die Abgabe der Angebote",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 20
};

export const clarificationPhaseMilestone = {
  title: "Rückfragenphase",
  description: "Zeitraum für Rückfragen an den Auftraggeber",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 30
};

export const offerPreparationMilestone = {
  title: "Angebotserstellung",
  description: "Vorbereitung und Erstellung des Angebots",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 40
};

export const internalReviewMilestone = {
  title: "Interne Prüfung",
  description: "Interne Überprüfung des Angebots",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 50
};

export const submissionMilestone = {
  title: "Angebotsabgabe",
  description: "Formelle Abgabe des Angebots",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 60
};

export const presentationMilestone = {
  title: "Präsentation",
  description: "Vorstellung des Angebots beim Kunden",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 70
};

export const decisionMilestone = {
  title: "Entscheidung",
  description: "Entscheidung des Kunden über den Zuschlag",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 80
};

export const contractSigningMilestone = {
  title: "Vertragsunterzeichnung",
  description: "Unterzeichnung des Vertrags",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 90
};

export const projectStartMilestone = {
  title: "Projektstart",
  description: "Beginn der Projektumsetzung",
  status: "pending" as const,
  dueDate: null,
  completionDate: null,
  sequenceNumber: 100
};
