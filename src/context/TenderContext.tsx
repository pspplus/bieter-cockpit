import React, { createContext, useState, useEffect } from "react";
import { Tender, Milestone, MilestoneStatus } from "@/types/tender";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchTenders, 
  createTender as createTenderService, 
  updateTender as updateTenderService,
  deleteTender as deleteTenderService,
  createMilestone as createMilestoneService,
  updateMilestone as updateMilestoneService,
  deleteMilestone as deleteMilestoneService
} from "@/services/tenderService";
import { toast } from "sonner";
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
  canUpdateMilestoneStatus: (milestone: Milestone, newStatus: MilestoneStatus) => boolean;
};

type TenderProviderProps = {
  children: React.ReactNode;
};

export const TenderContext = createContext<TenderContextType | undefined>(undefined);

export const TenderProvider: React.FC<TenderProviderProps> = ({ children }) => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetchTenders()
        .then((data) => {
          const tendersWithSortedMilestones = data.map(tender => ({
            ...tender,
            milestones: [...tender.milestones].sort((a, b) => {
              const seqA = typeof a.sequenceNumber === 'number' ? a.sequenceNumber : 0;
              const seqB = typeof b.sequenceNumber === 'number' ? b.sequenceNumber : 0;
              return seqA - seqB;
            })
          }));
          setTenders(tendersWithSortedMilestones);
        })
        .catch((error) => {
          console.error("Error loading tenders:", error);
          toast.error(t('errorMessages.couldNotLoadTenders', 'Could not load tenders'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthenticated, t]);

  const createTender = async (tenderData: Partial<Tender>): Promise<Tender> => {
    try {
      const milestones = tenderData.milestones || [];
      
      const { milestones: _, ...tenderDataWithoutMilestones } = tenderData;
      
      const newTender = await createTenderService(tenderDataWithoutMilestones);
      
      if (milestones.length > 0) {
        await Promise.all(
          milestones.map((milestone, index) => 
            createMilestoneService({ 
              ...milestone,
              sequenceNumber: typeof milestone.sequenceNumber === 'number' ? milestone.sequenceNumber : (index + 1),
              tenderId: newTender.id 
            })
          )
        );
        
        const updatedTender = { ...newTender, milestones };
        setTenders([updatedTender, ...tenders]);
        return updatedTender;
      }
      
      setTenders([newTender, ...tenders]);
      return newTender;
    } catch (error) {
      console.error("Error creating tender:", error);
      toast.error(t('errorMessages.couldNotCreateTender', 'Could not create tender'));
      throw error;
    }
  };

  const updateTender = async (id: string, updates: Partial<Tender>): Promise<void> => {
    try {
      await updateTenderService(id, updates);
      setTenders(tenders.map(tender => 
        tender.id === id ? { ...tender, ...updates } : tender
      ));
      toast.success(t('notifications.tenderUpdated', 'Tender updated'));
    } catch (error) {
      console.error("Error updating tender:", error);
      toast.error(t('errorMessages.couldNotUpdateTender', 'Could not update tender'));
      throw error;
    }
  };

  const deleteTender = async (id: string): Promise<void> => {
    try {
      await deleteTenderService(id);
      setTenders(tenders.filter(tender => tender.id !== id));
      toast.success(t('notifications.tenderDeleted', 'Tender deleted'));
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast.error(t('errorMessages.couldNotDeleteTender', 'Could not delete tender'));
      throw error;
    }
  };

  const canUpdateMilestoneStatus = (milestone: Milestone, newStatus: MilestoneStatus): boolean => {
    if (newStatus === "pending") {
      return true;
    }
    
    if (newStatus === "in-progress") {
      return true;
    }
    
    if (newStatus === "completed") {
      return milestone.status === "in-progress";
    }
    
    if (newStatus === "skipped") {
      return milestone.status === "pending";
    }
    
    return false;
  };

  const createMilestone = async (tenderId: string, milestone: Partial<Milestone>): Promise<void> => {
    try {
      const tender = tenders.find(t => t.id === tenderId);
      if (!tender) {
        throw new Error("Tender not found");
      }
      
      const nextSequenceNumber = tender.milestones.length > 0 
        ? Math.max(...tender.milestones.map(m => typeof m.sequenceNumber === 'number' ? m.sequenceNumber : 0)) + 1
        : 1;
      
      const milestoneWithSequence = {
        ...milestone,
        sequenceNumber: typeof milestone.sequenceNumber === 'number' ? milestone.sequenceNumber : nextSequenceNumber
      };
      
      const newMilestone = await createMilestoneService({ ...milestoneWithSequence, tenderId });
      
      setTenders(tenders.map(tender => {
        if (tender.id === tenderId) {
          const updatedMilestones = [...tender.milestones, newMilestone];
          updatedMilestones.sort((a, b) => {
            const seqA = typeof a.sequenceNumber === 'number' ? a.sequenceNumber : 0;
            const seqB = typeof b.sequenceNumber === 'number' ? b.sequenceNumber : 0;
            return seqA - seqB;
          });
          
          return {
            ...tender,
            milestones: updatedMilestones
          };
        }
        return tender;
      }));
      
      toast.success(t('notifications.milestoneCreated', 'Milestone created'));
    } catch (error) {
      console.error("Error creating milestone:", error);
      toast.error(t('errorMessages.couldNotCreateMilestone', 'Could not create milestone'));
      throw error;
    }
  };

  const updateMilestone = async (milestone: Milestone): Promise<void> => {
    try {
      const existingMilestone = tenders
        .flatMap(t => t.milestones)
        .find(m => m.id === milestone.id);
      
      if (existingMilestone && existingMilestone.status !== milestone.status) {
        const isAllowed = canUpdateMilestoneStatus(existingMilestone, milestone.status);
        
        if (!isAllowed) {
          toast.error(t('errorMessages.invalidMilestoneTransition', 'Diese Statusänderung ist nicht erlaubt.'));
          throw new Error("Invalid milestone status transition");
        }
      }
      
      const updatedMilestone = {
        ...milestone,
        sequenceNumber: typeof milestone.sequenceNumber === 'number' ? milestone.sequenceNumber : 
                        (existingMilestone && typeof existingMilestone.sequenceNumber === 'number' ? 
                         existingMilestone.sequenceNumber : 0)
      };
      
      await updateMilestoneService(updatedMilestone);
      
      setTenders(tenders.map(tender => {
        const updatedMilestones = tender.milestones.map(m => 
          m.id === milestone.id ? updatedMilestone : m
        );
        
        updatedMilestones.sort((a, b) => {
          const seqA = typeof a.sequenceNumber === 'number' ? a.sequenceNumber : 0;
          const seqB = typeof b.sequenceNumber === 'number' ? b.sequenceNumber : 0;
          return seqA - seqB;
        });
        
        return {
          ...tender,
          milestones: updatedMilestones
        };
      }));
      
      toast.success(t('notifications.milestoneUpdated', 'Milestone updated'));
    } catch (error) {
      console.error("Error updating milestone:", error);
      if (!(error instanceof Error && error.message === "Invalid milestone status transition")) {
        toast.error(t('errorMessages.couldNotUpdateMilestone', 'Could not update milestone'));
      }
      throw error;
    }
  };

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
      
      toast.success(t('notifications.milestoneDeleted', 'Milestone deleted'));
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error(t('errorMessages.couldNotDeleteMilestone', 'Could not delete milestone'));
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
      deleteMilestone,
      canUpdateMilestoneStatus
    }}>
      {children}
    </TenderContext.Provider>
  );
};

