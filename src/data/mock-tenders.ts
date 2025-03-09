
import { Tender } from "@/types/tender";
import { v4 as uuidv4 } from "uuid";
import { addDays, subDays } from "date-fns";

// Hilfsfunktion für das Datum
const today = new Date();

export const mockTenders: Tender[] = [
  {
    id: "1",
    title: "Webentwicklung für Stadtverwaltung",
    externalReference: "STAD-2023-01",
    internalReference: "2023-001",
    description: "Entwicklung einer neuen Website für die Stadtverwaltung.",
    client: "Stadt Frankfurt",
    status: "active",
    createdAt: subDays(today, 30),
    updatedAt: subDays(today, 5),
    dueDate: addDays(today, 20),
    budget: 75000,
    location: "Frankfurt am Main",
    contactPerson: "Martina Schmidt",
    contactEmail: "m.schmidt@frankfurt.de",
    contactPhone: "+49 69 12345 6789",
    progress: 35,
    milestones: [
      {
        id: "ms-1-1",
        title: "Ausschreibung veröffentlicht",
        description: "Ausschreibung wurde im Amtsblatt veröffentlicht",
        status: "completed",
        dueDate: subDays(today, 25),
        completionDate: subDays(today, 27),
        notes: "Veröffentlicht im Amtsblatt der Stadt Frankfurt",
        sequenceNumber: 10
      },
      {
        id: "ms-1-2",
        title: "Angebotserstellung",
        description: "Erstellung und interne Prüfung des Angebots",
        status: "completed",
        dueDate: subDays(today, 10),
        completionDate: subDays(today, 12),
        notes: "Rechtzeitig fertiggestellt, alle Anforderungen erfüllt",
        sequenceNumber: 20
      },
      {
        id: "ms-1-3",
        title: "Präsentation",
        description: "Vorstellung des Konzepts beim Kunden",
        status: "pending",
        dueDate: addDays(today, 5),
        completionDate: null,
        notes: "Präsentation vorbereiten, Muster-Designs ausarbeiten",
        sequenceNumber: 30
      }
    ],
    tags: ["Öffentlicher Sektor", "Webentwicklung", "CMS"]
  },
  {
    id: "2",
    title: "ERP-System-Migration",
    externalReference: "MED-2023-42",
    internalReference: "2023-002",
    description: "Migration des bestehenden ERP-Systems auf eine Cloud-Lösung.",
    client: "Medi-Konzern GmbH",
    status: "won",
    createdAt: subDays(today, 90),
    updatedAt: subDays(today, 15),
    dueDate: subDays(today, 10),
    budget: 250000,
    location: "München",
    contactPerson: "Dr. Thomas Weber",
    contactEmail: "t.weber@medikonzern.de",
    contactPhone: "+49 89 9876 5432",
    progress: 100,
    milestones: [
      {
        id: "ms-2-1",
        title: "Ausschreibung veröffentlicht",
        description: "RFP wurde an ausgewählte Dienstleister gesendet",
        status: "completed",
        dueDate: subDays(today, 85),
        completionDate: subDays(today, 85),
        notes: "RFP direkt vom Kunden erhalten",
        sequenceNumber: 10
      },
      {
        id: "ms-2-2",
        title: "Angebotserstellung",
        description: "Erstellung des detaillierten Angebots",
        status: "completed",
        dueDate: subDays(today, 70),
        completionDate: subDays(today, 72),
        notes: "Detailliertes Angebot mit Migrationsstrategie",
        sequenceNumber: 20
      },
      {
        id: "ms-2-3",
        title: "Präsentation",
        description: "Präsentation vor dem Vorstand",
        status: "completed",
        dueDate: subDays(today, 60),
        completionDate: subDays(today, 60),
        notes: "Präsentation erfolgreich durchgeführt",
        sequenceNumber: 30
      },
      {
        id: "ms-2-4",
        title: "Zuschlag erhalten",
        description: "Projekt wurde uns zugesprochen",
        status: "completed",
        dueDate: subDays(today, 30),
        completionDate: subDays(today, 32),
        notes: "Offizielles Zuschlagsschreiben erhalten",
        sequenceNumber: 40
      }
    ],
    tags: ["Healthcare", "ERP", "Cloud", "Migration"]
  },
  {
    id: "3",
    title: "Mobile App für Versicherung",
    externalReference: "VERS-2023-15",
    internalReference: "2023-003",
    description: "Entwicklung einer mobilen App für Versicherungskunden.",
    client: "AllSecure Versicherung AG",
    status: "draft",
    createdAt: subDays(today, 10),
    updatedAt: subDays(today, 10),
    dueDate: addDays(today, 15),
    budget: 120000,
    location: "Hamburg",
    contactPerson: "Jana Meier",
    contactEmail: "j.meier@allsecure.de",
    contactPhone: "+49 40 5678 1234",
    progress: 10,
    milestones: [
      {
        id: "ms-3-1",
        title: "Ausschreibungsdokumente sichten",
        description: "Prüfung der Anforderungen und Rahmenbedingungen",
        status: "pending",
        dueDate: addDays(today, 2),
        completionDate: null,
        notes: "Besonders auf die Anforderungen an Datenschutz und Sicherheit achten",
        sequenceNumber: 10
      },
      {
        id: "ms-3-2",
        title: "Entscheidung über Teilnahme",
        description: "Go/No-Go-Entscheidung für die Angebotserstellung",
        status: "pending",
        dueDate: addDays(today, 4),
        completionDate: null,
        notes: "Meeting mit Geschäftsführung und Technik-Team ansetzen",
        sequenceNumber: 20
      }
    ],
    tags: ["Versicherung", "Mobile App", "Kundenportal"]
  },
  {
    id: "4",
    title: "IT-Sicherheitsaudit",
    externalReference: "BANK-2023-08",
    internalReference: "2023-004",
    description: "Durchführung eines umfassenden IT-Sicherheitsaudits.",
    client: "Rhein-Main-Bank AG",
    status: "submitted",
    createdAt: subDays(today, 45),
    updatedAt: subDays(today, 20),
    dueDate: subDays(today, 5),
    budget: 85000,
    location: "Mainz",
    contactPerson: "Christian Berger",
    contactEmail: "c.berger@rm-bank.de",
    contactPhone: "+49 6131 9876 5432",
    progress: 75,
    milestones: [
      {
        id: "ms-4-1",
        title: "Ausschreibung erhalten",
        description: "Einladung zur Angebotsabgabe erhalten",
        status: "completed",
        dueDate: subDays(today, 40),
        completionDate: subDays(today, 40),
        notes: "Persönliche Einladung vom IT-Sicherheitsbeauftragten",
        sequenceNumber: 10
      },
      {
        id: "ms-4-2",
        title: "Angebotserstellung",
        description: "Erstellung des detaillierten Angebots",
        status: "completed",
        dueDate: subDays(today, 30),
        completionDate: subDays(today, 32),
        notes: "Detaillierter Auditplan mit Zeitrahmen und Methodik",
        sequenceNumber: 20
      },
      {
        id: "ms-4-3",
        title: "Angebotsabgabe",
        description: "Formelle Einreichung des Angebots",
        status: "completed",
        dueDate: subDays(today, 20),
        completionDate: subDays(today, 22),
        notes: "Angebot fristgerecht eingereicht",
        sequenceNumber: 30
      }
    ],
    tags: ["Banken", "IT-Sicherheit", "Audit", "Compliance"]
  },
  {
    id: "5",
    title: "Entwicklung Online-Buchungssystem",
    externalReference: "TOUR-2023-03",
    internalReference: "2023-005",
    description: "Entwicklung eines Online-Buchungssystems für Tourenanbieter.",
    client: "Adventure Tours GmbH",
    status: "lost",
    createdAt: subDays(today, 60),
    updatedAt: subDays(today, 30),
    dueDate: subDays(today, 25),
    budget: 95000,
    location: "Berlin",
    contactPerson: "Markus Schulz",
    contactEmail: "m.schulz@adventure-tours.de",
    contactPhone: "+49 30 2345 6789",
    progress: 100,
    milestones: [
      {
        id: "ms-5-1",
        title: "Ausschreibung erhalten",
        description: "RFP über Branchenkontakte erhalten",
        status: "completed",
        dueDate: subDays(today, 55),
        completionDate: subDays(today, 55),
        notes: "Ausschreibung von Branchenverband weitergeleitet bekommen",
        sequenceNumber: 10
      },
      {
        id: "ms-5-2",
        title: "Angebotserstellung",
        description: "Erstellung des Angebots",
        status: "completed",
        dueDate: subDays(today, 45),
        completionDate: subDays(today, 46),
        notes: "Fokus auf Integration mit bestehenden Systemen",
        sequenceNumber: 20
      },
      {
        id: "ms-5-3",
        title: "Absage erhalten",
        description: "Kunde hat sich für anderen Anbieter entschieden",
        status: "completed",
        dueDate: subDays(today, 30),
        completionDate: subDays(today, 30),
        notes: "Preis war ausschlaggebender Faktor laut Feedback",
        sequenceNumber: 30
      }
    ],
    tags: ["Tourismus", "Buchungssystem", "Web-Entwicklung"]
  }
];

// Hilfsfunktion zum Erstellen eines leeren Tenders
export const createEmptyTender = (): Tender => {
  const id = uuidv4();
  return {
    id,
    title: "Neue Ausschreibung",
    externalReference: "",
    internalReference: `${new Date().getFullYear()}-${id.substring(0, 3)}`,
    description: "",
    client: "",
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: addDays(new Date(), 30),
    budget: undefined,
    location: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    progress: 0,
    milestones: [],
    tags: []
  };
};
