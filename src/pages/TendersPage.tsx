
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

type FilterOption = "all" | Tender["status"];

export default function TendersPage() {
  const { tenders, createTender } = useTender();
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const navigate = useNavigate();
  
  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: "All Tenders" },
    { value: "draft", label: "Drafts" },
    { value: "active", label: "Active" },
    { value: "submitted", label: "Submitted" },
    { value: "clarification", label: "In Clarification" },
    { value: "won", label: "Won" },
    { value: "lost", label: "Lost" },
    { value: "completed", label: "Completed" },
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
      title: "New Tender"
    });
    navigate(`/tenders/${newTender.id}`);
  };

  return (
    <Layout title="Tenders">
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
            Create New Tender
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
            <h3 className="text-lg font-medium mb-2">No tenders found</h3>
            <p className="text-tender-500 mb-6">
              {filterBy === "all"
                ? "You haven't created any tenders yet."
                : `You don't have any tenders with '${filterBy}' status.`}
            </p>
            <Button onClick={handleCreateTender}>Create Your First Tender</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
