
import React, { createContext, useContext } from "react";
import { Milestone, MilestoneStatus } from "@/types/tender";
import { 
  createMilestone as createMilestoneService,
  updateMilestone as updateMilestoneService,
  deleteMilestone as deleteMilestoneService
} from "@/services/milestoneService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useTender } from "@/hooks/useTender";

type MilestoneContextType = {
  createMilestone: (tenderId: string, milestone: Partial<Milestone>) => Promise<void>;
  updateMilestone: (milestone: Milestone) => Promise<void>;
  deleteMilestone: (tenderId: string, milestoneId: string) => Promise<void>;
};

type MilestoneProviderProps = {
  children: React.ReactNode;
};

export const MilestoneContext = createContext<MilestoneContextType | undefined>(undefined);

export const MilestoneProvider: React.FC<MilestoneProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const { updateTenderMilestones } = useTender();

  const createMilestone = async (tenderId: string, milestone: Partial<Milestone>): Promise<void> => {
    try {
      const newMilestone = await createMilestoneService({ ...milestone, tenderId });
      
      updateTenderMilestones(tenderId, (currentMilestones) => [
        ...currentMilestones,
        newMilestone as Milestone
      ]);
      
      toast.success(t('notifications.milestoneCreated', 'Milestone created'));
    } catch (error) {
      console.error("Error creating milestone:", error);
      toast.error(t('errorMessages.couldNotCreateMilestone', 'Could not create milestone'));
      throw error;
    }
  };

  const updateMilestone = async (milestone: Milestone): Promise<void> => {
    try {
      await updateMilestoneService(milestone.id, milestone);
      
      if (milestone.tenderId) {
        updateTenderMilestones(milestone.tenderId, (currentMilestones) => 
          currentMilestones.map(m => m.id === milestone.id ? milestone : m)
        );
      }
      
      toast.success(t('notifications.milestoneUpdated', 'Milestone updated'));
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error(t('errorMessages.couldNotUpdateMilestone', 'Could not update milestone'));
      throw error;
    }
  };

  const deleteMilestone = async (tenderId: string, milestoneId: string): Promise<void> => {
    try {
      await deleteMilestoneService(milestoneId);
      
      updateTenderMilestones(tenderId, (currentMilestones) => 
        currentMilestones.filter(m => m.id !== milestoneId)
      );
      
      toast.success(t('notifications.milestoneDeleted', 'Milestone deleted'));
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error(t('errorMessages.couldNotDeleteMilestone', 'Could not delete milestone'));
      throw error;
    }
  };

  return (
    <MilestoneContext.Provider value={{ 
      createMilestone, 
      updateMilestone, 
      deleteMilestone 
    }}>
      {children}
    </MilestoneContext.Provider>
  );
};

export const useMilestone = () => {
  const context = useContext(MilestoneContext);
  if (context === undefined) {
    throw new Error("useMilestone must be used within a MilestoneProvider");
  }
  return context;
};
