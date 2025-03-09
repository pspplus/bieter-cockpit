
import { RouterProvider } from "react-router-dom";
import { router } from "@/router/router";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { ClientProvider } from "@/context/ClientContext";
import { Toaster } from "sonner";
import { TenderProviders } from "@/context/TenderProviders";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ClientProvider>
            <TenderProviders>
              <RouterProvider router={router} />
              <Toaster />
            </TenderProviders>
          </ClientProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
