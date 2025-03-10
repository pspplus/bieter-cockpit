
import { Tender, TenderStatus } from "@/types/tender";
import { BaseInfoCard } from "./cards/BaseInfoCard";
import { MainInfoCard } from "./cards/MainInfoCard";
import { ObjectInfoCard } from "./cards/ObjectInfoCard";
import { RequirementsCard } from "./cards/RequirementsCard";
import { ContactCard } from "./cards/ContactCard";
import { NotesCard } from "./cards/NotesCard";
import { useTender } from "@/hooks/useTender";

interface TenderDetailsProps {
  tender: Tender;
  onOpenDetailsDialog?: () => void;
  onOpenContactDialog?: () => void;
}

export function TenderDetails({ 
  tender, 
  onOpenDetailsDialog, 
  onOpenContactDialog,
}: TenderDetailsProps) {
  const { updateTender } = useTender();

  const handleStatusChange = async (status: TenderStatus) => {
    await updateTender(tender.id, { status });
  };
  
  const handleUpdateTender = async (updates: Partial<Tender>) => {
    await updateTender(tender.id, updates);
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
