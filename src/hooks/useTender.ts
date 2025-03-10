
import { useContext } from 'react';
import { TenderContext } from '@/context/TenderContext';

/**
 * Hook for accessing the tender context
 */
export const useTender = () => {
  const context = useContext(TenderContext);
  
  if (context === undefined) {
    console.error("useTender: TenderContext ist undefined. Stellen Sie sicher, dass Sie den TenderProvider korrekt eingerichtet haben.");
    throw new Error("useTender must be used within a TenderProvider");
  }
  
  // Log context values for debugging
  console.log("useTender Hook aufgerufen", {
    tendersCount: context.tenders.length,
    isLoading: context.isLoading,
    hasError: !!context.error,
    errorMessage: context.error?.message
  });
  
  return context;
};
