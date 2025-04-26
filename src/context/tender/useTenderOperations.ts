
import { useState } from "react";
import { Tender } from "@/types/tender";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { 
  createTender as createTenderService,
  updateTender as updateTenderService,
  deleteTender as deleteTenderService,
  fetchTenderById
} from "@/services/tenderService";
import { fetchTenders } from "@/services/tenderService";

export const useTenderOperations = (
  setTenders: React.Dispatch<React.SetStateAction<Tender[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { t } = useTranslation();

  const createTender = async (tenderData: Partial<Tender>): Promise<Tender> => {
    try {
      const newTender = await createTenderService(tenderData);
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
      setTenders(tenders => tenders.map(tender => 
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
      setTenders(tenders => tenders.filter(tender => tender.id !== id));
      toast.success(t('notifications.tenderDeleted'));
    } catch (error) {
      console.error("Error deleting tender:", error);
      toast.error(t('errorMessages.couldNotDeleteTender'));
      throw error;
    }
  };

  const loadTender = async (id: string): Promise<Tender | null> => {
    try {
      console.log("Loading tender with ID:", id);
      const tender = await fetchTenderById(id);
      if (tender) {
        setTenders(prev => {
          const existing = prev.find(t => t.id === tender.id);
          if (existing) {
            return prev.map(t => t.id === tender.id ? tender : t);
          }
          return [...prev, tender];
        });
      }
      return tender;
    } catch (error) {
      console.error("Error loading tender:", error);
      toast.error(t("errorMessages.couldNotLoadTender"));
      return null;
    }
  };

  return { createTender, updateTender, deleteTender, loadTender };
};
