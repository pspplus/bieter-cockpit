
import { useState, useEffect } from "react";
import { Tender } from "@/types/tender";
import { fetchRelatedTendersByClient } from "@/services/tenderService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getStatusDisplay, getStatusColors } from "@/utils/statusUtils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface RelatedTendersCardProps {
  tender: Tender;
}

export function RelatedTendersCard({ tender }: RelatedTendersCardProps) {
  const [relatedTenders, setRelatedTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRelatedTenders = async () => {
      if (!tender.client) return;
      
      try {
        setIsLoading(true);
        const tenders = await fetchRelatedTendersByClient(tender.client, tender.id);
        setRelatedTenders(tenders);
      } catch (error) {
        console.error("Fehler beim Laden verwandter Ausschreibungen:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedTenders();
  }, [tender.client, tender.id]);

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd.MM.yyyy", { locale: de });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Vergabestellen-Historie</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : relatedTenders.length > 0 ? (
          <div className="space-y-2">
            {relatedTenders.map((relatedTender) => {
              const statusColors = getStatusColors(relatedTender.status);
              return (
                <Link 
                  to={`/tenders/${relatedTender.id}`} 
                  key={relatedTender.id}
                  className="block p-3 border rounded-md hover:bg-muted/30 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{relatedTender.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(relatedTender.createdAt)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                      {getStatusDisplay(relatedTender.status)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Keine früheren Ausschreibungen für diese Vergabestelle gefunden
          </div>
        )}
      </CardContent>
    </Card>
  );
}
