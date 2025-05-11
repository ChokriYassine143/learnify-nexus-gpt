
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { localStorageService, User } from "@/services/localStorageService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "student" | "teacher" | "admin";
  }) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem("currentUser");
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    
    try {
      // In a real app, we would validate the password too
      // For demo purposes, we'll just find the user by email
      const foundUser = localStorageService.getUserByEmail(email);
      
      if (!foundUser) {
        throw new Error("User not found");
      }
      
      // Check if user is disabled
      if (foundUser.isDisabled) {
        throw new Error("Your account has been disabled. Please contact support.");
      }
      
      // Store current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setUser(foundUser);
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return foundUser;
      
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const register = async ({ firstName, lastName, email, password, role }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "student" | "teacher" | "admin";
  }) => {
    setIsLoading(true);
    
    try {
      // Check if user already exists
      const existingUser = localStorageService.getUserByEmail(email);
      if (existingUser) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: `${firstName} ${lastName}`,
        email,
        role,
      };
      
      // Add user to localStorage
      localStorageService.addUser(newUser);
      
      // Auto login after registration
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: "Registration successful",
        description: `Welcome to LearnUp, ${firstName}!`,
      });
      
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (userData: Partial<User>): Promise<User> => {
    if (!user) throw new Error("Not authenticated");
    
    try {
      const updatedUser = { ...user, ...userData };
      
      // Update user in localStorage
      localStorageService.updateUser(updatedUser);
      
      // Update current user
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      return updatedUser;
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
