import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTender } from "@/context/TenderContext";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";

export default function NewTenderPage() {
  const { t } = useTranslation();
  const { createTender } = useTender();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    reference: "",
    description: "",
    client: "",
    location: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create new tender
      const newTender = await createTender({
        title: formData.title || t('tenders.newTender'),
        reference: formData.reference,
        description: formData.description,
        client: formData.client,
        location: formData.location,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      });

      toast({
        title: t('toasts.tenderCreated'),
        description: formData.title || t('tenders.newTender'),
      });

      // Navigate to the new tender page
      navigate(`/tenders/${newTender.id}`);
    } catch (error) {
      console.error("Error creating tender:", error);
      toast({
        title: t('errorMessages.createFailed'),
        description: t('errorMessages.couldNotCreateTender'),
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title={t('tenders.createNewTender')}>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => navigate("/tenders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('tenders.backToTenders')}
        </Button>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <h2 className="text-2xl font-semibold">{t('tenders.createNewTender')}</h2>
              <p className="text-muted-foreground">{t('tenders.fillTenderDetails')}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('tender.title')} *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder={t('tenders.newTender')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">{t('tender.reference')}</Label>
                <Input 
                  id="reference" 
                  name="reference" 
                  value={formData.reference} 
                  onChange={handleChange} 
                  placeholder="REF-2023-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('tender.description')}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder={t('tenders.descriptionPlaceholder')}
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">{t('tender.client')}</Label>
                  <Input 
                    id="client" 
                    name="client" 
                    value={formData.client} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t('tender.location')}</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-medium">{t('tenderDetails.contactInformation')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">{t('tender.contactPerson')}</Label>
                    <Input 
                      id="contactPerson" 
                      name="contactPerson" 
                      value={formData.contactPerson} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">{t('tender.contactEmail')}</Label>
                    <Input 
                      id="contactEmail" 
                      name="contactEmail" 
                      type="email"
                      value={formData.contactEmail} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">{t('tender.contactPhone')}</Label>
                    <Input 
                      id="contactPhone" 
                      name="contactPhone" 
                      value={formData.contactPhone} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/tenders")}
              >
                {t('tenders.cancel')}
              </Button>
              <Button type="submit">
                {t('tenders.createTender')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
