import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, FileText, MapPin, User, Mail, Phone, DollarSign, Tag, Building, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTender } from "@/context/TenderContext";
import { DocumentList } from "@/components/document/DocumentList";
import { TenderStatusBadge } from "@/components/tender/TenderStatusBadge";
import { TenderDocument } from "@/types/tender";

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getTenderById, deleteTenderDocument } = useTender();
  const [activeTab, setActiveTab] = useState("overview");
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const tenderData = getTenderById(id);
      if (tenderData) {
        setTender(tenderData);
      } else {
        // Handle tender not found
        navigate("/tenders");
      }
    }
    setLoading(false);
  }, [id, getTenderById, navigate]);

  const handleDocumentDelete = (documentId: string) => {
    if (id && documentId) {
      deleteTenderDocument(id, documentId);
      // Refresh tender data
      const updatedTender = getTenderById(id);
      if (updatedTender) {
        setTender(updatedTender);
      }
    }
  };

  if (loading) {
    return (
      <Layout title={t('tenders.tenderDetails')}>
        <div className="flex items-center justify-center h-64">
          <p>{t('general.loading')}</p>
        </div>
      </Layout>
    );
  }

  if (!tender) {
    return (
      <Layout title={t('tenders.tenderDetails')}>
        <div className="flex items-center justify-center h-64">
          <p>{t('tenders.tenderNotFound')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={tender.title}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => navigate("/tenders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('tenders.backToTenders')}
          </Button>

          <div className="flex items-center gap-2">
            <TenderStatusBadge status={tender.status} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/tenders/${id}/edit`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              {t('general.edit')}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
            <TabsTrigger value="overview">{t('tenders.overview')}</TabsTrigger>
            <TabsTrigger value="documents">{t('tenders.documents')}</TabsTrigger>
            <TabsTrigger value="milestones">{t('tenders.milestones')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tenders.tenderDetails')}</CardTitle>
                <CardDescription>
                  {t('tenders.tenderDetailsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Tag className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.internalReference')}</p>
                        <p>{tender.internal_reference || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Tag className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.externalReference')}</p>
                        <p>{tender.external_reference || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.dueDate')}</p>
                        <p>
                          {tender.due_date instanceof Date
                            ? tender.due_date.toLocaleDateString()
                            : new Date(tender.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.location')}</p>
                        <p>{tender.location || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.budget')}</p>
                        <p>
                          {tender.budget
                            ? new Intl.NumberFormat('de-DE', {
                                style: 'currency',
                                currency: 'EUR',
                              }).format(tender.budget)
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Building className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.client')}</p>
                        <p>{tender.client || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.contactPerson')}</p>
                        <p>{tender.contact_person || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.contactEmail')}</p>
                        <p>{tender.contact_email || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.contactPhone')}</p>
                        <p>{tender.contact_phone || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t('tenders.createdAt')}</p>
                        <p>
                          {tender.created_at instanceof Date
                            ? tender.created_at.toLocaleDateString()
                            : new Date(tender.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('tenders.description')}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {tender.description || t('tenders.noDescription')}
                  </p>
                </div>
                
                {tender.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium mb-2">{t('tenders.notes')}</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{tender.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('documents.tenderDocuments')}</CardTitle>
                  <CardDescription>
                    {t('documents.tenderDocumentsDescription')}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/tenders/${id}/documents/upload`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t('documents.uploadDocument')}
                </Button>
              </CardHeader>
              <CardContent>
                {activeTab === "documents" && (
                  <DocumentList
                    documents={tender.documents || []}
                    onDelete={handleDocumentDelete}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="milestones" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('milestones.tenderMilestones')}</CardTitle>
                  <CardDescription>
                    {t('milestones.tenderMilestonesDescription')}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/tenders/${id}/milestones/new`)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('milestones.addMilestone')}
                </Button>
              </CardHeader>
              <CardContent>
                {tender.milestones && tender.milestones.length > 0 ? (
                  <div className="space-y-4">
                    {tender.milestones.map((milestone: any) => (
                      <div
                        key={milestone.id}
                        className="flex flex-col p-4 border rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{milestone.title}</h3>
                          <Badge variant={milestone.status === "completed" ? "success" : "outline"}>
                            {milestone.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {milestone.description}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {milestone.due_date instanceof Date
                              ? milestone.due_date.toLocaleDateString()
                              : new Date(milestone.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {t('milestones.noMilestones')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
