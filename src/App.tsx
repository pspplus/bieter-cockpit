import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientsPage from './pages/ClientsPage';
import NewTenderPage from './pages/NewTenderPage';
import TendersPage from './pages/TendersPage';
import TenderDetailsPage from './pages/TenderDetailsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { TenderProvider } from './context/TenderContext';
import { Toaster } from "@/components/ui/sonner"
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import { ClientProvider } from "@/context/ClientContext";

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider theme={theme}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <ClientProvider>
                <TenderProvider>
                  <Toaster />
                  <Router>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/clients" element={<ClientsPage />} />
                      <Route path="/clients/:id" element={<ClientDetailsPage />} />
                      <Route path="/tenders" element={<TendersPage />} />
                      <Route path="/tenders/new" element={<NewTenderPage />} />
                      <Route path="/tenders/:id" element={<TenderDetailsPage />} />
                    </Routes>
                  </Router>
                </TenderProvider>
              </ClientProvider>
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ChakraProvider>
  );
}

export default App;
