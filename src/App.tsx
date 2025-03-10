
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientsPage from './pages/ClientsPage';
import NewTenderPage from './pages/NewTenderPage';
import TendersPage from './pages/TendersPage';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { TenderProvider } from './context/TenderContext';
import { Toaster } from "@/components/ui/sonner";
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { ClientProvider } from "@/context/ClientContext";
import Dashboard from './pages/Dashboard';

// Create a new client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ClientProvider>
              <TenderProvider>
                <Toaster />
                <Router>
                  <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/tenders" element={<TendersPage />} />
                    <Route path="/tenders/new" element={<NewTenderPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Routes>
                </Router>
              </TenderProvider>
            </ClientProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
