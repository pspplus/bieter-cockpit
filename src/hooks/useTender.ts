
import { useContext } from 'react';
import { TenderContext } from '@/context/TenderContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for accessing the tender context
 */
export const useTender = () => {
  const context = useContext(TenderContext);
  if (context === undefined) {
    throw new Error("useTender must be used within a TenderProvider");
  }
  
  // Protokolliere den aktuellen Authentifizierungsstatus, um Debugging zu erleichtern
  async function checkAuth() {
    const { data } = await supabase.auth.getSession();
    console.log("Current auth session:", data.session);
    return data.session;
  }
  
  // Rufe die Funktion auf, um den Status zu protokollieren, aber warte nicht darauf
  checkAuth();
  
  return context;
};
