
import { Tender } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, BrainCircuit } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NotesCardProps {
  tender: Tender;
}

export function NotesCard({ tender }: NotesCardProps) {
  const { t } = useTranslation();

  if (!tender.notes) return null;

  // Check if there's an AI analysis section in the notes
  const hasAIAnalysis = tender.notes.includes("--- KI-ANALYSE");

  // Split the notes into regular notes and AI analysis if present
  let regularNotes = tender.notes;
  let aiAnalysis = null;

  if (hasAIAnalysis) {
    const parts = tender.notes.split("--- KI-ANALYSE");
    regularNotes = parts[0].trim();
    aiAnalysis = "--- KI-ANALYSE" + parts[1];
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>{t("tender.notes", "Notizen")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] pr-4">
          {regularNotes && regularNotes.length > 0 && (
            <div className="whitespace-pre-wrap">{regularNotes}</div>
          )}
          
          {aiAnalysis && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="h-5 w-5 text-indigo-500" />
                <h3 className="font-medium">KI-Analyse Ergebnisse</h3>
              </div>
              <div className="whitespace-pre-wrap text-sm bg-muted p-3 rounded-md">
                {aiAnalysis.replace("--- KI-ANALYSE", "").trim()}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
