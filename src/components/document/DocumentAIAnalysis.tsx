
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { TenderDocument, Folder } from "@/types/tender";
import { fetchFolderDocuments } from "@/services/documentService";
import { useTranslation } from "react-i18next";
import { analyzeDocumentsWithAI } from "@/services/aiAnalysisService";
import { Textarea } from "@/components/ui/textarea";

interface DocumentAIAnalysisProps {
  tenderId: string;
  folders: Folder[];
  onAnalysisComplete: (analysisResult: string) => Promise<void>;
}

export function DocumentAIAnalysis({ tenderId, folders, onAnalysisComplete }: DocumentAIAnalysisProps) {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [relevantDocuments, setRelevantDocuments] = useState<TenderDocument[]>([]);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>(
    `Du bist Experte für Vergaberecht und für öffentliche Ausschreibungen und sollst nun Daten raussuchen aus den Unterlagen.
Erstelle eine strukturierte Übersicht, die den Dokumentenname, also die Quelle der gefundenen Information, den Fundort mit der entsprechenden Seitenzahl oder dem Abschnitt im Dokument sowie ein Snippet enthält, das einen kurzen Textausschnitt zeigt und den Kontext des Suchbegriffs verdeutlicht.
Falls Informationen nur in gescannter oder bildbasierter Form vorliegen, führe eine Texterkennung (OCR) durch, um sicherzustellen, dass alle relevanten Inhalte durchsucht werden.
Fasse die Antwort dabei so kurz wie möglich. 

Gib am Ende eine tabellarische Zusammenfassung.


Vergabeplattform: 
Auf welcher Vergabeplattform ist die Ausschreibung einzureichen?  

Abgabe mit Uhrzeit:
Wann muss das Angebot eingehen?  
Suche nach Begriffen wie „Angebotsfrist", "Frist zur Angebotsabgabe" und beachte, dass diese Information oft nah bei dem Begriff "Bindefrist" zu finden ist 

Bindefrist: 
Wann endet die Bindefrist? 

Mindestanforderungen: 

Überprüfe die Vergabeunterlagen auf alle Mindestanforderungen, die für die Angebotsabgabe relevant sind.
Mindestanforderungen an den Bieter
Frage: Welche Mindestanforderungen gibt es an den Bieter?
Suchbegriffe: „Mindestanforderungen", „Anforderungen Bieter", „Voraussetzungen", „technische und berufliche Leistungsfähigkeit", „wirtschaftliche und finanzielle Leistungsfähigkeit".
Ziel: Ermittle, ob der Bieter spezifische Qualifikationen, Referenzen oder Erfahrungen nachweisen muss.
Zertifikate und Nachweise
Frage: Welche Zertifikate muss der Bieter nachweisen?
Suchbegriffe: „Zertifikate", „Nachweise", „Bieter-Zertifikate", „ISO 9001", „ISO 14001", „ISO 45001", „Sicherheitsüberprüfung", „Luftsicherheitsschulung", „Desinfekteur", „Industriekletterer".
Ziel: Identifiziere, ob Standardzertifikate (z. B. ISO 9001, 14001) oder besondere Zertifizierungen erforderlich sind (z. B. erweiterte Sicherheitsüberprüfungen, Spezialschulungen).
Zwingend einzureichende Unterlagen
Frage: Welche Unterlagen sind zwingend bei Angebotsabgabe vom Bieter einzureichen?
Suchbegriffe: „zwingend einzureichen", „Angebotsunterlagen", „erforderliche Dokumente", „Besondere Bewerbungsbedingungen", „Handelsregisterauszug", „Eigenerklärung", „Referenzen", „Verpflichtungserklärung".
Ziel: Bestimme, welche Dokumente für die Angebotswertung erforderlich sind und ob fehlende Unterlagen zum Ausschluss führen können.
Eignungskriterien für den Bieter
Frage: Welche Eignungskriterien gibt es?
Suchbegriffe: „Eignungskriterien", „Bietereignung", „Vergabekriterien", „technische Eignung", „wirtschaftliche Eignung", „fachliche Qualifikation", „Referenzanforderungen".
Ziel: Stelle fest, ob Anforderungen zur Berufsausübung (z. B. Handelsregistereintrag), finanzielle Kennzahlen oder besondere Qualifikationen erforderlich sind.
Besondere Anforderungen (abweichend von Standardvorgaben)
Frage: Gibt es spezielle Anforderungen, die über die Standardvorgaben hinausgehen?
Suchbegriffe: „Führungszeugnis", „erweitertes Führungszeugnis", „Sicherheitsüberprüfung Grad 2/3", „Luftsicherheitsschulung", „Desinfekteur", „Industriekletterer", „besondere Schulungen", „spezielle Maschinenanforderungen".
Ziel: Identifiziere besondere Anforderungen, die über Standardanforderungen hinausgehen, und hebe sie gesondert hervor.
Am Ende der Analyse:
Einstufung der Ausschreibung: Handelt es sich um Standardanforderungen (z. B. ISO-Zertifikate, Handelsregisterauszug, Referenzen) oder um besondere Bedingungen (z. B. erweiterte Sicherheitsüberprüfung, Spezialqualifikationen, besondere Schulungen)?
Falls besondere Anforderungen vorliegen, liste diese gesondert auf und begründe, warum sie als Abweichung vom Standard gelten.

Objektbesichtigung erforderlich: 
Ist eine Objektbesichtigung/ Objektbegehung verpflichtend? 
Bis wann muss der Bieter sich zur Objektbesichtigung anmelden?  
Wie muss der Bieter sich zur Objektbesichtigung anmelden?  
wer ist die Ansprechperson und wie kann man sie erreichen?

Losabgabe: 
Ist die Ausschreibung in Lose bzw. Fachlose aufgeteilt?  
Auf wie viele Lose kann der Bieter den Zuschlag erhalten?  
Welche Leistungen sind ausgeschrieben?  Bitte gib hier pro Los an welche Leistung hier gefordert wird (Bsp: Los 1: UHR, Los 2: GR)
wie viele lose gibt es 

Objektart: 
Um welche Objektart handelt es sich bei der ausgeschriebenen Leistung?  
welche Besonderheiten gibt es bei der Objektart zu beachten?

Wertungsschema: 
Wie laut das Wertungsschema? Wie lauten die Zuschlagskriterien?  
Gib genau die Gewichtung an für die Zuschlagskriterien
Formatiere die Ergebnisse in folgendem Format: ‚Kriterium1: XX%, Kriterium2: XX%, …'  

Konzept: 
Muss vom Bieter ein Konzept eingereicht werden?  
Wie lauten die Fragen im Konzept?  
Welche Gewichtung haben die einzelnen Bestandteile im Konzept?

Vertragsart: (Dienstvertrag oder Werkvertrag)
Analysiere den Vertrag und bestimme, ob es sich um einen Dienstvertrag oder einen Werkvertrag handelt. Beachte, dass es sich in der Regel um einen Dienstvertrag handelt. 
Prüfe die Vertragsart anhand folgender Kriterien:
Werkvertrag: Falls die erbrachte Leistung als Erfolg geschuldet wird, der Vertrag ein festgelegtes Budget enthält, der Auftragnehmer das Personal stellt und nur die erbrachte Leistung entscheidend ist.
Dienstvertrag: Falls die Arbeitsleistung selbst geschuldet wird, keine erfolgsabhängige Verpflichtung besteht oder der Vertrag auf fortlaufende Tätigkeiten ohne konkrete Erfolgsgarantie ausgerichtet ist.
Suche gezielt nach relevanten Begriffen:
"Vertragsart", "Dienstvertrag", "Werkvertrag", "Erfolg geschuldet", "Leistungspflicht", "Abnahme", "Nachbesserung", "Vergütung", "Personalgestellung", "Aufwand", "Erfolgsverpflichtung", "Stunden", "Mindeststunden", "Stundennachweis", "Kürzung", "Abzug".
Gib eine eindeutige Klassifizierung ab:
Vertragsart: Werkvertrag oder Dienstvertrag.
Begründung: Welche Vertragsklauseln sprechen für die jeweilige Einordnung?
Falls die Ausschreibung von einer neuen Vergabestelle stammt, prüfe, ob besondere Regelungen zur Vertragsart enthalten sind. Stelle sicher, dass deine Antwort mit einem direkten Zitat oder einer fundierten Quellenangabe aus dem Vertrag belegt ist.

Leistungswertvorgaben/ Stundenvorgaben: 
Überprüfe die Vergabeunterlagen auf spezifische Vorgaben zu Leistungswerten, Stundenvorgaben und Mindestanforderungen an das Reinigungspersonal.
Leistungswertvorgaben und Stundenvorgaben
Suche nach: „Leistungswertvorgaben", „Leistungswert", „Leistungskennzahlen", „Stundenvorgaben", „Richtwerte", „Richtleistung", „Mindestleistungen", „Leistungskriterien", „Jahresreinigungsstunden", „Produktive Jahresreinigungsstunden".
Prüfe, ob es bindende Mindestanforderungen oder empfohlene Richtwerte für Reinigungsleistungen gibt.
Ausschlusskriterien bei Abweichungen
Suche nach: „Überschreitung Richtwerte", „Unterschreitung Richtwerte", „Ausschlusskriterium".
Überprüfe, ob eine zu geringe oder zu hohe Angabe von Leistungswerten zum Ausschluss eines Angebots führen kann.
Mindeststunden für den Vorarbeiter
Suche nach: „Mindeststunden Vorarbeiter", „Arbeitszeit Vorarbeiter", „Pflichtstunden Vorarbeiter".
Prüfe, ob für den Vorarbeiter festgelegte Mindestanwesenheitszeiten oder spezifische Aufgaben vorgeschrieben sind.
Mindeststunden für den Objektleiter
Suche nach: „Mindeststunden Objektleiter", „Arbeitszeit Objektleiter", „Pflichtstunden Objektleiter".
Ermittle, ob der Objektleiter bestimmte Mindeststunden erfüllen muss und ob regelmäßige Präsenzzeiten oder Kontrollpflichten vorgeschrieben sind.

Jahresreinigungsfläche:
Wie hoch ist die Jahresreinigungsfläche der ausgeschriebenen Leistung pro Los?  

Waschtechnik vor Ort 

Überprüfe die Vergabeunterlagen auf Hinweise zur Möglichkeit, eine Waschmaschine oder Waschtechnik am Einsatzort zu platzieren.
Vorgaben zur Aufstellung von Geräten und Maschinen
Suche nach: „Waschmaschine", „Waschtechnik", „Gerätestellung", „Maschinenstellung", „Aufstellmöglichkeit", „technische Infrastruktur", „Anschlussmöglichkeiten", „Stromanschluss", „Wasseranschluss", „Geräteabstellraum", „Lagerraum", „Reinigungsmittelraum".
Prüfe, ob die Ausschreibung Vorgaben zur Aufstellung oder Nutzung eigener Maschinen enthält.
Bereitstellung durch den Auftraggeber
Suche nach: „bereitgestellte Maschinen", „Nutzung vorhandener Geräte", „Technik vor Ort", „Betriebsräume", „Zugang zu Wasch- und Reinigungstechnik".
Kläre, ob der Auftraggeber bereits Maschinen bereitstellt oder ob eigene Technik verwendet werden muss.
Raum- und Lagerkapazitäten für Maschinen
Suche nach: „Abstellraum", „Maschinenlager", „Technikraum", „Reinigungsraum", „Lagerflächen", „Stellfläche für Geräte".
Ermittle, ob es einen dedizierten Bereich für Maschinen gibt oder ob Platzmangel Einschränkungen für die Aufstellung bedeutet.
Technische Anschlüsse und Infrastruktur
Suche nach: „Wasseranschluss", „Abfluss", „Stromanschluss", „230V/400V-Anschluss", „Steckdose für Maschinen", „Sanitäranschluss", „Technische Ausstattung für Geräte".
Finde heraus, ob es am Einsatzort die notwendigen Anschlüsse für den Betrieb von Waschmaschinen gibt.
Nutzungseinschränkungen oder Genehmigungspflichten
Suche nach: „Genehmigung für Maschinen", „Nutzungsbeschränkung", „Vorgaben für Fremdgeräte", „Erlaubnis zur Gerätestellung".
Prüfe, ob für das Aufstellen einer Waschmaschine besondere Genehmigungen oder Abstimmungen mit dem Auftraggeber erforderlich sind.
Falls technische Anforderungen oder Beschränkungen vorliegen, stelle sicher, dass alle relevanten Informationen zur Nutzung und Infrastruktur berücksichtigt werden.


Tariflohn 

Überprüfe die Vergabeunterlagen auf alle relevanten Informationen zum Tariflohn, der für die Kalkulation der Reinigungsleistungen erforderlich ist.
Grundlegender Tariflohn und Mindestlöhne
Suche nach: „Tariflohn", „Mindestlohn", „Lohnkosten", „Vergütungsregelung", „Lohnsatz", „Stundenverrechnungssatz", „Tarifvertrag", „gesetzlicher Mindestlohn", „Gebäudereinigerhandwerk".
Ermittle, ob der allgemeinverbindliche Tarifvertrag des Gebäudereinigerhandwerks gilt oder ob besondere Lohnvorgaben in der Ausschreibung festgelegt sind.
Zusätzliche Lohnbestandteile und Zuschläge
Suche nach: „Zuschläge", „Nachtzuschlag", „Feiertagszuschlag", „Wochenendzuschlag", „Mehrarbeitszuschlag", „Zulagen", „Sonderzahlungen", „Schichtzulage", „branchenübliche Zulagen".
Kläre, ob es tarifliche oder vertragliche Zuschläge gibt, die in die Kalkulation einfließen müssen.
Verpflichtende Lohnaufschläge oder Mindestaufschlag
Suche nach: „Mindestaufschlag", „Kalkulationsvorgabe Lohn", „Kalkulationsgrundlage", „Lohnfaktor", „Mindestkostenaufschlag", „Tarifaufschlag".
Ermittle, ob ein Mindestaufschlag auf den Tariflohn vorgeschrieben ist (z. B. ein fester Prozentsatz für Sozialkosten, Verwaltung oder Unternehmensgewinne).
Zusätzliche Personalkosten und Sozialabgaben
Suche nach: „Sozialabgaben", „Arbeitgeberanteil", „Lohnnebenkosten", „Urlaubsrückstellung", „Krankenversicherung", „Rentenversicherung", „Arbeitslosenversicherung", „Lohnfortzahlung", „Sonderabgaben".
Berechne, welche zusätzlichen Kosten für Sozialversicherungen und Lohnnebenkosten in der Kalkulation berücksichtigt werden müssen.
Regionale oder branchenspezifische Besonderheiten
Suche nach: „Tariftreuegesetz", „öffentliche Auftragsvergabe Lohn", „Tarifbindung", „branchenspezifischer Lohn", „regionale Lohnvorgaben", „gesetzliche Vorgaben für öffentliche Ausschreibungen".
Prüfe, ob spezielle gesetzliche Vorschriften (z. B. Tariftreuepflicht in bestimmten Bundesländern) berücksichtigt werden müssen.
Vergleich mit bisherigen Tarifentwicklungen oder zukünftige Anpassungen
Suche nach: „Tariferhöhung", „Lohnanpassung", „Gültigkeit Tarifvertrag", „Lohnsteigerung", „Inflationsausgleich", „Gehaltsanpassung während der Vertragslaufzeit".
Finde heraus, ob künftige Tarifsteigerungen in der Kalkulation zu berücksichtigen sind.
Falls spezifische Berechnungen oder Vorschriften enthalten sind, stelle sicher, dass alle relevanten Informationen zur vollständigen Kalkulation des Tariflohns erfasst werden.


Qualitätskontrollen
Überprüfe die Vergabeunterlagen auf alle relevanten Informationen zu Qualitätskontrollen, Prüfmethoden und Sanktionen, die bei der Kalkulation berücksichtigt werden müssen.
Vorgaben für Qualitätskontrollen
Suche nach: „Qualitätskontrolle", „Qualitätsprüfung", „Reinigungskontrolle", „Kontrollsystem", „Abnahmeverfahren", „Leistungsprüfung", „Qualitätssicherung".
Kläre, ob regelmäßige Qualitätsprüfungen durch den Auftraggeber oder durch den Auftragnehmer selbst vorgesehen sind.
Prüfmethoden und Bewertungsmaßstäbe
Suche nach: „Qualitätsbewertung", „Prüfverfahren", „Bewertungssystem", „Prüfkriterien", „Mängelfeststellung", „DIN EN 13549", „BIV-Richtlinien", „AQL-Grenzwerte", „Reinigungsstichproben".
Ermittle, ob bestimmte Bewertungsmaßstäbe (z. B. Punktesysteme oder Fehlergrenzen) für die Qualitätssicherung genutzt werden.
Häufigkeit und Umfang der Prüfungen
Suche nach: „Prüfintervall", „Kontrollfrequenz", „monatliche Prüfung", „wöchentliche Kontrolle", „stichprobenartige Kontrolle", „tägliche Inspektionen".
Finde heraus, wie oft Qualitätskontrollen durchgeführt werden und ob alle oder nur bestimmte Bereiche überprüft werden.
Verantwortlichkeiten und Dokumentation
Suche nach: „Verantwortlicher für Qualitätskontrollen", „Qualitätsbeauftragter", „Dokumentationspflicht", „Kontrollberichte", „Prüfprotokolle", „Qualitätsmanagement".
Kläre, ob der Auftragnehmer eigene Qualitätskontrollen durchführen und dokumentieren muss oder ob dies durch externe Prüfer erfolgt.
Folgen von Mängeln und Abzügen
Suche nach: „Sanktionen bei Mängeln", „Preisabzüge", „Pönale", „Mängelbeseitigung", „Reklamationsprozess", „Leistungskürzung", „Nachbesserungspflicht".
Ermittle, ob finanzielle Kürzungen oder Vertragsstrafen bei schlechter Reinigungsqualität vorgesehen sind und ob Nachbesserungen ohne zusätzliche Vergütung erfolgen müssen.
Spezielle Prüfanforderungen bei Veranstaltungen oder Sonderreinigungen
Suche nach: „Eventkontrollen", „Sonderprüfung nach Veranstaltung", „Veranstaltungsreinigung Qualitätsanforderung", „Tiefenprüfung", „Kundenfeedback Kontrolle".
Finde heraus, ob es gesonderte Prüfungen nach Veranstaltungen oder besonderen Reinigungseinsätzen gibt.
Falls spezielle Kosten oder Zeitaufwände für Qualitätskontrollen entstehen, stelle sicher, dass alle relevanten Informationen für eine vollständige Kalkulation erfasst werden.


Raumgruppen
Überprüfe die Vergabeunterlagen auf alle relevanten Informationen zu Raumgruppen, Raumgruppentabellen und Flächen, die für die Kalkulation benötigt werden.
Identifikation der Raumgruppen und zugehörigen Flächen
Suche nach: „Raumgruppen", „Raumnutzungsgruppen", „Flächentabelle", „Raumtypen", „Reinigungsflächen", „Flächenaufstellung", „Nutzflächen".
Ermittle, welche Raumgruppen in der Ausschreibung definiert sind (z. B. Büros, Sanitärbereiche, Veranstaltungsräume, Technikräume).
Reinigungshäufigkeiten pro Raumgruppe
Suche nach: „Reinigungsplan", „Reinigungshäufigkeit", „Turnus der Reinigung", „Reinigungsintervalle", „tägliche Reinigung", „wöchentliche Reinigung", „monatliche Reinigung".
Bestimme, wie oft die einzelnen Raumgruppen gereinigt werden müssen.
Spezifische Reinigungsanforderungen pro Raumgruppe
Suche nach: „Raumspezifische Anforderungen", „Hygienestandards", „Bodenreinigung", „Oberflächenreinigung", „Sanitärreinigung", „technische Anlagen Reinigung".
Finde heraus, ob bestimmte Raumgruppen spezielle Reinigungsmethoden erfordern (z. B. Desinfektionspflicht in Sanitärbereichen).
Flächengrößen und Kalkulationsgrundlagen
Suche nach: „Flächenangaben", „Gesamtreinigungsfläche", „qm pro Raumgruppe", „Raumbuch", „Aufmaß".
Ermittle die Quadratmeterzahlen der einzelnen Raumgruppen, um die Gesamtflächen für die Kalkulation zu berechnen.
Zusätzliche Faktoren für die Kalkulation
Suche nach: „Sonderflächen", „Erschwerniszuschlag", „Zuschlagsfaktoren", „Materialkosten pro Raumgruppe", „Maschineneinsatz je Raumgruppe".
Kläre, ob bestimmte Raumgruppen besondere Reinigungstechniken oder Mehrkosten erfordern.`
  );

  // Find the specific folders we want to analyze
  const targetFolderNames = [
    "01 Dateien für Angebot", 
    "02 Leistungsverzeichnis", 
    "03 Zusätzliche Informationen"
  ];

  const findFolderIdsByName = (folderList: Folder[], targetNames: string[]): string[] => {
    const result: string[] = [];
    
    const searchFolders = (folders: Folder[]) => {
      folders.forEach(folder => {
        if (targetNames.includes(folder.name)) {
          result.push(folder.id);
        }
        if (folder.children && folder.children.length > 0) {
          searchFolders(folder.children);
        }
      });
    };
    
    searchFolders(folderList);
    return result;
  };

  // Get relevant documents from the specified folders
  useEffect(() => {
    const loadRelevantDocuments = async () => {
      try {
        const folderIds = findFolderIdsByName(folders, targetFolderNames);
        if (folderIds.length === 0) {
          console.log("Target folders not found");
          return;
        }

        const allDocuments: TenderDocument[] = [];
        for (const folderId of folderIds) {
          const folderDocs = await fetchFolderDocuments(folderId);
          // Filter for PDF, Word, and Excel files
          const filteredDocs = folderDocs.filter(doc => {
            const fileType = doc.fileType.toLowerCase();
            return fileType.includes('pdf') || 
                   fileType.includes('word') || 
                   fileType.includes('excel') ||
                   fileType.includes('spreadsheet') ||
                   fileType.includes('document') ||
                   fileType.includes('officedocument');
          });
          allDocuments.push(...filteredDocs);
        }
        
        setRelevantDocuments(allDocuments);
      } catch (error) {
        console.error("Error loading relevant documents:", error);
        setError("Fehler beim Laden der relevanten Dokumente");
      }
    };

    if (folders.length > 0) {
      loadRelevantDocuments();
    }
  }, [folders, tenderId]);

  const handleAnalyzeDocuments = async () => {
    if (relevantDocuments.length === 0) {
      toast.error("Keine relevanten Dokumente zum Analysieren gefunden");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Call the AI service to analyze documents
      const result = await analyzeDocumentsWithAI(
        relevantDocuments,
        customPrompt,
        (currentProgress) => {
          setProgress(currentProgress);
        }
      );
      
      setAnalysisResult(result);
      
      // Update tender details with the analysis results
      await onAnalysisComplete(result);
      
      toast.success("Dokumentenanalyse erfolgreich abgeschlossen");
    } catch (error) {
      console.error("Error analyzing documents:", error);
      setError("Fehler bei der KI-Analyse der Dokumente");
      toast.error("Fehler bei der KI-Analyse der Dokumente");
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          KI-Dokumentenanalyse
        </CardTitle>
        <CardDescription>
          Analysieren Sie Dokumente mit KI, um Informationen für die Ausschreibung zu extrahieren
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Relevante Dokumente:</span>
            <Badge variant="outline">{relevantDocuments.length}</Badge>
          </div>
          
          {relevantDocuments.length > 0 && (
            <div className="max-h-36 overflow-y-auto text-sm">
              <ul className="space-y-1">
                {relevantDocuments.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{doc.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="customPrompt" className="text-sm font-medium">
              Prompt für die KI-Analyse:
            </label>
            <Textarea
              id="customPrompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Geben Sie Ihre Fragestellungen für die KI-Analyse ein..."
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground">
              Definieren Sie hier spezifische Fragestellungen, die die KI bei der Analyse der Dokumente berücksichtigen soll.
            </p>
          </div>
          
          {relevantDocuments.length === 0 && !error && (
            <div className="text-center py-4 text-muted-foreground">
              Keine relevanten Dokumente in den angegebenen Ordnern gefunden
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Analysiere Dokumente...</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          
          {analysisResult && !isAnalyzing && (
            <div className="mt-4 p-3 bg-muted rounded-md text-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Analyse abgeschlossen</span>
              </div>
              <div className="max-h-40 overflow-y-auto whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAnalyzeDocuments} 
          disabled={isAnalyzing || relevantDocuments.length === 0}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Dokumente werden analysiert...
            </>
          ) : (
            "Dokumente mit KI analysieren"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
