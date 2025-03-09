
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  FileCheck,
  Home,
  Layers,
  LayoutDashboard,
  Settings,
  Users,
  Inbox,
  FileText,
  Smile
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const { t } = useTranslation();
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar automatically when route changes on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      onClose();
    }
  }, [location.pathname, isMobile, isOpen, onClose]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-tender-100 dark:border-tender-800 px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Smile className="h-9 w-9 text-yellow-400" />
          <span className="text-xl">{t('general.appName')}</span>
        </Link>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
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
            <span>{t('sidebar.home')}</span>
          </Link>
          <Link
            to="/dashboard"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              location.pathname === "/dashboard" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>{t('sidebar.dashboard')}</span>
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
            <span>{t('sidebar.tenders')}</span>
          </Link>
          <Link
            to="/submissions"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              location.pathname === "/submissions" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <FileCheck className="h-5 w-5" />
            <span>{t('sidebar.submissions')}</span>
          </Link>
          <Link
            to="/projects"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              location.pathname === "/projects" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <Layers className="h-5 w-5" />
            <span>{t('sidebar.projects')}</span>
          </Link>
          <Link
            to="/messages"
            className={cn(
              "tender-step dark:hover:bg-tender-800/50",
              location.pathname === "/messages" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
            )}
          >
            <Inbox className="h-5 w-5" />
            <span>{t('sidebar.messages')}</span>
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
            <span>{t('sidebar.clients')}</span>
          </Link>
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t border-tender-100 dark:border-tender-800 p-4">
        <Link
          to="/settings"
          className={cn(
            "tender-step dark:hover:bg-tender-800/50",
            location.pathname === "/settings" && "tender-step-active dark:bg-tender-800/60 dark:text-primary-foreground dark:font-medium"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>{t('sidebar.settings')}</span>
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
        {/* Mobile sidebar */}
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
