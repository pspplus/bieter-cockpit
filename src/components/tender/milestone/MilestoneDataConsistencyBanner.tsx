
import React from "react";
import { Milestone } from "@/types/tender";
import { AlertTriangle } from "lucide-react";

interface MilestoneDataConsistencyBannerProps {
  milestones: Milestone[];
}

/**
 * Zeigt einen Hinweis an, wenn Inkonsistenzen in der Milestone-Liste gefunden werden.
 */
export function MilestoneDataConsistencyBanner({ milestones }: MilestoneDataConsistencyBannerProps) {
  const missingTitle = milestones.some(m => !m.title || m.title.trim() === "");
  const missingSequence = milestones.some(m => typeof m.sequenceNumber !== "number" || isNaN(m.sequenceNumber));
  const missingStatus = milestones.some(m => !m.status);

  if (!missingTitle && !missingSequence && !missingStatus) return null;

  return (
    <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <div>
        <span className="font-semibold">Warnung: </span>
        Es liegen inkonsistente Meilensteindaten vor.
        <ul className="list-disc ml-4">
          {missingTitle && <li>Titel fehlt bei mindestens einem Meilenstein.</li>}
          {missingSequence && <li>Reihenfolge (sequenceNumber) fehlt oder ist ungültig.</li>}
          {missingStatus && <li>Status fehlt bei mindestens einem Meilenstein.</li>}
        </ul>
      </div>
    </div>
  );
}
