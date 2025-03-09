
import { Tender } from "@/types/tender";
import { StatusBadge } from "./StatusBadge";
import { useTranslation } from "react-i18next";

interface TenderHeaderProps {
  tender: Tender;
}

export function TenderHeader({ tender }: TenderHeaderProps) {
  const { t } = useTranslation();
  
  // Use the internal reference as primary, and external as secondary if available
  const displayReference = tender.internalReference;
  const externalReferenceDisplay = tender.externalReference 
    ? `${t('tender.externalReference')}: ${tender.externalReference}` 
    : '';

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{tender.title}</h1>
        <StatusBadge status={tender.status} />
      </div>
      <p className="text-tender-500 mt-1">{displayReference}</p>
      {externalReferenceDisplay && <p className="text-tender-500 text-sm">{externalReferenceDisplay}</p>}
    </div>
  );
}
