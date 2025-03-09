
import { cn } from "@/lib/utils";
import { Bell, ChevronDown, Menu, PlusCircle, Search, Smile, ArrowLeft } from "lucide-react";
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
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  toggleSidebar?: () => void;
  title?: string;
}

export function Header({ toggleSidebar, title = "Tender Management" }: HeaderProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, getUserName } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-tender-100 dark:border-tender-800 bg-white/80 dark:bg-tender-950/80 backdrop-blur-md">
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
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-tender-400 dark:text-tender-500" />
            <Input
              type="search"
              placeholder={t('navigation.search')}
              className="w-full bg-tender-50 dark:bg-tender-800 border-tender-100 dark:border-tender-700 pl-9 rounded-full h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button 
                onClick={() => navigate("/tenders/new")}
                className="hidden md:flex items-center gap-1.5 rounded-full"
              >
                <PlusCircle className="h-4 w-4" />
                <span>{t('general.createNewTender')}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-tender-500 hover:text-tender-600 dark:text-tender-400 dark:hover:text-tender-300"
              >
                <Bell className="h-5 w-5" />
                <span className="sr-only">{t('navigation.notifications')}</span>
              </Button>

              <ThemeSwitcher />
              <LanguageSwitcher />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" alt={getUserName()} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserName().substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{getUserName() || t('navigation.myAccount')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{t('navigation.profile')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('navigation.settings')}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>{t('navigation.logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeSwitcher />
              <LanguageSwitcher />
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="rounded-full"
              >
                {t('auth.login') || 'Anmelden'}
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="rounded-full"
              >
                {t('auth.signup') || 'Registrieren'}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
