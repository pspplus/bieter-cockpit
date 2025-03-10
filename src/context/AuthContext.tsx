
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserMetadata {
  name?: string;
  avatarUrl?: string;
  email_notifications?: boolean;
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  getUserName: () => string;
  updateUserProfile: (data: Partial<UserMetadata>) => Promise<boolean>;
  getUserAvatar: () => string | undefined;
  getUserEmailNotifications: () => boolean;
  getLastSignIn: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Set longer session if rememberMe is true
          expiresIn: rememberMe ? 30 * 24 * 60 * 60 : 60 * 60, // 30 days vs 1 hour
        }
      });
      
      if (error) {
        throw error;
      }
      
      setUser(data.user);
      
      toast({
        title: "Erfolgreich angemeldet",
        description: "Sie sind jetzt eingeloggt.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message || "Bitte überprüfen Sie Ihre Anmeldedaten",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatarUrl: "",
            email_notifications: true,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      setUser(data.user);
      
      toast({
        title: "Konto erstellt",
        description: "Ihr Konto wurde erfolgreich erstellt.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Bitte überprüfen Sie Ihre Daten",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "E-Mail gesendet",
        description: "Eine E-Mail zum Zurücksetzen Ihres Passworts wurde gesendet.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Passwort-Zurücksetzung fehlgeschlagen",
        description: error.message || "Bitte überprüfen Sie Ihre E-Mail-Adresse",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Passwort aktualisiert",
        description: "Ihr Passwort wurde erfolgreich aktualisiert.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Passwort-Aktualisierung fehlgeschlagen",
        description: error.message || "Bitte versuchen Sie es später erneut",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserMetadata>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get current user metadata
      const currentMetadata = user?.user_metadata || {};
      
      // Update metadata with new data
      const { error } = await supabase.auth.updateUser({
        data: { ...currentMetadata, ...data }
      });
      
      if (error) {
        throw error;
      }
      
      // Re-fetch user to get updated metadata
      const { data: { user: updatedUser }, error: fetchError } = await supabase.auth.getUser();
      
      if (fetchError) {
        throw fetchError;
      }
      
      setUser(updatedUser);
      
      toast({
        title: "Profil aktualisiert",
        description: "Ihre Profildaten wurden erfolgreich aktualisiert.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Profil-Aktualisierung fehlgeschlagen",
        description: error.message || "Bitte versuchen Sie es später erneut",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: error.message || "Es gab ein Problem bei der Abmeldung",
        variant: "destructive",
      });
    }
  };

  const getUserName = (): string => {
    if (!user) return "";
    
    const metadata = user.user_metadata as UserMetadata;
    return metadata?.name || "User";
  };

  const getUserAvatar = (): string | undefined => {
    if (!user) return undefined;
    
    const metadata = user.user_metadata as UserMetadata;
    return metadata?.avatarUrl;
  };

  const getUserEmailNotifications = (): boolean => {
    if (!user) return true;
    
    const metadata = user.user_metadata as UserMetadata;
    return metadata?.email_notifications !== false; // Default to true if not set
  };

  const getLastSignIn = (): string | null => {
    if (!user || !user.last_sign_in_at) return null;
    return user.last_sign_in_at;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        getUserName,
        updateUserProfile,
        getUserAvatar,
        getUserEmailNotifications,
        getLastSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
