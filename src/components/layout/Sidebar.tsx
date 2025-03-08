
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  FileCheck,
  Home,
  Layers,
  LayoutDashboard,
  Settings,
  Users,
  Briefcase,
  FileText,
  Inbox
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  
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
      <div className="flex h-16 items-center border-b border-tender-100 px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="text-xl">TenderFlow</span>
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
              "tender-step",
              location.pathname === "/" && "tender-step-active"
            )}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/dashboard"
            className={cn(
              "tender-step",
              location.pathname === "/dashboard" && "tender-step-active"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/tenders"
            className={cn(
              "tender-step",
              (location.pathname === "/tenders" || 
               location.pathname.startsWith("/tenders/")) && "tender-step-active"
            )}
          >
            <FileText className="h-5 w-5" />
            <span>Tenders</span>
          </Link>
          <Link
            to="/submissions"
            className={cn(
              "tender-step",
              location.pathname === "/submissions" && "tender-step-active"
            )}
          >
            <FileCheck className="h-5 w-5" />
            <span>Submissions</span>
          </Link>
          <Link
            to="/projects"
            className={cn(
              "tender-step",
              location.pathname === "/projects" && "tender-step-active"
            )}
          >
            <Layers className="h-5 w-5" />
            <span>Projects</span>
          </Link>
          <Link
            to="/messages"
            className={cn(
              "tender-step",
              location.pathname === "/messages" && "tender-step-active"
            )}
          >
            <Inbox className="h-5 w-5" />
            <span>Messages</span>
          </Link>
          <Link
            to="/clients"
            className={cn(
              "tender-step",
              location.pathname === "/clients" && "tender-step-active"
            )}
          >
            <Users className="h-5 w-5" />
            <span>Clients</span>
          </Link>
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t border-tender-100 p-4">
        <Link
          to="/settings"
          className={cn(
            "tender-step",
            location.pathname === "/settings" && "tender-step-active"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
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
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
        {/* Mobile sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 border-r border-tender-100 bg-white transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside className="hidden border-r border-tender-100 bg-white md:block md:w-72">
      {sidebarContent}
    </aside>
  );
}
