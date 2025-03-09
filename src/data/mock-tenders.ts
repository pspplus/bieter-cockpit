
import { Tender, TenderStatus } from "@/types/tender";

// Diese Mock-Daten werden nicht mehr verwendet, da wir jetzt Supabase verwenden
// Die Datei wird leer gehalten, um Build-Fehler zu vermeiden
export const mockTenders: Tender[] = [];

// Exportieren einer leeren Funktion als Ersatz für die vorherige Funktionalität
export const getMockTender = (id: string): Tender | undefined => {
  return undefined;
};
