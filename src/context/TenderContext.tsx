
import React, { createContext, useContext, useState, useEffect } from "react";
import { Tender, Milestone, MilestoneStatus } from "@/types/tender";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchTenders, 
  fetchTenderById, 
  createTender as createTenderService, 
  updateTender as updateTenderService,
  updateMilestone as updateMilestoneService,
  setMilestoneStatus as setMilestoneStatusService
} from "@/services/tenderService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface TenderContextType {
  tenders: Tender[];
  activeTender: Tender | null;
  isLoading: boolean;
  error: Error | null;
  loadTender: (id: string) => void;
  createTender: (tenderData: Partial<Tender>) => Promise<Tender>;
  updateTender: (id: string, updates: Partial<Tender>) => Promise<void>;
  updateMilestone: (tenderId: string, milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  setMilestoneStatus: (tenderId: string, milestoneId: string, status: MilestoneStatus) => Promise<void>;
}

const TenderContext = createContext<TenderContextType | undefined>(undefined);

export const TenderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [activeTender, setActiveTender] = useState<Tender | null>(null);
  const queryClient = useQueryClient();

  // Fetch all tenders
  const { 
    data: tenders = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['tenders'],
    queryFn: fetchTenders,
    enabled: isAuthenticated,
  });

  // Create a tender mutation
  const createTenderMutation = useMutation({
    mutationFn: createTenderService,
    onSuccess: (newTender) => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      toast.success(t('toasts.tenderCreated'));
      return newTender;
    },
    onError: (error) => {
      console.error('Error creating tender:', error);
      toast.error(t('toasts.errorCreatingTender'));
      throw error;
    }
  });

  // Update a tender mutation
  const updateTenderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Tender> }) => {
      await updateTenderService(id, updates);
      return { id, updates };
    },
    onSuccess: ({ id, updates }) => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      
      // Update the active tender if it's the one being updated
      if (activeTender?.id === id) {
        setActiveTender(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }
      
      toast.success(t('toasts.tenderUpdated'));
    },
    onError: (error) => {
      console.error('Error updating tender:', error);
      toast.error(t('toasts.errorUpdatingTender'));
    }
  });

  // Update a milestone mutation
  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ tenderId, milestoneId, updates }: { tenderId: string; milestoneId: string; updates: Partial<Milestone> }) => {
      await updateMilestoneService(tenderId, milestoneId, updates);
      return { tenderId, milestoneId, updates };
    },
    onSuccess: ({ tenderId, milestoneId, updates }) => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      
      // Update the active tender milestone if it's being edited
      if (activeTender?.id === tenderId) {
        setActiveTender(prev => {
          if (!prev) return null;
          
          const updatedMilestones = prev.milestones.map(milestone => 
            milestone.id === milestoneId 
              ? { ...milestone, ...updates } 
              : milestone
          );
          
          return {
            ...prev,
            milestones: updatedMilestones,
            updatedAt: new Date()
          };
        });
      }
    },
    onError: (error) => {
      console.error('Error updating milestone:', error);
      toast.error(t('toasts.errorUpdatingMilestone'));
    }
  });

  // Set milestone status mutation
  const setMilestoneStatusMutation = useMutation({
    mutationFn: async ({ tenderId, milestoneId, status }: { tenderId: string; milestoneId: string; status: MilestoneStatus }) => {
      await setMilestoneStatusService(tenderId, milestoneId, status);
      return { tenderId, milestoneId, status };
    },
    onSuccess: ({ tenderId, milestoneId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      
      const statusToastMessages = {
        'pending': t('toasts.milestoneReset'),
        'in-progress': t('toasts.milestoneInProgress'),
        'completed': t('toasts.milestoneCompleted'),
        'skipped': t('toasts.milestoneSkipped')
      };
      
      toast.success(statusToastMessages[status]);
    },
    onError: (error) => {
      console.error('Error setting milestone status:', error);
      toast.error(t('toasts.errorUpdatingMilestone'));
    }
  });

  const loadTender = async (id: string) => {
    try {
      const tender = await fetchTenderById(id);
      setActiveTender(tender);
    } catch (error) {
      console.error('Error loading tender:', error);
      toast.error(t('toasts.errorLoadingTender'));
    }
  };

  const createTender = async (tenderData: Partial<Tender>): Promise<Tender> => {
    return createTenderMutation.mutateAsync(tenderData);
  };

  const updateTender = async (id: string, updates: Partial<Tender>): Promise<void> => {
    await updateTenderMutation.mutateAsync({ id, updates });
  };

  const updateMilestone = async (tenderId: string, milestoneId: string, updates: Partial<Milestone>): Promise<void> => {
    await updateMilestoneMutation.mutateAsync({ tenderId, milestoneId, updates });
  };

  const setMilestoneStatus = async (tenderId: string, milestoneId: string, status: MilestoneStatus): Promise<void> => {
    await setMilestoneStatusMutation.mutateAsync({ tenderId, milestoneId, status });
  };

  const value = {
    tenders,
    activeTender,
    isLoading,
    error: error as Error | null,
    loadTender,
    createTender,
    updateTender,
    updateMilestone,
    setMilestoneStatus
  };

  return <TenderContext.Provider value={value}>{children}</TenderContext.Provider>;
};

export const useTender = () => {
  const context = useContext(TenderContext);
  if (context === undefined) {
    throw new Error("useTender must be used within a TenderProvider");
  }
  return context;
};
