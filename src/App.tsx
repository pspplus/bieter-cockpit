
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TenderProvider } from "@/context/TenderContext";
import { ClientProvider } from "@/context/ClientContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TendersPage from "./pages/TendersPage";
import TenderDetailPage from "./pages/TenderDetailPage";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import NotFound from "./pages/NotFound";
import './i18n'; // Import i18n configuration

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <TenderProvider>
          <ClientProvider>
            <Toaster />
            <Sonner position="top-right" />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tenders" element={<TendersPage />} />
                <Route path="/tenders/:id" element={<TenderDetailPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/:id" element={<ClientDetailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ClientProvider>
        </TenderProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
