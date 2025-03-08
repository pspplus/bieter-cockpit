
import { Tender } from "@/types/tender";
import { v4 as uuidv4 } from 'uuid';
import { generateMilestones } from "./milestones";

// Helper to generate dates (past or future from now)
const generateDate = (daysOffset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

export const mockTenders: Tender[] = [
  {
    id: uuidv4(),
    title: "City Center Renovation Project",
    reference: "CCR-2023-042",
    client: "Metropolitan Council",
    status: "active",
    createdAt: generateDate(-15),
    updatedAt: generateDate(-2),
    dueDate: generateDate(14),
    budget: 2500000,
    description: "Comprehensive renovation of the central plaza and surrounding infrastructure",
    location: "Downtown, Metro City",
    contactPerson: "Sarah Johnson",
    contactEmail: "sjohnson@metrocouncil.gov",
    contactPhone: "555-123-4567",
    milestones: generateMilestones().map((milestone, index) => {
      if (index < 3) {
        return { ...milestone, status: "completed", completionDate: generateDate(-5 + index) };
      } else if (index === 3) {
        return { ...milestone, status: "in-progress", dueDate: generateDate(2) };
      }
      return { ...milestone, dueDate: generateDate(5 + index * 2) };
    }),
  },
  {
    id: uuidv4(),
    title: "School District Energy Efficiency Upgrade",
    reference: "EDU-2023-187",
    client: "State Education Department",
    status: "submitted",
    createdAt: generateDate(-45),
    updatedAt: generateDate(-5),
    dueDate: generateDate(-7),
    budget: 1200000,
    description: "Implementation of energy efficiency measures across 12 public schools",
    location: "Northern School District",
    contactPerson: "Michael Chen",
    contactEmail: "mchen@edu.gov",
    contactPhone: "555-987-6543",
    milestones: generateMilestones().map((milestone, index) => {
      if (index < 7) {
        return { ...milestone, status: "completed", completionDate: generateDate(-30 + index * 3) };
      }
      return { ...milestone };
    }),
  },
  {
    id: uuidv4(),
    title: "Highway Bridge Inspection and Maintenance",
    reference: "TRANS-2023-098",
    client: "Department of Transportation",
    status: "clarification",
    createdAt: generateDate(-30),
    updatedAt: generateDate(-1),
    dueDate: generateDate(-10),
    budget: 850000,
    description: "Structural inspection and maintenance services for 5 major highway bridges",
    location: "Interstate 95 Corridor",
    contactPerson: "Robert Miller",
    contactEmail: "rmiller@transport.gov",
    contactPhone: "555-456-7890",
    milestones: generateMilestones().map((milestone, index) => {
      if (index < 7) {
        return { ...milestone, status: "completed", completionDate: generateDate(-25 + index * 2) };
      } else if (index === 7) {
        return { ...milestone, status: "in-progress" };
      }
      return { ...milestone };
    }),
  },
  {
    id: uuidv4(),
    title: "Public Housing Modernization",
    reference: "HOUSING-2023-076",
    client: "Housing Authority",
    status: "draft",
    createdAt: generateDate(-5),
    updatedAt: generateDate(-1),
    dueDate: generateDate(25),
    budget: 3800000,
    description: "Comprehensive modernization of 150 public housing units",
    location: "Eastside District",
    contactPerson: "Jennifer Lopez",
    contactEmail: "jlopez@housing.gov",
    contactPhone: "555-222-3333",
    milestones: generateMilestones().map((milestone, index) => {
      if (index < 1) {
        return { ...milestone, status: "in-progress" };
      }
      return { ...milestone };
    }),
  },
  {
    id: uuidv4(),
    title: "Water Treatment Facility Upgrade",
    reference: "WATER-2023-032",
    client: "Environmental Protection Agency",
    status: "won",
    createdAt: generateDate(-90),
    updatedAt: generateDate(-15),
    dueDate: generateDate(-60),
    budget: 5200000,
    description: "Modernization of city water treatment facility to meet new regulations",
    location: "Riverside Plant",
    contactPerson: "David Washington",
    contactEmail: "dwashington@epa.gov",
    contactPhone: "555-777-8888",
    milestones: generateMilestones().map((milestone, index) => {
      if (index < 9) {
        return { ...milestone, status: "completed", completionDate: generateDate(-85 + index * 5) };
      } else if (index === 9) {
        return { ...milestone, status: "in-progress" };
      }
      return { ...milestone };
    }),
  },
];

export const getTender = (id: string): Tender | undefined => {
  return mockTenders.find(tender => tender.id === id);
};

export const getTendersByStatus = (status: Tender['status']): Tender[] => {
  return mockTenders.filter(tender => tender.status === status);
};
