import React, { createContext, useState, useEffect, useCallback } from "react";
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
  error: Error | null;
  refetchTenders: () => Promise<void>;
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
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const sortMilestones = (milestones: Milestone[]): Milestone[] => {
    return [...milestones].sort((a, b) => {
      const seqA = typeof a.sequenceNumber === 'number' ? a.sequenceNumber : 0;
      const seqB = typeof b.sequenceNumber === 'number' ? b.sequenceNumber : 0;
      return seqA - seqB;
    });
  };

  const loadTenders = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchTenders();
      const tendersWithSortedMilestones = data.map(tender => ({
        ...tender,
        milestones: sortMilestones(tender.milestones)
      }));
      setTenders(tendersWithSortedMilestones);
    } catch (err) {
      console.error("Error loading tenders:", err);
      setError(err instanceof Error ? err : new Error("Failed to load tenders"));
      toast.error(t('errorMessages.couldNotLoadTenders', "Fehler beim Laden der Ausschreibungen"));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, t]);

  useEffect(() => {
    loadTenders();
  }, [loadTenders]);

  const refetchTenders = useCallback(async () => {
    await loadTenders();
  }, [loadTenders]);

  const createTender = async (tenderData: Partial<Tender>): Promise<Tender> => {
    try {
      const partialMilestones = tenderData.milestones || [];
      
      const { milestones: _, ...tenderDataWithoutMilestones } = tenderData;
      
      const newTender = await createTenderService(tenderDataWithoutMilestones);
      
      if (partialMilestones.length > 0) {
        await Promise.all(
          partialMilestones.map((milestone, index) => 
            createMilestoneService({ 
              ...milestone,
              sequenceNumber: milestone.sequenceNumber || index + 1,
              tenderId: newTender.id 
            })
          )
        );
        
        const updatedTender = await fetchTenders()
          .then(tenders => tenders.find(t => t.id === newTender.id))
          .catch(error => {
            console.error("Error fetching updated tender:", error);
            return newTender;
          });
          
        if (updatedTender) {
          const sortedMilestones = sortMilestones(updatedTender.milestones);
          const finalTender = { ...updatedTender, milestones: sortedMilestones };
          setTenders(prev => [finalTender, ...prev.filter(t => t.id !== finalTender.id)]);
          return finalTender;
        }
      }
      
      setTenders(prev => [newTender, ...prev]);
      return newTender;
    } catch (error) {
      console.error("Error creating tender:", error);
      toast.error(t('errorMessages.couldNotCreateTender'));
      throw error;
    }
  };

  const updateTender = async (id: string, updates: Partial<Tender>): Promise<void> => {
    try {
      await updateTenderService(id, updates);
      setTenders(tenders.map(tender => 
        tender.id === id ? { ...tender, ...updates } : tender
      ));
      toast.success(t('notifications.tenderUpdated'));
    } catch (error) {
      console.error("Error updating tender:", error);
      toast.error(t('errorMessages.couldNotUpdateTender'));
      throw error;
    }
  };

  const deleteTender = async (id: string): Promise<void> => {
    try {
      await deleteTenderService(id);
      setTenders(tenders.filter(tender => tender.id !== id));
      toast.success(t('notifications.tenderDeleted'));
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast.error(t('errorMessages.couldNotDeleteTender'));
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
      
      if (typeof milestone.sequenceNumber !== 'number') {
        const maxSequence = Math.max(0, ...tender.milestones.map(m => m.sequenceNumber || 0));
        milestone.sequenceNumber = maxSequence + 1;
      }
      
      const newMilestone = await createMilestoneService({ ...milestone, tenderId });
      
      setTenders(tenders.map(tender => {
        if (tender.id === tenderId) {
          const updatedMilestones = sortMilestones([...tender.milestones, newMilestone]);
          
          return {
            ...tender,
            milestones: updatedMilestones
          };
        }
        return tender;
      }));
      
      toast.success(t('notifications.milestoneCreated'));
    } catch (error) {
      console.error("Error creating milestone:", error);
      toast.error(t('errorMessages.couldNotCreateMilestone'));
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
          toast.error(t('errorMessages.invalidMilestoneTransition'));
          throw new Error("Invalid milestone status transition");
        }
      }
      
      const updatedMilestone = {
        ...milestone,
        sequenceNumber: milestone.sequenceNumber || 0
      };
      
      await updateMilestoneService(updatedMilestone);
      
      setTenders(tenders.map(tender => {
        const updatedMilestones = tender.milestones.map(m => 
          m.id === milestone.id ? updatedMilestone : m
        );
        
        return {
          ...tender,
          milestones: sortMilestones(updatedMilestones)
        };
      }));
      
      toast.success(t('notifications.milestoneUpdated'));
    } catch (error) {
      console.error("Error updating milestone:", error);
      if (!(error instanceof Error && error.message === "Invalid milestone status transition")) {
        toast.error(t('errorMessages.couldNotUpdateMilestone'));
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
      
      toast.success(t('notifications.milestoneDeleted'));
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error(t('errorMessages.couldNotDeleteMilestone'));
      throw error;
    }
  };

  return (
    <TenderContext.Provider value={{ 
      tenders, 
      isLoading,
      error, 
      refetchTenders,
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
