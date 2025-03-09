
import { toast } from "sonner";

// Re-export toast for consistent usage
export { toast };

// Export the useToast hook for backward compatibility with existing code
export const useToast = () => {
  return {
    toast,
  };
};
