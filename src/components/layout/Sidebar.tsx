import { useState } from "react";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const navigationItems = [
    { name: t("navigation.dashboard", "Dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("navigation.tenders", "Ausschreibungen"), href: "/tenders", icon: FileSpreadsheet },
    { name: t("navigation.clients", "Kunden"), href: "/clients", icon: Users },
    { name: t("navigation.submissions", "Einreichungen"), href: "/submissions", icon: FileSpreadsheet },
    { name: t("navigation.messages", "Nachrichten"), href: "/messages", icon: MessageSquare },
    { 
      name: t("navigation.milestones", "Meilensteine"), 
      href: "/milestones", 
      icon: CheckCircle 
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col space-y-2 bg-secondary border-r border-muted/50 text-secondary-foreground h-screen fixed top-0 left-0 z-20",
        collapsed ? "w-16" : "w-60",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "transition-transform duration-300 ease-in-out",
        "md:translate-x-0 md:sticky md:top-0"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <span className={cn("font-bold text-lg", collapsed ? "hidden" : "")}>
          TenderBase
        </span>
        <button
          onClick={onClose}
          className="md:hidden text-secondary-foreground hover:text-foreground focus:outline-none"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-md p-2 hover:bg-secondary/50",
                  location.pathname === item.href
                    ? "bg-secondary/50 font-medium"
                    : "font-normal"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className={cn(collapsed ? "hidden" : "")}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className={cn(collapsed ? "hidden" : "")}>{t("theme", "Theme")}</span>
          <Switch
            id="theme"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={toggleCollapse}
          className="flex items-center justify-center w-full rounded-md p-2 hover:bg-secondary/50"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
