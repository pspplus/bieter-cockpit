
import { Tender } from "@/types/tender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NotesCardProps {
  tender: Tender;
}

export function NotesCard({ tender }: NotesCardProps) {
  const { t } = useTranslation();

  if (!tender.notes) return null;

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>{t("tender.notes", "Notizen")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap">{tender.notes}</div>
      </CardContent>
    </Card>
  );
}
