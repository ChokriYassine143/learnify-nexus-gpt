import { useState } from "react";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/services/api";

export const useUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const getAllUsers = async () => {
    try {
      // Only admin should be able to get all users
      if (currentUser?.role !== "admin") {
        console.error("Unauthorized access to getAllUsers");
        return [];
      }
      
      const { data: users } = await userApi.getAllUsers();
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  
  const getUserById = async (userId: string) => {
    // Admin can get any user, users can only get themselves
    if (currentUser?.role !== "admin" && currentUser?.id !== userId) {
      console.error("Unauthorized access to user data");
      return undefined;
    }
    
    try {
      const { data: user } = await userApi.getUserById(userId);
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
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
    
    setIsLoading(true);
    
    try {
      // Don't allow changing role unless admin
      if (userData.role && currentUser?.role !== "admin") {
        delete userData.role;
      }
      
      const { data: updatedUser } = await userApi.updateUser(userId, userData);
      
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      
      return updatedUser;
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
    
    setIsLoading(true);
    
    try {
      const { data: user } = await userApi.getUserById(userId);
      
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive"
        });
        throw new Error("User not found");
      }
      
      const { data: updatedUser } = await userApi.updateUser(userId, {
        isDisabled: !user.isDisabled
      });
      
      toast({
        title: "Success",
        description: `User ${updatedUser.isDisabled ? "disabled" : "enabled"} successfully`
      });
      
      return updatedUser;
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
  
  const deleteUser = async (userId: string) => {
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
      await userApi.deleteUser(userId);
      
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      
      return true;
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
