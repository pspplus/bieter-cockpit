
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  FileCheck,
  Home,
  LayoutDashboard,
  Settings,
  Users,
  Inbox,
  FileText
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) {
      onClose();
    }
  }, [location.pathname, isMobile, isOpen, onClose]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-tender-100 dark:border-tender-800 px-6">
        <Link to="/" className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/67014d21-d261-48c8-94e3-06a85e6b7dac.png" 
            alt="Bieter.Coach" 
            className="h-20" 
          />
        </Link>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Seitenleiste schließen</span>
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-4">
          <Link
            to="/"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              location.pathname === "/" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <Home className="h-5 w-5" />
            <span>{t('navigation.home', 'Startseite')}</span>
          </Link>
          <Link
            to="/dashboard"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              location.pathname === "/dashboard" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>{t('navigation.dashboard', 'Dashboard')}</span>
          </Link>
          <Link
            to="/tenders"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              (location.pathname === "/tenders" || 
               location.pathname.startsWith("/tenders/")) && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <FileText className="h-5 w-5" />
            <span>{t('sidebar.tenders', 'Ausschreibungen')}</span>
          </Link>
          <Link
            to="/submissions"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              location.pathname === "/submissions" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <FileCheck className="h-5 w-5" />
            <span>{t('sidebar.submissions', 'Einreichungen')}</span>
          </Link>
          <Link
            to="/messages"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              location.pathname === "/messages" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <Inbox className="h-5 w-5" />
            <span>{t('navigation.activityLog', 'Aktivitätsprotokoll')}</span>
          </Link>
          <Link
            to="/clients"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              (location.pathname === "/clients" || 
               location.pathname.startsWith("/clients/")) && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <Users className="h-5 w-5" />
            <span>{t('sidebar.clients', 'Vergabestellen')}</span>
          </Link>
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t border-tender-100 dark:border-tender-800 p-4">
        <Link
          to="/profile"
          className={cn(
            "tender-step dark:hover:bg-tender-800/50",
            location.pathname === "/profile" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>{t('navigation.settings', 'Einstellungen')}</span>
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 border-r border-tender-100 dark:border-tender-800 bg-white dark:bg-tender-950 transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside className="hidden border-r border-tender-100 dark:border-tender-800 bg-white dark:bg-tender-950 md:block md:w-72">
      {sidebarContent}
    </aside>
  );
}
