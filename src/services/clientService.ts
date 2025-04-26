import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

// Convert a Supabase client row to our application Client type
const mapClientFromDB = (client: any): Client => ({
  id: client.id,
  name: client.name,
  contactPerson: client.contact_person || "",
  email: client.email || "",
  phone: client.phone || "",
  address: client.address || "",
  createdAt: new Date(client.created_at),
  quick_check_info: client.quick_check_info || "",
  besichtigung_info: client.besichtigung_info || "",
  konzept_info: client.konzept_info || "",
  kalkulation_info: client.kalkulation_info || "",
  dokumente_pruefen_info: client.dokumente_pruefen_info || "",
  ausschreibung_einreichen_info: client.ausschreibung_einreichen_info || "",
  aufklaerung_info: client.aufklaerung_info || "",
  implementierung_info: client.implementierung_info || "",
});

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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const dbClient = {
    name: clientData.name || "",
    contact_person: clientData.contactPerson || "",
    email: clientData.email || "",
    phone: clientData.phone || "",
    address: clientData.address || "",
    quick_check_info: clientData.quick_check_info || "",
    besichtigung_info: clientData.besichtigung_info || "",
    konzept_info: clientData.konzept_info || "",
    kalkulation_info: clientData.kalkulation_info || "",
    dokumente_pruefen_info: clientData.dokumente_pruefen_info || "",
    ausschreibung_einreichen_info: clientData.ausschreibung_einreichen_info || "",
    aufklaerung_info: clientData.aufklaerung_info || "",
    implementierung_info: clientData.implementierung_info || "",
    user_id: user.id
  };

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
  const dbUpdates = {
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.contactPerson !== undefined && { contact_person: updates.contactPerson }),
    ...(updates.email !== undefined && { email: updates.email }),
    ...(updates.phone !== undefined && { phone: updates.phone }),
    ...(updates.address !== undefined && { address: updates.address }),
    ...(updates.quick_check_info !== undefined && { quick_check_info: updates.quick_check_info }),
    ...(updates.besichtigung_info !== undefined && { besichtigung_info: updates.besichtigung_info }),
    ...(updates.konzept_info !== undefined && { konzept_info: updates.konzept_info }),
    ...(updates.kalkulation_info !== undefined && { kalkulation_info: updates.kalkulation_info }),
    ...(updates.dokumente_pruefen_info !== undefined && { dokumente_pruefen_info: updates.dokumente_pruefen_info }),
    ...(updates.ausschreibung_einreichen_info !== undefined && { ausschreibung_einreichen_info: updates.ausschreibung_einreichen_info }),
    ...(updates.aufklaerung_info !== undefined && { aufklaerung_info: updates.aufklaerung_info }),
    ...(updates.implementierung_info !== undefined && { implementierung_info: updates.implementierung_info }),
    updated_at: new Date().toISOString()
  };

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
