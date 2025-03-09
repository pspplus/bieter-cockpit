import React, { createContext, useContext, useState, useEffect } from "react";
import { Tender, Milestone } from "@/types/tender";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchTenders, 
  fetchTenderById, 
  createTender as createTenderService, 
  updateTender as updateTenderService,
  deleteTender as deleteTenderService,
  createMilestone as createMilestoneService,
  updateMilestone as updateMilestoneService,
  deleteMilestone as deleteMilestoneService
} from "@/services/tenderService";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

type TenderContextType = {
  tenders: Tender[];
  isLoading: boolean;
  createTender: (tenderData: Partial<Tender>) => Promise<Tender>;
  updateTender: (id: string, updates: Partial<Tender>) => Promise<void>;
  deleteTender: (id: string) => Promise<void>;
  createMilestone: (tenderId: string, milestone: Partial<Milestone>) => Promise<void>;
  updateMilestone: (milestone: Milestone) => Promise<void>;
  deleteMilestone: (tenderId: string, milestoneId: string) => Promise<void>;
};

type TenderProviderProps = {
  children: React.ReactNode;
};

export const TenderContext = createContext<TenderContextType | undefined>(undefined);

export const TenderProvider: React.FC<TenderProviderProps> = ({ children }) => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Load tenders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetchTenders()
        .then((data) => {
          setTenders(data);
        })
        .catch((error) => {
          console.error("Error loading tenders:", error);
          toast({
            title: t('errorMessages.loadFailed'),
            description: t('errorMessages.couldNotLoadTenders'),
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthenticated, toast, t]);

  // Create a new tender
  const createTender = async (tenderData: Partial<Tender>): Promise<Tender> => {
    try {
      const newTender = await createTenderService(tenderData);
      setTenders([newTender, ...tenders]);
      return newTender;
    } catch (error) {
      console.error("Error creating tender:", error);
      toast({
        title: t('errorMessages.createFailed'),
        description: t('errorMessages.couldNotCreateTender'),
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update a tender
  const updateTender = async (id: string, updates: Partial<Tender>): Promise<void> => {
    try {
      await updateTenderService(id, updates);
      setTenders(tenders.map(tender => 
        tender.id === id ? { ...tender, ...updates } : tender
      ));
      toast({
        title: t('notifications.updated'),
        description: t('notifications.tenderUpdated'),
      });
    } catch (error) {
      console.error("Error updating tender:", error);
      toast({
        title: t('errorMessages.updateFailed'),
        description: t('errorMessages.couldNotUpdateTender'),
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete a tender
  const deleteTender = async (id: string): Promise<void> => {
    try {
      await deleteTenderService(id);
      setTenders(tenders.filter(tender => tender.id !== id));
      toast({
        title: t('notifications.deleted'),
        description: t('notifications.tenderDeleted'),
      });
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast({
        title: t('errorMessages.deleteFailed'),
        description: t('errorMessages.couldNotDeleteTender'),
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create a milestone
  const createMilestone = async (tenderId: string, milestone: Partial<Milestone>): Promise<void> => {
    try {
      const newMilestone = await createMilestoneService({ ...milestone, tenderId });
      
      setTenders(tenders.map(tender => {
        if (tender.id === tenderId) {
          return {
            ...tender,
            milestones: [...tender.milestones, newMilestone as Milestone]
          };
        }
        return tender;
      }));
      
      toast({
        title: t('notifications.created'),
        description: t('notifications.milestoneCreated'),
      });
    } catch (error) {
      console.error("Error creating milestone:", error);
      toast({
        title: t('errorMessages.createFailed'),
        description: t('errorMessages.couldNotCreateMilestone'),
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update a milestone
  const updateMilestone = async (milestone: Milestone): Promise<void> => {
    try {
      await updateMilestoneService(milestone.id, milestone);
      
      setTenders(tenders.map(tender => {
        const updatedMilestones = tender.milestones.map(m => 
          m.id === milestone.id ? milestone : m
        );
        
        return {
          ...tender,
          milestones: updatedMilestones
        };
      }));
      
      toast({
        title: t('notifications.updated'),
        description: t('notifications.milestoneUpdated'),
      });
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast({
        title: t('errorMessages.updateFailed'),
        description: t('errorMessages.couldNotUpdateMilestone'),
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete a milestone
  const deleteMilestone = async (tenderId: string, milestoneId: string): Promise<void> => {
    try {
      await deleteMilestoneService(milestoneId);
      
      setTenders(tenders.map(tender => {
        if (tender.id === tenderId) {
          return {
            ...tender,
            milestones: tender.milestones.filter(m => m.id !== milestoneId)
          };
        }
        return tender;
      }));
      
      toast({
        title: t('notifications.deleted'),
        description: t('notifications.milestoneDeleted'),
      });
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast({
        title: t('errorMessages.deleteFailed'),
        description: t('errorMessages.couldNotDeleteMilestone'),
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <TenderContext.Provider value={{ 
      tenders, 
      isLoading, 
      createTender, 
      updateTender, 
      deleteTender, 
      createMilestone, 
      updateMilestone, 
      deleteMilestone 
    }}>
      {children}
    </TenderContext.Provider>
  );
};

export const useTender = () => {
  const context = useContext(TenderContext);
  if (context === undefined) {
    throw new Error("useTender must be used within a TenderProvider");
  }
  return context;
};
