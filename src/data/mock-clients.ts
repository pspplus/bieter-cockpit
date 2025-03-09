
import { Client } from "@/types/client";
import { v4 as uuidv4 } from 'uuid';

// Helper to generate dates (past from now)
const generateDate = (daysOffset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

export const mockClients: Client[] = [
  {
    id: uuidv4(),
    name: "Metropolitan Council",
    contactPerson: "Sarah Johnson",
    email: "sjohnson@metrocouncil.gov",
    phone: "555-123-4567",
    address: "123 City Hall Street, Metro City",
    createdAt: generateDate(-30),
  },
  {
    id: uuidv4(),
    name: "State Education Department",
    contactPerson: "Michael Chen",
    email: "mchen@edu.gov",
    phone: "555-987-6543",
    address: "456 Education Avenue, Capital City",
    createdAt: generateDate(-60),
  },
  {
    id: uuidv4(),
    name: "Department of Transportation",
    contactPerson: "Robert Miller",
    email: "rmiller@transport.gov",
    phone: "555-456-7890",
    address: "789 Highway Boulevard, Transit City",
    createdAt: generateDate(-45),
  },
  {
    id: uuidv4(),
    name: "Housing Authority",
    contactPerson: "Jennifer Lopez",
    email: "jlopez@housing.gov",
    phone: "555-222-3333",
    address: "321 Residential Lane, Eastside District",
    createdAt: generateDate(-20),
  },
  {
    id: uuidv4(),
    name: "Environmental Protection Agency",
    contactPerson: "David Washington",
    email: "dwashington@epa.gov",
    phone: "555-777-8888",
    address: "654 Green Street, Riverside",
    createdAt: generateDate(-90),
  },
];
