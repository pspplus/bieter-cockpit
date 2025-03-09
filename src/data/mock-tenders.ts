
import { Tender, TenderStatus, MilestoneStatus } from "@/types/tender";
import { v4 as uuid } from "uuid";

// Helper to create a date object with custom days offset
const createDate = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

// Generate mock tenders data
export const MOCK_TENDERS: Tender[] = [
  {
    id: "5b8573f5-8a5e-4fdc-92b1-25d587b2592d",
    title: "IT-Dienstleistungen für die Stadt München",
    internalReference: "2023-001",
    externalReference: "2023-01-MUEN",
    client: "Stadt München",
    status: "active",
    createdAt: createDate(-20),
    updatedAt: createDate(-3),
    dueDate: createDate(15),
    budget: 250000,
    description: "Bereitstellung von IT-Support, Netzwerkmanagement und Softwareentwicklungsdienstleistungen für das Rathaus München.",
    location: "München, Bayern",
    contactPerson: "Thomas Müller",
    contactEmail: "t.mueller@muenchen.de",
    contactPhone: "+49 89 123456",
    notes: "Die Stadt München legt besonderen Wert auf den Einsatz von Open-Source-Software.",
    milestones: [
      {
        id: uuid(),
        title: "Anforderungsanalyse",
        description: "Durchführung einer Anforderungsanalyse mit den verschiedenen Abteilungen",
        status: "completed",
        dueDate: createDate(-10),
        completionDate: createDate(-12),
        notes: "Alle Abteilungen wurden erfolgreich befragt"
      },
      {
        id: uuid(),
        title: "Angebotserstellung",
        description: "Erstellung eines detaillierten Angebots mit Kostenaufstellung",
        status: "completed",
        dueDate: createDate(-5),
        completionDate: createDate(-6),
        notes: "Angebot wurde intern geprüft und freigegeben"
      },
      {
        id: uuid(),
        title: "Präsentation vor dem Stadtrat",
        description: "Präsentation des Angebots vor dem Stadtrat",
        status: "pending",
        dueDate: createDate(5),
        completionDate: null,
        notes: ""
      }
    ]
  },
  {
    id: uuid(),
    title: "Schulungsmanagementsystem für Bildungsträger",
    internalReference: "2023-002",
    externalReference: "BT-SCH-2023",
    client: "Bildungswerk Bayern",
    status: "submitted",
    createdAt: createDate(-45),
    updatedAt: createDate(-10),
    dueDate: createDate(-5),
    budget: 95000,
    description: "Entwicklung eines Systems zur Verwaltung von Schulungen, Teilnehmern und Dozenten für einen großen Bildungsträger.",
    location: "Nürnberg, Bayern",
    contactPerson: "Sandra Berger",
    contactEmail: "s.berger@bildungswerk-bayern.de",
    contactPhone: "+49 911 654321",
    notes: "Kunde wünscht modulares System mit Möglichkeit zur späteren Erweiterung.",
    milestones: [
      {
        id: uuid(),
        title: "Systemanalyse",
        description: "Analyse der bestehenden Systeme und Prozesse",
        status: "completed",
        dueDate: createDate(-30),
        completionDate: createDate(-32),
        notes: ""
      },
      {
        id: uuid(),
        title: "Konzepterstellung",
        description: "Erstellung eines detaillierten Konzepts für das neue System",
        status: "completed",
        dueDate: createDate(-20),
        completionDate: createDate(-21),
        notes: ""
      },
      {
        id: uuid(),
        title: "Angebotserstellung",
        description: "Erstellung eines Angebots mit Kostenaufstellung",
        status: "completed",
        dueDate: createDate(-15),
        completionDate: createDate(-14),
        notes: ""
      },
      {
        id: uuid(),
        title: "Präsentation",
        description: "Präsentation des Konzepts vor der Geschäftsführung",
        status: "completed",
        dueDate: createDate(-10),
        completionDate: createDate(-10),
        notes: "Präsentation wurde sehr positiv aufgenommen"
      }
    ]
  },
  {
    id: uuid(),
    title: "Digitalisierung der Lagerlogistik",
    internalReference: "2023-003",
    externalReference: "LOG-DIG-2023",
    client: "LogistikPro GmbH",
    status: "won",
    createdAt: createDate(-90),
    updatedAt: createDate(-30),
    dueDate: createDate(-40),
    budget: 180000,
    description: "Implementierung eines digitalisierten Lagerlogistiksystems inklusive Barcode-Scanner und Echtzeit-Bestandsmanagement.",
    location: "Frankfurt, Hessen",
    contactPerson: "Frank Schmitt",
    contactEmail: "f.schmitt@logistikpro.de",
    contactPhone: "+49 69 987654",
    notes: "Kunde hat bereits positive Erfahrungen mit unseren früheren Projekten gemacht.",
    milestones: [
      {
        id: uuid(),
        title: "Anforderungsanalyse",
        description: "Analyse der bestehenden Logistikprozesse",
        status: "completed",
        dueDate: createDate(-80),
        completionDate: createDate(-81),
        notes: ""
      },
      {
        id: uuid(),
        title: "Konzepterstellung",
        description: "Erstellung eines Konzepts für die Digitalisierung",
        status: "completed",
        dueDate: createDate(-70),
        completionDate: createDate(-72),
        notes: ""
      },
      {
        id: uuid(),
        title: "Angebotserstellung",
        description: "Erstellung eines detaillierten Angebots",
        status: "completed",
        dueDate: createDate(-60),
        completionDate: createDate(-62),
        notes: ""
      },
      {
        id: uuid(),
        title: "Vertragsverhandlung",
        description: "Verhandlung der Vertragsbedingungen",
        status: "completed",
        dueDate: createDate(-50),
        completionDate: createDate(-45),
        notes: "Vertrag wurde erfolgreich abgeschlossen"
      }
    ]
  },
  {
    id: uuid(),
    title: "Webseiten-Relaunch Handwerkskammer",
    internalReference: "2023-004",
    externalReference: "HWK-WEB-23",
    client: "Handwerkskammer Oberbayern",
    status: "draft",
    createdAt: createDate(-10),
    updatedAt: createDate(-10),
    dueDate: createDate(30),
    budget: 45000,
    description: "Kompletter Relaunch der Webseite der Handwerkskammer mit modernem Design und verbesserter Benutzerführung.",
    location: "Rosenheim, Bayern",
    contactPerson: "Maria Weber",
    contactEmail: "m.weber@hwk-oberbayern.de",
    contactPhone: "+49 8031 123789",
    milestones: [
      {
        id: uuid(),
        title: "Anforderungsworkshop",
        description: "Workshop zur Ermittlung der Anforderungen an die neue Webseite",
        status: "pending",
        dueDate: createDate(5),
        completionDate: null,
        notes: ""
      },
      {
        id: uuid(),
        title: "Designkonzept",
        description: "Erstellung eines Designkonzepts mit mehreren Varianten",
        status: "pending",
        dueDate: createDate(15),
        completionDate: null,
        notes: ""
      }
    ]
  },
  {
    id: uuid(),
    title: "KI-basierte Qualitätskontrolle für Automobilzulieferer",
    internalReference: "2023-005",
    externalReference: "AUTO-QS-2023",
    client: "AutoTeile GmbH",
    status: "lost",
    createdAt: createDate(-60),
    updatedAt: createDate(-30),
    dueDate: createDate(-40),
    description: "Entwicklung eines KI-Systems zur automatisierten Qualitätskontrolle in der Produktion von Automobilteilen.",
    location: "Stuttgart, Baden-Württemberg",
    contactPerson: "Dr. Klaus Schmidt",
    contactEmail: "k.schmidt@autoteile.de",
    contactPhone: "+49 711 456789",
    milestones: [
      {
        id: uuid(),
        title: "Erstgespräch",
        description: "Erstes Gespräch zur Anforderungsermittlung",
        status: "completed",
        dueDate: createDate(-55),
        completionDate: createDate(-55),
        notes: ""
      },
      {
        id: uuid(),
        title: "Angebotserstellung",
        description: "Erstellung eines Angebots für das KI-System",
        status: "completed",
        dueDate: createDate(-45),
        completionDate: createDate(-46),
        notes: ""
      },
      {
        id: uuid(),
        title: "Präsentation",
        description: "Präsentation des Angebots beim Kunden",
        status: "completed",
        dueDate: createDate(-40),
        completionDate: createDate(-40),
        notes: "Angebot wurde abgelehnt, da ein Mitbewerber ein günstigeres Angebot vorgelegt hat."
      }
    ]
  }
];
