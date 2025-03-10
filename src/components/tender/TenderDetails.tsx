
import { Tender, TenderStatus } from "@/types/tender";
import { BaseInfoCard } from "./cards/BaseInfoCard";
import { MainInfoCard } from "./cards/MainInfoCard";
import { ObjectInfoCard } from "./cards/ObjectInfoCard";
import { RequirementsCard } from "./cards/RequirementsCard";
import { ContactCard } from "./cards/ContactCard";
import { NotesCard } from "./cards/NotesCard";
import { useTender } from "@/hooks/useTender";
import { useState } from "react";

interface TenderDetailsProps {
  tender: Tender;
  onOpenDetailsDialog?: () => void;
  onOpenContactDialog?: () => void;
}

export function TenderDetails({ 
  tender: initialTender, 
  onOpenDetailsDialog, 
  onOpenContactDialog,
}: TenderDetailsProps) {
  const { updateTender } = useTender();
  const [tender, setTender] = useState(initialTender);

  const handleStatusChange = async (status: TenderStatus) => {
    try {
      await updateTender(tender.id, { status });
      setTender(prev => ({ ...prev, status }));
    } catch (error) {
      console.error("Error updating tender status:", error);
    }
  };
  
  const handleUpdateTender = async (updates: Partial<Tender>) => {
    try {
      await updateTender(tender.id, updates);
      setTender(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Error updating tender:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <BaseInfoCard 
          tender={tender} 
          onStatusChange={handleStatusChange}
          onUpdateTender={handleUpdateTender}
        />

        <MainInfoCard 
          tender={tender} 
          onOpenDetailsDialog={onOpenDetailsDialog}
          onUpdateTender={handleUpdateTender} 
        />

        <ObjectInfoCard 
          tender={tender} 
          onUpdateTender={handleUpdateTender}
        />
        
        <RequirementsCard 
          tender={tender}
          onUpdateTender={handleUpdateTender}
        />

        <ContactCard 
          tender={tender} 
          onOpenContactDialog={onOpenContactDialog} 
        />
        
        <NotesCard tender={tender} />
      </div>
    </div>
  );
}
