
import { useContext } from 'react';
import { MilestoneContext } from '@/context/MilestoneContext';

/**
 * Hook for accessing the milestone context
 */
export const useMilestone = () => {
  const context = useContext(MilestoneContext);
  if (context === undefined) {
    throw new Error("useMilestone must be used within a MilestoneProvider");
  }
  return context;
};
