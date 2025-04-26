
import { Milestone, MilestoneStatus } from "@/types/tender";

export const sortMilestones = (milestones: Milestone[]): Milestone[] => {
  return [...milestones].sort((a, b) => {
    const seqA = typeof a.sequenceNumber === 'number' ? a.sequenceNumber : 0;
    const seqB = typeof b.sequenceNumber === 'number' ? b.sequenceNumber : 0;
    return seqA - seqB;
  });
};

export const canUpdateMilestoneStatus = (milestone: Milestone, newStatus: MilestoneStatus): boolean => {
  if (newStatus === "ausstehend") {
    return true;
  }
  
  if (newStatus === "in-bearbeitung") {
    return true;
  }
  
  if (newStatus === "abgeschlossen") {
    return milestone.status === "in-bearbeitung";
  }
  
  if (newStatus === "uebersprungen") {
    return milestone.status === "ausstehend";
  }
  
  return false;
};
