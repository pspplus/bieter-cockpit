
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useClient } from "@/context/ClientContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Client } from "@/types/client";

const ClientDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clients, updateClient } = useClient();
  const [clientData, setClientData] = useState<Partial<Client>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const client = clients.find(c => c.id === id);
      if (client) {
        setClientData(client);
      } else {
        navigate("/clients", { replace: true });
      }
    }
    setIsLoading(false);
  }, [id, clients, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (id && clientData.name) {
      setIsSaving(true);
      try {
        await updateClient(id, clientData);
        navigate("/clients");
      } catch (error) {
        console.error("Error saving client:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout title={t('clients.clientDetails', 'Vergabestellendetails')}>
        <div className="container mx-auto py-6">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={clientData.name || t('clients.clientDetails', 'Vergabestellendetails')}>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/clients")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('general.back', 'Zurück')}
          </Button>
          <h1 className="text-2xl font-bold flex-1">
            {clientData.name || t('clients.clientDetails', 'Vergabestellendetails')}
          </h1>
          <Button onClick={handleSave} disabled={!clientData.name || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('general.saving', 'Speichern...')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('general.save', 'Speichern')}
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('clients.editClientInfo', 'Vergabestelleninformation bearbeiten')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="name">Name *</label>
                <Input
                  id="name"
                  name="name"
                  value={clientData.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="contactPerson">Ansprechpartner</label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={clientData.contactPerson || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email">E-Mail</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={clientData.email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="phone">Telefon</label>
                <Input
                  id="phone"
                  name="phone"
                  value={clientData.phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="address">Adresse</label>
                <Input
                  id="address"
                  name="address"
                  value={clientData.address || ""}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meilenstein-spezifische Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="quick_check_info">Quick Check Information</label>
                <Textarea
                  id="quick_check_info"
                  name="quick_check_info"
                  value={clientData.quick_check_info || ""}
                  onChange={handleInputChange}
                  placeholder="Spezifische Informationen für den Quick Check..."
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="besichtigung_info">Besichtigung Information</label>
                <Textarea
                  id="besichtigung_info"
                  name="besichtigung_info"
                  value={clientData.besichtigung_info || ""}
                  onChange={handleInputChange}
                  placeholder="Spezifische Informationen für die Besichtigung..."
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="konzept_info">Konzept Information</label>
                <Textarea
                  id="konzept_info"
                  name="konzept_info"
                  value={clientData.konzept_info || ""}
                  onChange={handleInputChange}
                  placeholder="Spezifische Informationen für das Konzept..."
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="kalkulation_info">Kalkulation Information</label>
                <Textarea
                  id="kalkulation_info"
                  name="kalkulation_info"
                  value={clientData.kalkulation_info || ""}
                  onChange={handleInputChange}
                  placeholder="Spezifische Informationen für die Kalkulation..."
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="dokumente_pruefen_info">Dokumente prüfen Information</label>
                <Textarea
                  id="dokumente_pruefen_info"
                  name="dokumente_pruefen_info"
                  value={clientData.dokumente_pruefen_info || ""}
                  onChange={handleInputChange}
                  placeholder="Spezifische Informationen für die Dokumentenprüfung..."
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="ausschreibung_einreichen_info">Ausschreibung einreichen Information</label>
                <Textarea
                  id="ausschreibung_einreichen_info"
                  name="ausschreibung_einreichen_info"
                  value={clientData.ausschreibung_einreichen_info || ""}
                  onChange={handleInputChange}
                  placeholder="Spezifische Informationen für die Einreichung..."
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="aufklaerung_info">Aufklärung Information</label>
                <Textarea
                  id="aufklaerung_info"
                  name="aufklaerung_info"
                  value={clientData.aufklaerung_info || ""}
                  onChange={handleInputChange}
                  placeholder="Spezifische Informationen für die Aufklärung..."
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="implementierung_info">Implementierung Information</label>
                <Textarea
                  id="implementierung_info"
                  name="implementierung_info"
                  value={clientData.implementierung_info || ""}
                  onChange={handleInputChange}
                  placeholder="Spezifische Informationen für die Implementierung..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ClientDetailPage;
