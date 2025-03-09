
import { Tender } from "@/types/tender";
import { v4 as uuidv4 } from "uuid";

// Hilfsfunktion zur Erstellung von Meilensteinen mit sequentiellen Nummern
const createMilestones = (count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: uuidv4(),
    sequenceNumber: index + 1,
    title: `Meilenstein ${index + 1}`,
    description: `Beschreibung für Meilenstein ${index + 1}`,
    status: Math.random() > 0.5 ? "completed" : "pending" as "completed" | "pending",
    dueDate: new Date(Date.now() + (index + 1) * 86400000),
    completionDate: Math.random() > 0.5 ? new Date() : null,
    notes: `Notizen für Meilenstein ${index + 1}`
  }));
};

export const mockTenders: Tender[] = [
  {
    id: "1887fbb0-606a-4a39-b094-686076ec5972",
    title: "Neubau Feuerwehrgebäude Musterhausen",
    description: "Ausschreibung für den Neubau eines Feuerwehrgebäudes in Musterhausen.",
    internalReference: "FW-2023-05",
    externalReference: "VGR-2023-123456",
    client: "Stadt Musterhausen",
    status: "in-bearbeitung", // Alias: active
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-20"),
    dueDate: new Date("2023-07-20"),
    submissionMethod: "Elektronisch via E-Vergabe-Plattform",
    estimatedValue: 1750000,
    contactPerson: "Max Mustermann",
    contactEmail: "m.mustermann@musterhausen.de",
    contactPhone: "+49123456789",
    location: "Musterhausen, Deutschland",
    notes: "Wichtige Kontakte: Architekturbüro Schmidt & Partner",
    milestones: [
      {
        id: uuidv4(),
        sequenceNumber: 1,
        title: "Ausschreibungsunterlagen analysieren",
        description: "Detaillierte Analyse aller Ausschreibungsunterlagen",
        status: "completed",
        dueDate: new Date("2023-05-18"),
        completionDate: new Date("2023-05-17"),
        notes: "Alle Unterlagen wurden gesichtet und wichtige Anforderungen markiert."
      },
      {
        id: uuidv4(),
        sequenceNumber: 2,
        title: "Team zusammenstellen",
        description: "Projektteam für die Angebotsbearbeitung zusammenstellen",
        status: "completed",
        dueDate: new Date("2023-05-20"),
        completionDate: new Date("2023-05-19"),
        notes: "Team besteht aus: Projektleiter, Architekt, Statiker, Bauingenieur, Elektroplaner"
      },
      {
        id: uuidv4(),
        sequenceNumber: 3,
        title: "Angebotskalkulation",
        description: "Detaillierte Kostenberechnung für alle Gewerke",
        status: "pending",
        dueDate: new Date("2023-06-15"),
        completionDate: null,
        notes: "Kalkulationsgrundlage: LV aus Ausschreibung plus 5% Puffer"
      }
    ]
  },
  {
    id: "2ea5af48-6337-4c01-ab1e-e8c045debf21",
    title: "Wartung und Betrieb Abwasserpumpwerk",
    description: "5-Jahresvertrag für die Wartung und den Betrieb des Abwasserpumpwerks Nord",
    internalReference: "APW-2023-07",
    externalReference: "AW-2023-578",
    client: "Stadtwerke Beispielstadt",
    status: "abgegeben", // Alias: submitted
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-04-25"),
    dueDate: new Date("2023-05-01"),
    submissionMethod: "Papierform, zweifache Ausfertigung",
    estimatedValue: 780000,
    contactPerson: "Erika Beispiel",
    contactEmail: "e.beispiel@stadtwerke-beispielstadt.de",
    contactPhone: "+49987654321",
    location: "Beispielstadt, Deutschland",
    notes: "Besonderheiten: 24/7 Bereitschaftsdienst erforderlich",
    milestones: [
      {
        id: uuidv4(),
        sequenceNumber: 1,
        title: "Anforderungsanalyse",
        description: "Analyse der technischen und vertraglichen Anforderungen",
        status: "completed",
        dueDate: new Date("2023-03-15"),
        completionDate: new Date("2023-03-14"),
        notes: "Technische Analyse abgeschlossen, besondere Herausforderungen dokumentiert"
      },
      {
        id: uuidv4(),
        sequenceNumber: 2,
        title: "Ortsbegehung",
        description: "Besichtigung des Abwasserpumpwerks",
        status: "completed",
        dueDate: new Date("2023-03-20"),
        completionDate: new Date("2023-03-18"),
        notes: "Vor-Ort-Besichtigung mit Teamleiter durchgeführt, Fotodokumentation erstellt"
      },
      {
        id: uuidv4(),
        sequenceNumber: 3,
        title: "Angebotserstellung",
        description: "Erstellung des schriftlichen Angebots",
        status: "completed",
        dueDate: new Date("2023-04-15"),
        completionDate: new Date("2023-04-10"),
        notes: "Angebot mit allen erforderlichen Unterlagen erstellt"
      },
      {
        id: uuidv4(),
        sequenceNumber: 4,
        title: "Angebotsabgabe",
        description: "Fristgerechte Abgabe des Angebots",
        status: "completed",
        dueDate: new Date("2023-04-25"),
        completionDate: new Date("2023-04-24"),
        notes: "Angebot persönlich eingereicht, Eingangsbestätigung erhalten"
      }
    ]
  },
  {
    id: "d14c3ef4-3a6e-47ec-9742-14b32a6c0bc3",
    title: "Smart City Beleuchtungskonzept",
    description: "Rahmenvertrag zur Modernisierung der Straßenbeleuchtung mit Smart City Funktionen",
    internalReference: "SCB-2023-09",
    externalReference: "SCMV-2023-42",
    client: "Gemeinde Neustadt",
    status: "gewonnen", // Alias: won
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-03-15"),
    dueDate: new Date("2023-02-28"),
    submissionMethod: "Elektronisch per E-Mail",
    estimatedValue: 1250000,
    contactPerson: "Thomas Neumann",
    contactEmail: "t.neumann@neustadt-gemeinde.de",
    contactPhone: "+49135792468",
    location: "Neustadt, Deutschland",
    notes: "Auftragsvolumen für erste Phase: 250.000 EUR",
    milestones: [
      {
        id: uuidv4(),
        sequenceNumber: 1,
        title: "Bestandsaufnahme",
        description: "Analyse der vorhandenen Beleuchtungsinfrastruktur",
        status: "completed",
        dueDate: new Date("2023-01-25"),
        completionDate: new Date("2023-01-24"),
        notes: "Vollständige Dokumentation der vorhandenen Beleuchtungssysteme"
      },
      {
        id: uuidv4(),
        sequenceNumber: 2,
        title: "Konzepterstellung",
        description: "Technisches und wirtschaftliches Konzept",
        status: "completed",
        dueDate: new Date("2023-02-10"),
        completionDate: new Date("2023-02-08"),
        notes: "Innovatives Konzept mit LED-Umrüstung und Smart-City-Integration"
      },
      {
        id: uuidv4(),
        sequenceNumber: 3,
        title: "Angebotskalkulation",
        description: "Detaillierte Preiskalkulation",
        status: "completed",
        dueDate: new Date("2023-02-20"),
        completionDate: new Date("2023-02-15"),
        notes: "Wirtschaftlichkeitsberechnung mit ROI nach 5 Jahren"
      },
      {
        id: uuidv4(),
        sequenceNumber: 4,
        title: "Angebotspräsentation",
        description: "Vorstellung des Konzepts beim Kunden",
        status: "completed",
        dueDate: new Date("2023-02-25"),
        completionDate: new Date("2023-02-23"),
        notes: "Präsentation vor Gemeindevorstand erfolgreich"
      }
    ]
  },
  {
    id: "a6d8a6b2-aa35-4c0e-9ab3-cd8d06b0929d",
    title: "Schulcampus Digitalisierung Phase 2",
    description: "Erweiterung der digitalen Infrastruktur für den Schulcampus Musterbach",
    internalReference: "DIGI-2023-04",
    externalReference: "SCH-2023-99",
    client: "Schulverband Musterbach",
    status: "entwurf", // Alias: draft
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-06-01"),
    dueDate: new Date("2023-07-31"),
    submissionMethod: "Online-Portal Vergabeplattform",
    estimatedValue: 350000,
    contactPerson: "Dr. Maria Schmidt",
    contactEmail: "m.schmidt@schulverband-musterbach.de",
    contactPhone: "+49246813579",
    location: "Musterbach, Deutschland",
    notes: "Aufbauend auf Phase 1, die wir bereits erfolgreich abgeschlossen haben",
    milestones: [
      {
        id: uuidv4(),
        sequenceNumber: 1,
        title: "Anforderungsanalyse",
        description: "Analyse der Anforderungen aus Phase 2",
        status: "pending",
        dueDate: new Date("2023-06-10"),
        completionDate: null,
        notes: "Fokus auf neue Klassenzimmer und Verwaltungsbereich"
      },
      {
        id: uuidv4(),
        sequenceNumber: 2,
        title: "Technisches Konzept",
        description: "Erstellung des technischen Konzepts für Phase 2",
        status: "pending",
        dueDate: new Date("2023-06-20"),
        completionDate: null,
        notes: "Integration mit vorhandener Infrastruktur aus Phase 1"
      }
    ]
  },
  {
    id: "f9c7b6a5-d8e4-4f3a-2b1c-0a9b8c7d6e5f",
    title: "Energetische Sanierung Rathaus",
    description: "Energetische Sanierung des historischen Rathauses der Stadt Altdorf",
    internalReference: "RATH-2023-01",
    externalReference: "ES-2023-005",
    client: "Stadt Altdorf",
    status: "verloren", // Alias: lost
    createdAt: new Date("2022-11-10"),
    updatedAt: new Date("2023-01-20"),
    dueDate: new Date("2022-12-15"),
    submissionMethod: "Schriftlich per Post",
    estimatedValue: 890000,
    contactPerson: "Jürgen Altmann",
    contactEmail: "j.altmann@altdorf-stadt.de",
    contactPhone: "+4935791246",
    location: "Altdorf, Deutschland",
    notes: "Denkmalschutzauflagen beachten",
    milestones: [
      {
        id: uuidv4(),
        sequenceNumber: 1,
        title: "Bestandsaufnahme",
        description: "Analyse des Ist-Zustands und Energiebilanz",
        status: "completed",
        dueDate: new Date("2022-11-20"),
        completionDate: new Date("2022-11-18"),
        notes: "Energieausweis und Thermografie erstellt"
      },
      {
        id: uuidv4(),
        sequenceNumber: 2,
        title: "Sanierungskonzept",
        description: "Erstellung des Sanierungskonzepts unter Beachtung der Denkmalschutzauflagen",
        status: "completed",
        dueDate: new Date("2022-11-30"),
        completionDate: new Date("2022-11-28"),
        notes: "Konzept mit Denkmalschutzamt abgestimmt"
      },
      {
        id: uuidv4(),
        sequenceNumber: 3,
        title: "Angebotserstellung",
        description: "Erstellung des detaillierten Angebots",
        status: "completed",
        dueDate: new Date("2022-12-10"),
        completionDate: new Date("2022-12-08"),
        notes: "Angebot mit allen erforderlichen Unterlagen erstellt"
      }
    ]
  }
];

export const getEmptyTender = (): Omit<Tender, "id" | "createdAt" | "updatedAt" | "milestones"> => {
  return {
    title: "",
    description: "",
    internalReference: "",
    externalReference: "",
    client: "",
    status: "entwurf",
    dueDate: new Date(),
    submissionMethod: "",
    estimatedValue: null,
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    location: "",
    notes: "",
  };
};
