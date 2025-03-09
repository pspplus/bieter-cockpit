
import React, { createContext, useContext, useState, useEffect } from "react";
import { Client } from "@/types/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchClients, 
  fetchClientById, 
  createClient as createClientService, 
  updateClient as updateClientService,
  deleteClient as deleteClientService
} from "@/services/clientService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ClientContextType {
  clients: Client[];
  activeClient: Client | null;
  isLoading: boolean;
  error: Error | null;
  loadClient: (id: string) => Promise<void>;
  createClient: (clientData: Partial<Client>) => Promise<Client>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const queryClient = useQueryClient();

  // Fetch all clients
  const { 
    data: clients = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    enabled: isAuthenticated,
  });

  // Create a client mutation
  const createClientMutation = useMutation({
    mutationFn: createClientService,
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(t('toasts.clientCreated', 'Vergabestelle erfolgreich erstellt'));
      return newClient;
    },
    onError: (error) => {
      console.error('Error creating client:', error);
      toast.error(t('toasts.errorCreatingClient', 'Fehler beim Erstellen der Vergabestelle'));
      throw error;
    }
  });

  // Update a client mutation
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      await updateClientService(id, updates);
      return { id, updates };
    },
    onSuccess: ({ id, updates }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      // Update the active client if it's the one being updated
      if (activeClient?.id === id) {
        setActiveClient(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast.success(t('toasts.clientUpdated', 'Vergabestelle erfolgreich aktualisiert'));
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast.error(t('toasts.errorUpdatingClient', 'Fehler beim Aktualisieren der Vergabestelle'));
    }
  });

  // Delete a client mutation
  const deleteClientMutation = useMutation({
    mutationFn: deleteClientService,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      // Clear the active client if it's the one being deleted
      if (activeClient?.id === id) {
        setActiveClient(null);
      }
      
      toast.success(t('toasts.clientDeleted', 'Vergabestelle erfolgreich gelöscht'));
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast.error(t('toasts.errorDeletingClient', 'Fehler beim Löschen der Vergabestelle'));
    }
  });

  const loadClient = async (id: string) => {
    try {
      const client = await fetchClientById(id);
      setActiveClient(client);
    } catch (error) {
      console.error('Error loading client:', error);
      toast.error(t('toasts.errorLoadingClient', 'Fehler beim Laden der Vergabestelle'));
    }
  };

  const createClient = async (clientData: Partial<Client>): Promise<Client> => {
    return createClientMutation.mutateAsync(clientData);
  };

  const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
    await updateClientMutation.mutateAsync({ id, updates });
  };

  const deleteClient = async (id: string): Promise<void> => {
    await deleteClientMutation.mutateAsync(id);
  };

  const value = {
    clients,
    activeClient,
    isLoading,
    error: error as Error | null,
    loadClient,
    createClient,
    updateClient,
    deleteClient
  };

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
