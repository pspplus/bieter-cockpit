
import { Milestone } from "@/types/tender";
import { v4 as uuidv4 } from 'uuid';

export const defaultMilestones: Omit<Milestone, 'id'>[] = [
  {
    title: "Document Check",
    description: "Initial review of tender documents and requirements",
    status: "pending",
  },
  {
    title: "Property Inspection",
    description: "Plan and conduct on-site property inspection",
    status: "pending",
  },
  {
    title: "Strategy Development",
    description: "Determine approach and competitive strategy",
    status: "pending",
  },
  {
    title: "Concept Creation",
    description: "Develop the core concept and approach for the tender",
    status: "pending",
  },
  {
    title: "Cost Calculation",
    description: "Prepare detailed cost calculations and financial proposal",
    status: "pending",
  },
  {
    title: "Document Compilation",
    description: "Compile all required documents for submission",
    status: "pending",
  },
  {
    title: "Submission",
    description: "Submit completed tender package to client",
    status: "pending",
  },
  {
    title: "Clarification",
    description: "Respond to any requests for clarification",
    status: "pending",
  },
  {
    title: "Follow-up",
    description: "Follow up on submission status and evaluation process",
    status: "pending",
  },
  {
    title: "Implementation",
    description: "If awarded, initiate project implementation",
    status: "pending",
  }
];

export function generateMilestones(): Milestone[] {
  return defaultMilestones.map(milestone => ({
    ...milestone,
    id: uuidv4()
  }));
}
