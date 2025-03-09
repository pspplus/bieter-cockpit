
import { Tender } from "@/types/tender";
import { useState, useEffect } from "react";
import { fetchTenderDocuments } from "@/services/documentService";
import { TenderHeader } from "./details/TenderHeader";
import { TenderStats } from "./details/TenderStats";
import { TenderInformationCard } from "./details/TenderInformationCard";
import { ContactInformationCard } from "./details/ContactInformationCard";

interface TenderDetailsProps {
  tender: Tender;
}

export function TenderDetails({ tender }: TenderDetailsProps) {
  const [documentCount, setDocumentCount] = useState(0);
  
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await fetchTenderDocuments(tender.id);
        setDocumentCount(docs.length);
      } catch (error) {
        console.error("Error loading documents:", error);
      }
    };
    
    loadDocuments();
  }, [tender.id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <TenderHeader tender={tender} />
        <TenderStats tender={tender} documentCount={documentCount} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <TenderInformationCard tender={tender} />
        <ContactInformationCard tender={tender} />
      </div>
    </div>
  );
}
