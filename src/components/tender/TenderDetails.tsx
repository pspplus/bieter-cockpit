
import { Tender } from "@/types/tender";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Building, Phone, Mail, CreditCard, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface TenderDetailsProps {
  tender: Tender;
}

const statusColors: Record<Tender["status"], { bg: string; text: string }> = {
  draft: { bg: "bg-tender-100", text: "text-tender-600" },
  active: { bg: "bg-blue-100", text: "text-blue-600" },
  review: { bg: "bg-amber-100", text: "text-amber-600" },
  submitted: { bg: "bg-indigo-100", text: "text-indigo-600" },
  clarification: { bg: "bg-purple-100", text: "text-purple-600" },
  won: { bg: "bg-green-100", text: "text-green-600" },
  lost: { bg: "bg-red-100", text: "text-red-600" },
  completed: { bg: "bg-teal-100", text: "text-teal-600" },
};

export function TenderDetails({ tender }: TenderDetailsProps) {
  const { t } = useTranslation();
  const statusColor = statusColors[tender.status];
  
  // Calculate progress
  const completedMilestones = tender.milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const totalMilestones = tender.milestones.length;
  const progress = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : 0;

  // Format dates
  const createdAtFormatted = format(new Date(tender.createdAt), "MMMM d, yyyy");
  const dueDateFormatted = format(new Date(tender.dueDate), "MMMM d, yyyy");
  
  // Check if the due date is in the past
  const isDueDatePast = new Date(tender.dueDate) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{tender.title}</h1>
            <Badge className={cn(statusColor.bg, statusColor.text)}>
              {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
            </Badge>
          </div>
          <p className="text-tender-500 mt-1">{tender.reference}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
            isDueDatePast ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          )}>
            <Calendar className="h-4 w-4" />
            <span>{t('tenderDetails.due')}: {dueDateFormatted}</span>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tender-50 text-tender-600 text-sm">
            <FileText className="h-4 w-4" />
            <span>{t('tenderDetails.progress')}: {progress}%</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('tenderDetails.tenderInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <dt className="text-tender-500">{t('tender.client')}</dt>
              <dd className="font-medium flex items-center gap-1.5">
                <Building className="h-4 w-4 text-tender-400" />
                {tender.client}
              </dd>
              
              <dt className="text-tender-500">{t('tenderDetails.created')}</dt>
              <dd>{createdAtFormatted}</dd>
              
              {tender.location && (
                <>
                  <dt className="text-tender-500">{t('tender.location')}</dt>
                  <dd className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-tender-400" />
                    {tender.location}
                  </dd>
                </>
              )}
              
              {tender.budget && (
                <>
                  <dt className="text-tender-500">{t('tender.budget')}</dt>
                  <dd className="flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-tender-400" />
                    ${tender.budget.toLocaleString()}
                  </dd>
                </>
              )}
            </dl>
            
            {tender.description && (
              <div className="mt-4 pt-4 border-t border-tender-100">
                <h4 className="font-medium mb-2">{t('tender.description')}</h4>
                <p className="text-tender-600">{tender.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('tenderDetails.contactInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {tender.contactPerson ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <dt className="text-tender-500">{t('tender.contactPerson')}</dt>
                <dd className="font-medium flex items-center gap-1.5">
                  <User className="h-4 w-4 text-tender-400" />
                  {tender.contactPerson}
                </dd>
                
                {tender.contactEmail && (
                  <>
                    <dt className="text-tender-500">{t('tenderDetails.email')}</dt>
                    <dd className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-tender-400" />
                      <a 
                        href={`mailto:${tender.contactEmail}`}
                        className="text-primary hover:underline"
                      >
                        {tender.contactEmail}
                      </a>
                    </dd>
                  </>
                )}
                
                {tender.contactPhone && (
                  <>
                    <dt className="text-tender-500">{t('tenderDetails.phone')}</dt>
                    <dd className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-tender-400" />
                      <a 
                        href={`tel:${tender.contactPhone}`}
                        className="text-primary hover:underline"
                      >
                        {tender.contactPhone}
                      </a>
                    </dd>
                  </>
                )}
              </dl>
            ) : (
              <p className="text-tender-500 italic">{t('tenderDetails.noContactInfo')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
