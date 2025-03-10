
import { useContext } from 'react';
import { TenderContext } from '@/context/TenderContext';

/**
 * Hook for accessing the tender context
 */
export const useTender = () => {
  // Wrap in try-catch to provide better error messaging
  try {
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
  } catch (error) {
    console.error("Error in useTender hook:", error);
    // Re-throw with more context to help debugging
    throw new Error(`useTender error: ${error instanceof Error ? error.message : String(error)}`);
  }
};
