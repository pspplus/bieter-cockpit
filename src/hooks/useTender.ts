
import { useContext } from 'react';
import { TenderContext } from '@/context/TenderContext';

/**
 * Hook for accessing the tender context
 * @returns The tender context
 * @throws Error if used outside of a TenderProvider
 */
export const useTender = () => {
  const context = useContext(TenderContext);
  
  if (context === undefined) {
    throw new Error("useTender must be used within a TenderProvider");
  }
  
  return context;
};
