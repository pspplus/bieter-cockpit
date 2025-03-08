
import React, { createContext, useContext, useState, useEffect } from "react";
import { Tender, Milestone, MilestoneStatus } from "@/types/tender";
import { mockTenders } from "@/data/mock-tenders";
import { v4 as uuidv4 } from 'uuid';
import { generateMilestones } from "@/data/milestones";
import { toast } from "sonner";

interface TenderContextType {
  tenders: Tender[];
  activeTender: Tender | null;
  loadTender: (id: string) => void;
  createTender: (tenderData: Partial<Tender>) => Tender;
  updateTender: (id: string, updates: Partial<Tender>) => void;
  updateMilestone: (tenderId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  setMilestoneStatus: (tenderId: string, milestoneId: string, status: MilestoneStatus) => void;
}

const TenderContext = createContext<TenderContextType | undefined>(undefined);

export const TenderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [activeTender, setActiveTender] = useState<Tender | null>(null);

  useEffect(() => {
    // Load mock data
    setTenders(mockTenders);
  }, []);

  const loadTender = (id: string) => {
    const tender = tenders.find(t => t.id === id) || null;
    setActiveTender(tender);
  };

  const createTender = (tenderData: Partial<Tender>): Tender => {
    const newTender: Tender = {
      id: uuidv4(),
      title: tenderData.title || "New Tender",
      reference: tenderData.reference || `REF-${Date.now().toString().slice(-6)}`,
      client: tenderData.client || "",
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: tenderData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default: 30 days from now
      milestones: generateMilestones(),
      ...tenderData,
    };

    setTenders(prev => [...prev, newTender]);
    toast.success("New tender created successfully");
    return newTender;
  };

  const updateTender = (id: string, updates: Partial<Tender>) => {
    setTenders(prev => 
      prev.map(tender => 
        tender.id === id 
          ? { ...tender, ...updates, updatedAt: new Date() } 
          : tender
      )
    );

    if (activeTender?.id === id) {
      setActiveTender(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
    
    toast.success("Tender updated successfully");
  };

  const updateMilestone = (tenderId: string, milestoneId: string, updates: Partial<Milestone>) => {
    setTenders(prev => 
      prev.map(tender => {
        if (tender.id !== tenderId) return tender;
        
        const updatedMilestones = tender.milestones.map(milestone => 
          milestone.id === milestoneId 
            ? { ...milestone, ...updates } 
            : milestone
        );
        
        return { 
          ...tender, 
          milestones: updatedMilestones,
          updatedAt: new Date() 
        };
      })
    );

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
  };

  const setMilestoneStatus = (tenderId: string, milestoneId: string, status: MilestoneStatus) => {
    const updates: Partial<Milestone> = { 
      status, 
      completionDate: status === 'completed' ? new Date() : undefined
    };
    
    updateMilestone(tenderId, milestoneId, updates);
    
    const statusMessages = {
      'pending': 'Milestone reset to pending',
      'in-progress': 'Milestone marked as in progress',
      'completed': 'Milestone completed',
      'skipped': 'Milestone skipped'
    };
    
    toast.success(statusMessages[status]);
  };

  const value = {
    tenders,
    activeTender,
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
