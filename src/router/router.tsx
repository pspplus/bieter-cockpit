
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import TendersPage from "@/pages/TendersPage";
import ClientsPage from "@/pages/ClientsPage";
import SubmissionsPage from "@/pages/SubmissionsPage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import TenderDetailPage from "@/pages/TenderDetailPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
import NewTenderPage from "@/pages/NewTenderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "tenders",
        element: <TendersPage />,
      },
      {
        path: "tenders/:id",
        element: <TenderDetailPage />,
      },
      {
        path: "tenders/new",
        element: <NewTenderPage />,
      },
      {
        path: "clients",
        element: <ClientsPage />,
      },
      {
        path: "clients/:id",
        element: <ClientDetailPage />,
      },
      {
        path: "submissions",
        element: <SubmissionsPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/landing",
    element: <Index />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
]);
