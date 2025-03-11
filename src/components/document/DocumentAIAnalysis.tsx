
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
    "Analysiere die folgenden Dokumente und beantworte diese Fragen:\n" +
    "1. Worum geht es in dieser Ausschreibung?\n" +
    "2. Welche Anforderungen werden gestellt?\n" +
    "3. Gibt es besondere Qualifikationen oder Zertifikate, die verlangt werden?\n" +
    "4. Wie ist der Zeitrahmen für die Auftragsausführung?\n" +
    "5. Gibt es Besonderheiten, auf die wir achten sollten?"
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
