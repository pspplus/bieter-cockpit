
import { Folder } from "@/types/tender";
import { DocumentAIAnalysis } from "@/components/document/DocumentAIAnalysis";

interface AIAnalysisTabProps {
  tenderId: string;
  folders: Folder[];
  onAnalysisComplete: (analysisResult: string) => Promise<void>;
}

export function AIAnalysisTab({
  tenderId,
  folders,
  onAnalysisComplete,
}: AIAnalysisTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <DocumentAIAnalysis
        tenderId={tenderId}
        folders={folders}
        onAnalysisComplete={onAnalysisComplete}
      />
      
      <div className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Über die KI-Analyse</h3>
          <p className="text-sm text-muted-foreground">
            Diese Funktion analysiert PDF-, Word- und Excel-Dokumente in den folgenden Ordnern:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• 01 Dateien für Angebot</li>
            <li>• 02 Leistungsverzeichnis</li>
            <li>• 03 Zusätzliche Informationen</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Die Ergebnisse der Analyse werden zu den Notizen der Ausschreibung hinzugefügt.
          </p>
        </div>
      </div>
    </div>
  );
}
