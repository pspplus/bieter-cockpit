import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useClient } from "@/context/ClientContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Search, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { Client } from "@/types/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ClientsPage = () => {
  const { t } = useTranslation();
  const { clients, createClient, deleteClient } = useClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClient = async () => {
    if (!newClient.name) return;
    
    try {
      const client = await createClient(newClient);
      setNewClient({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
      });
      setIsCreateDialogOpen(false);
      navigate(`/clients/${client.id}`);
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout title={t('navigation.clients', 'Clients')}>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('navigation.clients', 'Clients')}</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('clients.createNew', 'Create New Client')}
          </Button>
        </div>

        <Card>
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>{t('clients.clientsList', 'Clients List')}</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-tender-400" />
                <Input
                  type="search"
                  placeholder={t('clients.searchClients', 'Search clients...')}
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('clients.name', 'Name')}</TableHead>
                  <TableHead>{t('clients.contactPerson', 'Contact Person')}</TableHead>
                  <TableHead>{t('clients.email', 'Email')}</TableHead>
                  <TableHead>{t('clients.phone', 'Phone')}</TableHead>
                  <TableHead>{t('clients.createdAt', 'Created At')}</TableHead>
                  <TableHead className="text-right">{t('general.actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      {t('clients.noClientsFound', 'No clients found')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>{client.contactPerson}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>
                        {format(new Date(client.createdAt), "PP")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/clients/${client.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">{t('general.edit', 'Edit')}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteClient(client.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">{t('general.delete', 'Delete')}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('clients.createNewClient', 'Create New Client')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">{t('clients.name', 'Name')} *</label>
              <Input
                id="name"
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contactPerson">{t('clients.contactPerson', 'Contact Person')}</label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={newClient.contactPerson}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">{t('clients.email', 'Email')}</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newClient.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone">{t('clients.phone', 'Phone')}</label>
              <Input
                id="phone"
                name="phone"
                value={newClient.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="address">{t('clients.address', 'Address')}</label>
              <Input
                id="address"
                name="address"
                value={newClient.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t('general.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleCreateClient} disabled={!newClient.name}>
              {t('general.create', 'Create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ClientsPage;
