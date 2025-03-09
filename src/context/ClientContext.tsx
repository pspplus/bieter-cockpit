
import React, { createContext, useContext, useState, useEffect } from "react";
import { Client } from "@/types/client";
import { mockClients } from "@/data/mock-clients";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ClientContextType {
  clients: Client[];
  activeClient: Client | null;
  loadClient: (id: string) => void;
  createClient: (clientData: Partial<Client>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  useEffect(() => {
    // Load mock data
    setClients(mockClients);
  }, []);

  const loadClient = (id: string) => {
    const client = clients.find(c => c.id === id) || null;
    setActiveClient(client);
  };

  const createClient = (clientData: Partial<Client>): Client => {
    const newClient: Client = {
      id: uuidv4(),
      name: clientData.name || "",
      contactPerson: clientData.contactPerson || "",
      email: clientData.email || "",
      phone: clientData.phone || "",
      address: clientData.address || "",
      createdAt: new Date(),
      ...clientData,
    };

    setClients(prev => [...prev, newClient]);
    toast.success(t('toasts.clientCreated', 'Client created successfully'));
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === id 
          ? { ...client, ...updates } 
          : client
      )
    );

    if (activeClient?.id === id) {
      setActiveClient(prev => prev ? { ...prev, ...updates } : null);
    }
    
    toast.success(t('toasts.clientUpdated', 'Client updated successfully'));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    
    if (activeClient?.id === id) {
      setActiveClient(null);
    }
    
    toast.success(t('toasts.clientDeleted', 'Client deleted successfully'));
  };

  const value = {
    clients,
    activeClient,
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
