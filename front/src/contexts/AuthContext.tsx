import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

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
  updatePreferences: (preferences: User["preferences"]) => Promise<User>;
  enrollInCourse: (courseId: string) => Promise<void>;
  unenrollFromCourse: (courseId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface CourseProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  quizScores: { [key: string]: number };
  lastAccessed: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const { data: currentUser } = await api.get<User>('/auth/me');
            if (currentUser && !currentUser.isDisabled) {
              const normalizedUser = { ...currentUser, id: currentUser.id };
              setUser(normalizedUser);
            } else {
              // Only clear auth if user is disabled
              if (currentUser?.isDisabled) {
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
                setUser(null);
                toast({
                  title: "Account Deactivated",
                  description: "Your account has been deactivated. Please contact support.",
                  variant: "destructive",
                });
              }
            }
          } catch (error) {
            // Only clear auth if it's an authentication error
            if (error.response?.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("currentUser");
              setUser(null);
            }
            console.error("Error checking auth:", error);
          }
        }
      } catch (error) {
        console.error("Error in auth check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const { data } = await api.post<{ user: User; token: string }>("/auth/login", { email, password });
      const { user: loggedInUser, token } = data;
      const normalizedUser = { ...loggedInUser, id: loggedInUser.id };
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${normalizedUser.name || normalizedUser.firstName || "User"}!`,
      });
      return normalizedUser;
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        toast({
          title: "Account Deactivated",
          description: "Your account has been deactivated. Please contact support.",
          variant: "destructive",
        });
        return Promise.reject();
      } else {
        toast({
          title: "Login failed",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/");
    }
  };

  const register = async ({
    firstName,
    lastName,
    email,
    password,
    role,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "student" | "teacher" | "admin";
  }) => {
    setIsLoading(true);

    try {
      const { data } = await api.post<{ user: User; token: string }>("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        role,
      });

      const { user: createdUser, token } = data;
      const normalizedUser = { ...createdUser, id: createdUser.id };
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
      setUser(normalizedUser);

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
      const { data: updatedUser } = await api.put<User>(`/users/${user.id}`, userData);
      const normalizedUser = { ...updatedUser, id: updatedUser.id };
      localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      return normalizedUser;
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePreferences = async (preferences: User["preferences"]): Promise<User> => {
    if (!user) throw new Error("Not authenticated");

    try {
      const { data: updatedUser } = await api.put<User>(`/users/${user.id}/preferences`, preferences);
      const normalizedUser = { ...updatedUser, id: updatedUser.id };
      localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully.",
      });

      return normalizedUser;
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!user || !user.id) return;

    try {
      // Get the latest user data
      const { data: userData } = await api.get<User>(`/users/${user.id}`);
      
      // Get user's enrollments
      const { data: enrollments } = await api.get<{ courseId: string }[]>(`/users/${user.id}/enrollments`);
      
      // Handle both cases: array of course objects or array of IDs
      let enrolledCourseIds: string[] = [];
      if (Array.isArray(enrollments) && enrollments.length > 0) {
        if (typeof enrollments[0] === "string") {
          enrolledCourseIds = enrollments;
        } else if (typeof enrollments[0] === "object") {
          enrolledCourseIds = enrollments.map(
            (e) => e._id || e.id || e.courseId
          );
        }
      }

      // Normalize the user data to match our User type
      const normalizedUser = {
        ...userData,
        id: userData.id || userData._id,
        name: userData.name || `${userData.firstName} ${userData.lastName}`,
        enrolledCourses: enrolledCourseIds
      };

      // Update local storage and state
      localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh user data",
        variant: "destructive",
      });
    }
  };

  const enrollInCourse = async (courseId: string): Promise<void> => {
    if (!user) throw new Error("Not authenticated");

    try {
      await api.post(`/courses/${courseId}/enroll`, { userId: user.id });
      
      // Add a small delay to ensure backend has processed the enrollment
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh user data from server
      await refreshUser();

      toast({
        title: "Enrolled successfully",
        description: "You have been enrolled in the course.",
      });
    } catch (error) {
      toast({
        title: "Enrollment failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const unenrollFromCourse = async (courseId: string): Promise<void> => {
    if (!user) throw new Error("Not authenticated");

    try {
      await api.post(`/courses/${courseId}/unenroll`, { userId: user.id });
      
      // Refresh user data from server instead of updating locally
      await refreshUser();

      toast({
        title: "Unenrolled successfully",
        description: "You have been unenrolled from the course.",
      });
    } catch (error) {
      toast({
        title: "Unenrollment failed",
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
        updateProfile,
        updatePreferences,
        enrollInCourse,
        unenrollFromCourse,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
