
import { cn } from "@/lib/utils";
import { Bell, ChevronDown, Menu, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTender } from "@/context/TenderContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar?: () => void;
  title?: string;
}

export function Header({ toggleSidebar, title = "Tender Management" }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { createTender } = useTender();
  const navigate = useNavigate();

  const handleCreateTender = () => {
    const newTender = createTender({
      title: "New Tender"
    });
    navigate(`/tenders/${newTender.id}`);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-tender-100 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {toggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <h1 className="text-xl font-medium tracking-tight">{title}</h1>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-tender-400" />
            <Input
              type="search"
              placeholder="Search tenders..."
              className="w-full bg-tender-50 border-tender-100 pl-9 rounded-full h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={handleCreateTender}
            className="hidden md:flex items-center gap-1.5 rounded-full"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Tender</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-tender-500 hover:text-tender-600"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
