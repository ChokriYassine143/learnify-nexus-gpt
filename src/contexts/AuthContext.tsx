
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  hasPurchasedCourses?: boolean; 
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
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
      // In a real app, this would check a token in localStorage and validate with the backend
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This is a mock implementation. In a real app, you would call your API
      // For demo purposes, we'll accept any login with valid format
      if (!email.includes('@') || password.length < 6) {
        throw new Error("Invalid email or password");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine role based on email prefix for demonstration
      let role: "student" | "teacher" | "admin" = "student";
      if (email.startsWith("teacher")) {
        role = "teacher";
      } else if (email.startsWith("admin")) {
        role = "admin";
      }
      
      const loggedInUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: email.split("@")[0],
        email,
        role,
      };
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${loggedInUser.name}!`,
      });
      
      return loggedInUser;
      
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
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This is a mock implementation. In a real app, you would call your API
      if (!email.includes('@') || password.length < 6 || name.length < 2) {
        throw new Error("Invalid registration details");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        role: "student" as const,
      };
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: "Registration successful",
        description: `Welcome to LearnifyNexus, ${name}!`,
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
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
