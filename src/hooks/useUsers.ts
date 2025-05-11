
import { useState } from "react";
import { localStorageService, User } from "@/services/localStorageService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const getAllUsers = () => {
    try {
      // Only admin should be able to get all users
      if (currentUser?.role !== "admin") {
        console.error("Unauthorized access to getAllUsers");
        return [];
      }
      
      return localStorageService.getUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  
  const getUserById = (userId: string) => {
    // Admin can get any user, users can only get themselves
    if (currentUser?.role !== "admin" && currentUser?.id !== userId) {
      console.error("Unauthorized access to user data");
      return undefined;
    }
    
    return localStorageService.getUserById(userId);
  };
  
  const updateUser = async (userId: string, userData: Partial<User>) => {
    // Admin can update any user, users can only update themselves
    if (currentUser?.role !== "admin" && currentUser?.id !== userId) {
      toast({
        title: "Error",
        description: "You don't have permission to update this user",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    const existingUser = localStorageService.getUserById(userId);
    
    if (!existingUser) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive"
      });
      throw new Error("User not found");
    }
    
    setIsLoading(true);
    
    try {
      // Don't allow changing role unless admin
      if (userData.role && currentUser?.role !== "admin") {
        delete userData.role;
      }
      
      const updatedUser: User = {
        ...existingUser,
        ...userData
      };
      
      const result = localStorageService.updateUser(updatedUser);
      
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleUserStatus = async (userId: string) => {
    // Only admin can toggle user status
    if (currentUser?.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to perform this action",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    const existingUser = localStorageService.getUserById(userId);
    
    if (!existingUser) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive"
      });
      throw new Error("User not found");
    }
    
    setIsLoading(true);
    
    try {
      const updatedUser: User = {
        ...existingUser,
        isDisabled: !existingUser.isDisabled
      };
      
      const result = localStorageService.updateUser(updatedUser);
      
      toast({
        title: "Success",
        description: `User ${updatedUser.isDisabled ? "disabled" : "enabled"} successfully`
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteUser = (userId: string) => {
    // Only admin can delete users
    if (currentUser?.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to delete users",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const success = localStorageService.deleteUser(userId);
      
      if (success) {
        toast({
          title: "Success",
          description: "User deleted successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    getAllUsers,
    getUserById,
    updateUser,
    toggleUserStatus,
    deleteUser,
    isLoading
  };
};
