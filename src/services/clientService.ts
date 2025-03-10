
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { toast } from "sonner";

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

// Helper function to retry operations
const withRetry = async <T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.log(`Operation failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay);
    }
    throw error;
  }
};

// Fetch all clients for the current user
export const fetchClients = async (): Promise<Client[]> => {
  console.log("fetchClients: Attempting to fetch clients...");
  
  try {
    const response = await withRetry(() => 
      supabase
        .from('clients')
        .select('*')
        .order('name')
    );

    if (response.error) {
      console.error('Error fetching clients:', response.error);
      toast.error('Fehler beim Laden der Vergabestellen. Bitte versuchen Sie es später erneut.');
      throw response.error;
    }

    console.log(`Successfully fetched ${response.data?.length || 0} clients`);
    return response.data ? response.data.map(mapClientFromDB) : [];
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    toast.error('Fehler beim Laden der Vergabestellen. Bitte versuchen Sie es später erneut.');
    return [];
  }
};

// Fetch a single client by ID
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching client:', error);
      throw error;
    }

    return data ? mapClientFromDB(data) : null;
  } catch (error) {
    console.error('Error fetching client details:', error);
    toast.error('Fehler beim Laden der Vergabestelle. Bitte versuchen Sie es später erneut.');
    return null;
  }
};

// Create a new client
export const createClient = async (clientData: Partial<Client>): Promise<Client> => {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      toast.error('Authentifizierungsfehler. Bitte melden Sie sich erneut an.');
      throw new Error('User not authenticated');
    }
    
    if (!user) {
      console.error('No authenticated user found');
      toast.error('Keine Benutzerauthentifizierung gefunden. Bitte melden Sie sich an.');
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

    console.log("Creating new client with data:", dbClient);

    // Insert the client
    const { data, error } = await supabase
      .from('clients')
      .insert(dbClient)
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      toast.error('Fehler beim Erstellen der Vergabestelle.');
      throw error;
    }

    if (!data) {
      const noDataError = new Error('No data returned after creating client');
      console.error(noDataError);
      toast.error('Fehler beim Erstellen der Vergabestelle: Keine Daten zurückgegeben.');
      throw noDataError;
    }

    console.log("Client created successfully:", data);
    toast.success('Vergabestelle erfolgreich erstellt!');
    return mapClientFromDB(data);
  } catch (error) {
    console.error('Client creation failed:', error);
    toast.error('Vergabestelle konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.');
    throw error;
  }
};

// Update a client
export const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
  try {
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
      toast.error('Fehler beim Aktualisieren der Vergabestelle.');
      throw error;
    }
    
    toast.success('Vergabestelle erfolgreich aktualisiert!');
  } catch (error) {
    console.error('Error updating client:', error);
    toast.error('Vergabestelle konnte nicht aktualisiert werden.');
    throw error;
  }
};

// Delete a client
export const deleteClient = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      toast.error('Fehler beim Löschen der Vergabestelle.');
      throw error;
    }
    
    toast.success('Vergabestelle erfolgreich gelöscht!');
  } catch (error) {
    console.error('Error deleting client:', error);
    toast.error('Vergabestelle konnte nicht gelöscht werden.');
    throw error;
  }
};
