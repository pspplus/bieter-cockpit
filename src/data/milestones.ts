
import { Milestone } from "@/types/tender";
import { v4 as uuidv4 } from 'uuid';

export const defaultMilestones: Omit<Milestone, 'id'>[] = [
  {
    title: "Document Check",
    description: "Initial review of tender documents and requirements",
    status: "pending",
    dueDate: null,
    completionDate: null
  },
  {
    title: "Property Inspection",
    description: "Plan and conduct on-site property inspection",
    status: "pending",
    dueDate: null,
    completionDate: null
  },
  {
    title: "Strategy Development",
    description: "Determine approach and competitive strategy",
    status: "pending",
    dueDate: null,
    completionDate: null
  },
  {
    title: "Concept Creation",
    description: "Develop the core concept and approach for the tender",
    status: "pending",
    dueDate: null,
    completionDate: null
  },
  {
    title: "Cost Calculation",
    description: "Prepare detailed cost calculations and financial proposal",
    status: "pending",
    dueDate: null,
    completionDate: null
  },
  {
    title: "Document Compilation",
    description: "Compile all required documents for submission",
    status: "pending",
    dueDate: null,
    completionDate: null
  },
  {
    title: "Submission",
    description: "Submit completed tender package to client",
    status: "pending",
    dueDate: null,
    completionDate: null
  },
  {
    title: "Clarification",
    description: "Respond to any requests for clarification",
    status: "pending",
    dueDate: null,
    completionDate: null
  },
  {
    title: "Follow-up",
    description: "Follow up on submission status and evaluation process",
    status: "pending",
    dueDate: null,
    completionDate: null
  },
  {
    title: "Implementation",
    description: "If awarded, initiate project implementation",
    status: "pending",
    dueDate: null,
    completionDate: null
  }
];

export function generateMilestones(): Milestone[] {
  return defaultMilestones.map(milestone => ({
    ...milestone,
    id: uuidv4(),
    tenderId: "" // Add empty tenderId that will be set when actually creating milestones
  }));
}
