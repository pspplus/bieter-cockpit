
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useClient } from "@/context/ClientContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Client } from "@/types/client";

const ClientDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clients, updateClient } = useClient();
  const [clientData, setClientData] = useState<Partial<Client>>({});
  const [isLoading, setIsLoading] = useState(true);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (id && clientData.name) {
      updateClient(id, clientData);
      navigate("/clients");
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
          <Button onClick={handleSave} disabled={!clientData.name}>
            <Save className="mr-2 h-4 w-4" />
            {t('general.save', 'Speichern')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('clients.editClientInfo', 'Vergabestelleninformation bearbeiten')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="name">{t('clients.name', 'Name')} *</label>
              <Input
                id="name"
                name="name"
                value={clientData.name || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contactPerson">{t('clients.contactPerson', 'Contact Person')}</label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={clientData.contactPerson || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">{t('clients.email', 'Email')}</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={clientData.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone">{t('clients.phone', 'Phone')}</label>
              <Input
                id="phone"
                name="phone"
                value={clientData.phone || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="address">{t('clients.address', 'Address')}</label>
              <Input
                id="address"
                name="address"
                value={clientData.address || ""}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientDetailPage;
