
import { Tender, TenderStatus } from "@/types/tender";
import { BaseInfoCard } from "./cards/BaseInfoCard";
import { MainInfoCard } from "./cards/MainInfoCard";
import { ObjectInfoCard } from "./cards/ObjectInfoCard";
import { RequirementsCard } from "./cards/RequirementsCard";
import { ContactCard } from "./cards/ContactCard";
import { NotesCard } from "./cards/NotesCard";

interface TenderDetailsProps {
  tender: Tender;
  onOpenDetailsDialog?: () => void;
  onOpenContactDialog?: () => void;
  onStatusChange?: (status: TenderStatus) => Promise<void>;
}

export function TenderDetails({ 
  tender, 
  onOpenDetailsDialog, 
  onOpenContactDialog,
  onStatusChange
}: TenderDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Information Cards in a Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Base Information Card */}
        <BaseInfoCard 
          tender={tender} 
          onStatusChange={onStatusChange}
        />

        {/* Main Information Card */}
        <MainInfoCard 
          tender={tender} 
          onOpenDetailsDialog={onOpenDetailsDialog} 
        />

        {/* Object Information Card */}
        <ObjectInfoCard tender={tender} />
        
        {/* Requirements Card */}
        <RequirementsCard tender={tender} />

        {/* Contact Card */}
        <ContactCard 
          tender={tender} 
          onOpenContactDialog={onOpenContactDialog} 
        />
        
        {/* Notes Card */}
        <NotesCard tender={tender} />
      </div>
    </div>
  );
}
