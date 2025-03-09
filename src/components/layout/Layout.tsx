
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  title?: string;
}

export function Layout({ title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Header toggleSidebar={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 animate-slide-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
