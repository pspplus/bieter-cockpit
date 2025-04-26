
import { useState } from "react";
import { Milestone, MilestoneStatus, Tender } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { createMilestone as createMilestoneService, updateMilestone as updateMilestoneService, deleteMilestone as deleteMilestoneService } from "@/services/milestoneService";
import { canUpdateMilestoneStatus } from "./milestoneUtils";

export const useMilestoneOperations = (setTenders: React.Dispatch<React.SetStateAction<Tender[]>>) => {
  const { t } = useTranslation();

  const createMilestone = async (tenderId: string, milestone: Partial<Milestone>): Promise<void> => {
    try {
      const newMilestone = await createMilestoneService({ 
        ...milestone, 
        tenderId,
        status: milestone.status || 'ausstehend'
      });
      
      setTenders(tenders => tenders.map(tender => {
        if (tender.id === tenderId) {
          const updatedMilestones = [...tender.milestones, newMilestone].sort((a, b) => 
            (a.sequenceNumber || 0) - (b.sequenceNumber || 0)
          );
          return { ...tender, milestones: updatedMilestones };
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
      if (!canUpdateMilestoneStatus(milestone, milestone.status)) {
        toast.error(t('errorMessages.invalidMilestoneTransition'));
        throw new Error("Invalid milestone status transition");
      }
      
      await updateMilestoneService(milestone.id, milestone);
      
      setTenders(tenders => tenders.map(tender => ({
        ...tender,
        milestones: tender.milestones
          .map(m => m.id === milestone.id ? milestone : m)
          .sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0))
      })));
      
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
      
      setTenders(tenders => tenders.map(tender => {
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

  return { createMilestone, updateMilestone, deleteMilestone };
};
