
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

// Convert a Supabase client row to our application Client type
const mapClientFromDB = (client: any): Client => {
  return {
    id: client.id,
    name: client.name,
    contactPerson: client.contact_person || "",
    email: client.email || "",
    phone: client.phone || "",
    address: client.address || "",
    createdAt: new Date(client.created_at)
  };
};

// Fetch all clients for the current user
export const fetchClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  return data ? data.map(mapClientFromDB) : [];
};

// Fetch a single client by ID
export const fetchClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - client not found
      return null;
    }
    console.error('Error fetching client:', error);
    throw error;
  }

  return data ? mapClientFromDB(data) : null;
};

// Create a new client
export const createClient = async (clientData: Partial<Client>): Promise<Client> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Prepare the data for insertion
  const dbClient = {
    name: clientData.name || "",
    contact_person: clientData.contactPerson || "",
    email: clientData.email || "",
    phone: clientData.phone || "",
    address: clientData.address || "",
    user_id: user.id
  };

  // Insert the client
  const { data, error } = await supabase
    .from('clients')
    .insert(dbClient)
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned after creating client');
  }

  return mapClientFromDB(data);
};

// Update a client
export const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
  // Convert the updates to the DB format
  const dbUpdates = {
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.contactPerson !== undefined && { contact_person: updates.contactPerson }),
    ...(updates.email !== undefined && { email: updates.email }),
    ...(updates.phone !== undefined && { phone: updates.phone }),
    ...(updates.address !== undefined && { address: updates.address }),
    updated_at: new Date().toISOString()
  };

  // Update the client
  const { error } = await supabase
    .from('clients')
    .update(dbUpdates)
    .eq('id', id);

  if (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

// Delete a client
export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};
