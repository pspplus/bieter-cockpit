
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import TendersPage from "@/pages/TendersPage";
import TenderDetailPage from "@/pages/TenderDetailPage";
import ClientsPage from "@/pages/ClientsPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
import SubmissionsPage from "@/pages/SubmissionsPage";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import NewTenderPage from "@/pages/NewTenderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Index /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "tenders", element: <TendersPage /> },
      { path: "tenders/new", element: <NewTenderPage /> },
      { path: "tenders/:id", element: <TenderDetailPage /> },
      { path: "submissions", element: <SubmissionsPage /> },
      { path: "clients", element: <ClientsPage /> },
      { path: "clients/:id", element: <ClientDetailPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "*", element: <NotFound /> },
]);
