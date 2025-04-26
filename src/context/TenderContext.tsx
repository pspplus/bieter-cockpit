
import React, { createContext, useState, useEffect } from "react";
import { Tender } from "@/types/tender";
import { useAuth } from "@/context/AuthContext";
import { fetchTenders } from "@/services/tenderService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { TenderContextType } from "./tender/types";
import { useTenderOperations } from "./tender/useTenderOperations";
import { useMilestoneOperations } from "./tender/useMilestoneOperations";
import { canUpdateMilestoneStatus } from "./tender/milestoneUtils";

export const TenderContext = createContext<TenderContextType | undefined>(undefined);

export const TenderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const { createTender, updateTender, deleteTender, loadTender } = useTenderOperations(setTenders, setIsLoading);
  const { createMilestone, updateMilestone, deleteMilestone } = useMilestoneOperations(setTenders);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetchTenders()
        .then((data) => setTenders(data))
        .catch((error) => {
          console.error("Error loading tenders:", error);
          toast.error(t('errorMessages.couldNotLoadTenders'));
        })
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, t]);

  return (
    <TenderContext.Provider value={{
      tenders,
      isLoading,
      createTender,
      updateTender,
      deleteTender,
      createMilestone,
      updateMilestone,
      deleteMilestone,
      canUpdateMilestoneStatus,
      loadTender
    }}>
      {children}
    </TenderContext.Provider>
  );
};
