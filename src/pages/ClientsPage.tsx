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
import { PlusCircle, Search, Edit, Trash, CircleInfo } from "lucide-react";
import { format } from "date-fns";
import { Client } from "@/types/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NewClientDialog } from "@/components/client/NewClientDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ClientsPage = () => {
  const { t } = useTranslation();
  const { clients, deleteClient } = useClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMilestoneInfoCount = (client: Client) => {
    const milestoneFields = [
      client.quick_check_info,
      client.besichtigung_info,
      client.konzept_info,
      client.kalkulation_info,
      client.dokumente_pruefen_info,
      client.ausschreibung_einreichen_info,
      client.aufklaerung_info,
      client.implementierung_info,
    ];

    return milestoneFields.filter(field => field && field.trim() !== '').length;
  };

  const getMilestoneTooltipContent = (client: Client) => {
    const milestoneInfo = [];
    if (client.quick_check_info) milestoneInfo.push("Quick Check");
    if (client.besichtigung_info) milestoneInfo.push("Besichtigung");
    if (client.konzept_info) milestoneInfo.push("Konzept");
    if (client.kalkulation_info) milestoneInfo.push("Kalkulation");
    if (client.dokumente_pruefen_info) milestoneInfo.push("Dokumente prüfen");
    if (client.ausschreibung_einreichen_info) milestoneInfo.push("Ausschreibung einreichen");
    if (client.aufklaerung_info) milestoneInfo.push("Aufklärung");
    if (client.implementierung_info) milestoneInfo.push("Implementierung");

    return milestoneInfo.length > 0 
      ? `Vorhandene Meilenstein-Informationen:\n${milestoneInfo.join('\n')}`
      : "Keine Meilenstein-Informationen vorhanden";
  };

  const handleClientCreated = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };

  return (
    <Layout title={t('clients.title', 'Vergabestellen')}>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('clients.title', 'Vergabestellen')}</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('clients.createNew', 'Neue Vergabestelle erstellen')}
          </Button>
        </div>

        <Card>
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>{t('clients.clientList', 'Vergabestellenliste')}</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-tender-400" />
                <Input
                  type="search"
                  placeholder={t('clients.searchClients', 'Vergabestellen suchen...')}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Ansprechpartner</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Erstellt am</TableHead>
                  <TableHead>Meilenstein-Info</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Keine Vergabestellen gefunden
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
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-1">
                                <CircleInfo className={`h-5 w-5 ${
                                  getMilestoneInfoCount(client) > 0 
                                    ? 'text-green-500' 
                                    : 'text-gray-300'
                                }`} />
                                <span className="text-sm">
                                  {getMilestoneInfoCount(client)}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="whitespace-pre-line">
                              {getMilestoneTooltipContent(client)}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/clients/${client.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Bearbeiten</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteClient(client.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Löschen</span>
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

        {/* Add the closing div tag here */}
        <NewClientDialog 
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onClientCreated={handleClientCreated}
        />
      </div>
    </Layout>
  );
};

export default ClientsPage;
