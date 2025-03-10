
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
import { useTender } from "@/hooks/useTender";
import { ChevronDown, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tender } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

type FilterOption = "all" | Tender["status"];

export default function TendersPage() {
  const { t } = useTranslation();
  const { tenders, isLoading } = useTender();
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const navigate = useNavigate();
  
  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: "Alle Ausschreibungen" },
    { value: "entwurf", label: "Entwurf" },
    { value: "in-pruefung", label: "In Prüfung" },
    { value: "in-bearbeitung", label: "In Bearbeitung" },
    { value: "abgegeben", label: "Abgegeben" },
    { value: "aufklaerung", label: "Aufklärung" },
    { value: "gewonnen", label: "Gewonnen" },
    { value: "verloren", label: "Verloren" },
    { value: "abgeschlossen", label: "Abgeschlossen" },
  ];
  
  const filteredTenders = filterBy === "all" 
    ? tenders 
    : tenders.filter(tender => tender.status === filterBy);
  
  // Sort tenders by due date (ascending)
  const sortedTenders = [...filteredTenders].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  return (
    <Layout title="Ausschreibungen">
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
          
          <Button 
            onClick={() => navigate("/tenders/new")} 
            className="w-full sm:w-auto sm:self-end flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            Neue Ausschreibung
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-border rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedTenders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedTenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">Keine Ausschreibungen gefunden</h3>
            <p className="text-tender-500 mb-6">
              {filterBy === "all"
                ? "Sie haben noch keine Ausschreibungen erstellt"
                : `Es gibt keine Ausschreibungen mit dem Status "${filterOptions.find(option => option.value === filterBy)?.label}"`}
            </p>
            
            <Button onClick={() => navigate("/tenders/new")}>
              Erstellen Sie Ihre erste Ausschreibung
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
