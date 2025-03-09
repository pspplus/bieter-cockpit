
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTender } from "@/hooks/useTender";
import { TenderStatus } from "@/types/tender";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getStatusColors } from "@/utils/statusUtils";

export default function SubmissionsPage() {
  const { t } = useTranslation();
  const { tenders } = useTender();
  const [filterStatus, setFilterStatus] = useState<TenderStatus | "all">("all");
  
  // Define submission statuses to include the "abgeschlossen" status
  const submissionStatuses: TenderStatus[] = ["abgegeben", "aufklaerung", "gewonnen", "verloren", "abgeschlossen"];
  
  // Filter tenders that are in submitted status or beyond (won, lost, completed)
  const submittedTenders = tenders.filter(tender => 
    submissionStatuses.includes(tender.status as TenderStatus)
  );
  
  // Apply additional filter if selected
  const filteredTenders = filterStatus === "all" 
    ? submittedTenders 
    : submittedTenders.filter(tender => tender.status === filterStatus);
  
  // Sort by submission date (most recent first)
  const sortedTenders = [...filteredTenders].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const getStatusBadgeStyles = (status: TenderStatus) => {
    const statusColor = getStatusColors(status);
    return `${statusColor.bg} ${statusColor.text} dark:bg-${status === 'abgegeben' ? 'blue' : status === 'aufklaerung' ? 'purple' : status === 'gewonnen' ? 'green' : status === 'abgeschlossen' ? 'indigo' : 'gray'}-900/30 dark:text-${status === 'abgegeben' ? 'blue' : status === 'aufklaerung' ? 'purple' : status === 'gewonnen' ? 'green' : status === 'abgeschlossen' ? 'indigo' : 'gray'}-400`;
  };

  // Get display reference - use internal reference as primary, fallback to external reference
  const getDisplayReference = (tender) => {
    return tender.internalReference || tender.externalReference || "-";
  };

  return (
    <Layout title={t('submissions')}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                {filterStatus === "all" 
                  ? t('allSubmissions') 
                  : t(`tenders.${filterStatus}`)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup 
                value={filterStatus} 
                onValueChange={(value) => setFilterStatus(value as TenderStatus | "all")}
              >
                <DropdownMenuRadioItem value="all">
                  {t('allSubmissions')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="abgegeben">
                  {t('tenders.abgegeben')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="aufklaerung">
                  {t('tenders.aufklaerung')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="gewonnen">
                  {t('tenders.gewonnen')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="verloren">
                  {t('tenders.verloren')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="abgeschlossen">
                  {t('tenders.abgeschlossen')}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {sortedTenders.length > 0 ? (
          <div className="grid gap-6">
            {sortedTenders.map((tender) => (
              <Card key={tender.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-1">{tender.title}</CardTitle>
                      <CardDescription>
                        {t('tender.referenz')}: {getDisplayReference(tender)}
                      </CardDescription>
                    </div>
                    <div className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getStatusBadgeStyles(tender.status)
                    )}>
                      {t(`tenders.${tender.status}`)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium text-tender-500 dark:text-tender-400">
                        {t('tender.vergabestelle')}
                      </div>
                      <div>{tender.client || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-tender-500 dark:text-tender-400">
                        {t('submittedDate')}
                      </div>
                      <div>
                        {new Date(tender.updatedAt).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-tender-500 dark:text-tender-400">
                        {t('tender.budget')}
                      </div>
                      <div>
                        {tender.budget 
                          ? new Intl.NumberFormat('de-DE', { 
                              style: 'currency', 
                              currency: 'EUR' 
                            }).format(tender.budget) 
                          : "-"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" asChild>
                      <Link to={`/tenders/${tender.id}`} className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        {t('viewSubmission')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileCheck className="mx-auto h-12 w-12 text-tender-300 dark:text-tender-600" />
            <h3 className="mt-4 text-lg font-medium">
              {t('noSubmissionsFound')}
            </h3>
            <p className="mt-2 text-tender-500 dark:text-tender-400 max-w-md mx-auto">
              {filterStatus === "all"
                ? t('noSubmissionsCreated')
                : t('noSubmissionsWithStatus', { 
                    status: t(`tenders.${filterStatus}`) 
                  })}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
