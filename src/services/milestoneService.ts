
import { Milestone } from "@/types/tender";
import { v4 as uuidv4 } from "uuid";
import { getDefaultMilestones } from "@/data/defaultMilestones";

// Interne Speicherung für Mock-Daten
const milestonesStore: Record<string, Milestone[]> = {};

// Holt alle Meilensteine aller Ausschreibungen
export const fetchMilestones = async (): Promise<Milestone[]> => {
  // Simuliert einen API-Aufruf
  return new Promise((resolve) => {
    setTimeout(() => {
      const allMilestones: Milestone[] = [];
      Object.values(milestonesStore).forEach(tenderMilestones => {
        allMilestones.push(...tenderMilestones);
      });
      resolve(allMilestones);
    }, 300);
  });
};

// Holt alle Meilensteine mit einem bestimmten Status
export const fetchMilestonesByStatus = async (status: "pending" | "in-progress" | "completed" | "skipped"): Promise<Milestone[]> => {
  // Simuliert einen API-Aufruf
  return new Promise((resolve) => {
    setTimeout(() => {
      const allMilestones: Milestone[] = [];
      Object.values(milestonesStore).forEach(tenderMilestones => {
        allMilestones.push(...tenderMilestones.filter(m => m.status === status));
      });
      resolve(allMilestones);
    }, 300);
  });
};

// Holt Meilensteine für eine bestimmte Ausschreibung
export const fetchMilestonesByTenderId = async (tenderId: string): Promise<Milestone[]> => {
  // Simuliert einen API-Aufruf
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(milestonesStore[tenderId] || []);
    }, 300);
  });
};

// Erstellt einen neuen Meilenstein
export const createMilestone = async (milestone: Omit<Milestone, 'id'>): Promise<Milestone> => {
  const newMilestone: Milestone = {
    ...milestone,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!milestonesStore[milestone.tenderId]) {
    milestonesStore[milestone.tenderId] = [];
  }

  milestonesStore[milestone.tenderId].push(newMilestone);

  // Simuliert einen API-Aufruf
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newMilestone);
    }, 300);
  });
};

// Aktualisiert einen bestehenden Meilenstein
export const updateMilestone = async (milestone: Milestone): Promise<Milestone> => {
  const index = milestonesStore[milestone.tenderId]?.findIndex(m => m.id === milestone.id);
  
  if (index === undefined || index === -1) {
    throw new Error("Milestone not found");
  }

  // Aktualisieren mit den neuen Daten
  const updatedMilestone = {
    ...milestone,
    updatedAt: new Date(),
  };
  
  milestonesStore[milestone.tenderId][index] = updatedMilestone;

  // Simuliert einen API-Aufruf
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(updatedMilestone);
    }, 300);
  });
};

// Aktualisiert den Status eines Meilensteins
export const updateMilestoneStatus = async (
  milestoneId: string, 
  tenderId: string, 
  status: "pending" | "in-progress" | "completed" | "skipped"
): Promise<Milestone> => {
  const index = milestonesStore[tenderId]?.findIndex(m => m.id === milestoneId);
  
  if (index === undefined || index === -1) {
    throw new Error("Milestone not found");
  }

  const milestone = milestonesStore[tenderId][index];
  
  // Bestimmt, ob das completionDate aktualisiert werden muss
  let completionDate = milestone.completionDate;
  
  // Setze das Abschlussdatum nur, wenn der Status auf "completed" geändert wird
  if (status === 'completed') {
    completionDate = new Date();
  } 
  // Lösche das Abschlussdatum, wenn der Status von "completed" zu etwas anderem geändert wird
  else if (milestone.status === 'completed' && status !== 'completed') {
    completionDate = null;
  }

  // Aktualisieren mit den neuen Daten
  const updatedMilestone = {
    ...milestone,
    status,
    completionDate,
    updatedAt: new Date(),
  };
  
  milestonesStore[tenderId][index] = updatedMilestone;

  // Simuliert einen API-Aufruf
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(updatedMilestone);
    }, 300);
  });
};

// Löscht einen Meilenstein
export const deleteMilestone = async (milestoneId: string, tenderId: string): Promise<void> => {
  // Simuliert einen API-Aufruf
  return new Promise((resolve) => {
    setTimeout(() => {
      if (milestonesStore[tenderId]) {
        milestonesStore[tenderId] = milestonesStore[tenderId].filter(m => m.id !== milestoneId);
      }
      resolve();
    }, 300);
  });
};

// Erstellt Standardmeilensteine für eine Ausschreibung
export const createDefaultMilestones = async (tenderId: string, tenderTitle: string): Promise<Milestone[]> => {
  const defaultMilestones = getDefaultMilestones(tenderId, tenderTitle);
  
  if (!milestonesStore[tenderId]) {
    milestonesStore[tenderId] = [];
  }
  
  milestonesStore[tenderId] = [...milestonesStore[tenderId], ...defaultMilestones];
  
  // Simuliert einen API-Aufruf
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(defaultMilestones);
    }, 300);
  });
};
