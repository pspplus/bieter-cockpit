
import { format } from "date-fns";
import { Tender } from "@/types/tender";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MilestoneProcess } from "@/components/tender/MilestoneProcess";
import { Edit, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { statusDisplayMap } from "@/utils/statusUtils";

interface TenderDetailsProps {
  tender: Tender;
  onOpenDetailsDialog?: () => void;
  onOpenContactDialog?: () => void;
}

export function TenderDetails({ tender, onOpenDetailsDialog, onOpenContactDialog }: TenderDetailsProps) {
  const { t } = useTranslation();
  const formattedCreatedAt = format(new Date(tender.createdAt), "PP");
  const formattedDueDate = format(new Date(tender.dueDate), "PP");
  const formattedBindingPeriodDate = tender.bindingPeriodDate 
    ? format(new Date(tender.bindingPeriodDate), "PP") 
    : null;

  return (
    <div className="space-y-6">
      {/* Progress Card - Now first */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("milestones.progress")}</CardTitle>
        </CardHeader>
        <CardContent>
          <MilestoneProcess milestones={tender.milestones} tenderId={tender.id} />
        </CardContent>
      </Card>

      {/* Information Cards Side by Side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tender Information Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3 flex flex-row justify-between items-start">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>{t("tenderDetails.tenderInformation")}</CardTitle>
                <CardDescription>{t("tenderDetails.created")}: {formattedCreatedAt}</CardDescription>
              </div>
            </div>
            {onOpenDetailsDialog && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onOpenDetailsDialog} 
                className="h-8 w-8"
                title={t("tenderDetails.editDetails", "Ausschreibungsdetails bearbeiten")}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">{t("tender.title")}</div>
                <div className="text-sm">{tender.title}</div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("tender.externalReference")}</div>
                <div className="text-sm">{tender.externalReference}</div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("tender.client")}</div>
                <div className="text-sm">{tender.client}</div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("Status")}</div>
                <div className="text-sm">
                  <Badge variant="outline">{statusDisplayMap[tender.status]}</Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">{t("tenderDetails.due")}</div>
                <div className="text-sm">{formattedDueDate}</div>
              </div>
              {formattedBindingPeriodDate && (
                <div>
                  <div className="text-sm font-medium">{t("tender.bindingPeriodDate")}</div>
                  <div className="text-sm">{formattedBindingPeriodDate}</div>
                </div>
              )}
              {tender.budget && (
                <div>
                  <div className="text-sm font-medium">{t("tender.budget")}</div>
                  <div className="text-sm">{tender.budget.toLocaleString()} €</div>
                </div>
              )}
              {tender.location && (
                <div>
                  <div className="text-sm font-medium">{t("tender.location")}</div>
                  <div className="text-sm">{tender.location}</div>
                </div>
              )}
            </div>
            
            {/* Fields that take more space stay in one column */}
            <div className="grid grid-cols-1 gap-4 mt-4">
              {tender.evaluationScheme && (
                <div>
                  <div className="text-sm font-medium">{t("tender.evaluationScheme")}</div>
                  <div className="text-sm whitespace-pre-wrap">{tender.evaluationScheme}</div>
                </div>
              )}
              {tender.conceptRequired !== undefined && (
                <div>
                  <div className="text-sm font-medium">{t("tender.conceptRequired")}</div>
                  <div className="text-sm">{tender.conceptRequired ? t("yes") : t("no")}</div>
                </div>
              )}
              {tender.description && (
                <div>
                  <div className="text-sm font-medium">{t("tender.description")}</div>
                  <div className="text-sm whitespace-pre-wrap">{tender.description}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3 flex flex-row justify-between items-start">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>{t("tenderDetails.contactInformation")}</CardTitle>
            </div>
            {onOpenContactDialog && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onOpenContactDialog}
                className="h-8 w-8"
                title={t("tenderDetails.editContact", "Kontaktinformationen bearbeiten")}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {tender.contactPerson || tender.contactEmail || tender.contactPhone ? (
              <div className="grid gap-4">
                {tender.contactPerson && (
                  <div>
                    <div className="text-sm font-medium">{t("tender.contactPerson")}</div>
                    <div className="text-sm">{tender.contactPerson}</div>
                  </div>
                )}
                {tender.contactEmail && (
                  <div>
                    <div className="text-sm font-medium">{t("tenderDetails.email")}</div>
                    <div className="text-sm">
                      <a href={`mailto:${tender.contactEmail}`} className="text-primary hover:underline">
                        {tender.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
                {tender.contactPhone && (
                  <div>
                    <div className="text-sm font-medium">{t("tenderDetails.phone")}</div>
                    <div className="text-sm">
                      <a href={`tel:${tender.contactPhone}`} className="text-primary hover:underline">
                        {tender.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {t("tenderDetails.noContactInfo")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
