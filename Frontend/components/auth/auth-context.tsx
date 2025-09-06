"use client";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { AuthService, type User } from "@/lib/auth-service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (AuthService.isAuthenticated()) {
          const currentUser = AuthService.getCurrentUser();
          if (currentUser) {
            // Validate token by making a test request
            const isValid = await AuthService.validateToken();
            if (isValid) {
              setUser(currentUser);
            } else {
              // Token is invalid, clear auth data
              await AuthService.logout();
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // Clear auth data on error
        await AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await AuthService.login({ email, password });

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return true;
      } else {
        console.error("Login failed:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    username: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await AuthService.signup({ email, password, username });

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return true;
      } else {
        console.error("Signup failed:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setUser(null);
      // Redirect to login page after logout
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const updateProfile = async (
    profileData: Partial<User>
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await AuthService.updateProfile(profileData);

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return true;
      } else {
        console.error("Profile update failed:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Profile update error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
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
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
