

import { TenderStatus } from "@/types/tender";

// Map of status codes to display text
export const statusDisplayMap: Record<TenderStatus, string> = {
  "entwurf": "Entwurf",
  "in-pruefung": "In Prüfung",
  "in-bearbeitung": "In Bearbeitung",
  "abgegeben": "Abgegeben",
  "aufklaerung": "Aufklärung",
  "gewonnen": "Gewonnen",
  "verloren": "Verloren",
  "ausgeschlossen": "Ausgeschlossen",
  "nicht-abgegeben": "Nicht abgegeben"
};

// Map of status codes to colors
export const statusColors: Record<TenderStatus, { bg: string; text: string }> = {
  "entwurf": { bg: "bg-tender-100", text: "text-tender-600" },
  "in-pruefung": { bg: "bg-amber-100", text: "text-amber-600" },
  "in-bearbeitung": { bg: "bg-blue-100", text: "text-blue-600" },
  "abgegeben": { bg: "bg-indigo-100", text: "text-indigo-600" },
  "aufklaerung": { bg: "bg-purple-100", text: "text-purple-600" },
  "gewonnen": { bg: "bg-green-100", text: "text-green-600" },
  "verloren": { bg: "bg-red-100", text: "text-red-600" },
  "ausgeschlossen": { bg: "bg-teal-100", text: "text-teal-600" },
  "nicht-abgegeben": { bg: "bg-gray-200", text: "text-gray-500" }
};

// Function to get status display text
export const getStatusDisplay = (status: TenderStatus): string => {
  return statusDisplayMap[status] || status;
};

// Function to get status colors
export const getStatusColors = (status: TenderStatus): { bg: string; text: string } => {
  return statusColors[status] || { bg: "bg-gray-100", text: "text-gray-600" };
};

// Status groups for filtering
export const statusGroups = {
  active: ["in-bearbeitung", "in-pruefung"] as TenderStatus[],
  draft: ["entwurf"] as TenderStatus[],
  submitted: ["abgegeben", "aufklaerung"] as TenderStatus[],
  completed: ["gewonnen", "verloren", "ausgeschlossen", "nicht-abgegeben"] as TenderStatus[],
  allSubmitted: ["abgegeben", "aufklaerung", "gewonnen", "verloren", "ausgeschlossen", "nicht-abgegeben"] as TenderStatus[]
};

// Translation key mapping for i18n
export const statusTranslationKeys: Record<TenderStatus, string> = {
  "entwurf": "tenderStatus.draft",
  "in-pruefung": "tenderStatus.inReview",
  "in-bearbeitung": "tenderStatus.inProgress",
  "abgegeben": "tenderStatus.submitted",
  "aufklaerung": "tenderStatus.clarification",
  "gewonnen": "tenderStatus.won",
  "verloren": "tenderStatus.lost",
  "ausgeschlossen": "tenderStatus.excluded",
  "nicht-abgegeben": "tenderStatus.notSubmitted"
};
