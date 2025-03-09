
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { TenderCard } from "@/components/tender/TenderCard";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTender } from "@/context/TenderContext";
import { ChevronDown, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tender } from "@/types/tender";
import { useTranslation } from "react-i18next";

type FilterOption = "all" | Tender["status"];

export default function TendersPage() {
  const { t } = useTranslation();
  const { tenders, createTender } = useTender();
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const navigate = useNavigate();
  
  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: t('tenders.allTenders') },
    { value: "draft", label: t('tenders.drafts') },
    { value: "active", label: t('tenders.active') },
    { value: "submitted", label: t('tenders.submitted') },
    { value: "clarification", label: t('tenders.inClarification') },
    { value: "won", label: t('tenders.won') },
    { value: "lost", label: t('tenders.lost') },
    { value: "completed", label: t('tenders.completed') },
  ];
  
  const filteredTenders = filterBy === "all" 
    ? tenders 
    : tenders.filter(tender => tender.status === filterBy);
  
  // Sort tenders by updated date (most recent first)
  const sortedTenders = [...filteredTenders].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  const handleCreateTender = () => {
    const newTender = createTender({
      title: t('tenders.newTender')
    });
    navigate(`/tenders/${newTender.id}`);
  };

  return (
    <Layout title={t('tenders.tenders')}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                {filterOptions.find(option => option.value === filterBy)?.label}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
                {filterOptions.map(option => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleCreateTender} className="w-full sm:w-auto sm:self-end flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4" />
            {t('general.createNewTender')}
          </Button>
        </div>
        
        {sortedTenders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedTenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">{t('general.noTendersFound')}</h3>
            <p className="text-tender-500 mb-6">
              {filterBy === "all"
                ? t('general.noTendersCreated')
                : t('general.noTendersWithStatus', { status: filterOptions.find(option => option.value === filterBy)?.label })}
            </p>
            <Button onClick={handleCreateTender}>{t('general.createYourFirstTender')}</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
