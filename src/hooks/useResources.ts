
import { useState } from "react";
import { localStorageService, Resource } from "@/services/localStorageService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useResources = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getAllResources = (limit?: number) => {
    try {
      const resources = localStorageService.getResources();
      
      // Sort by most recent
      const sortedResources = [...resources].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      if (limit) {
        return sortedResources.slice(0, limit);
      }
      return sortedResources;
    } catch (error) {
      console.error("Error fetching resources:", error);
      return [];
    }
  };
  
  const getResourceById = (resourceId: string) => {
    return localStorageService.getResourceById(resourceId);
  };
  
  const getResourcesByCourse = (courseId: string) => {
    return localStorageService.getResourcesByCourse(courseId);
  };
  
  const createResource = async (resourceData: Omit<Resource, "id" | "createdAt" | "addedBy" | "addedById">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a resource",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    setIsLoading(true);
    
    try {
      const newResource: Resource = {
        id: `resource-${Math.random().toString(36).substr(2, 9)}`,
        ...resourceData,
        addedBy: user.name,
        addedById: user.id,
        createdAt: new Date().toISOString()
      };
      
      const createdResource = localStorageService.addResource(newResource);
      
      toast({
        title: "Success",
        description: "Resource added successfully"
      });
      
      return createdResource;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateResource = async (resourceId: string, resourceData: Partial<Resource>) => {
    const existingResource = localStorageService.getResourceById(resourceId);
    
    if (!existingResource) {
      toast({
        title: "Error",
        description: "Resource not found",
        variant: "destructive"
      });
      throw new Error("Resource not found");
    }
    
    setIsLoading(true);
    
    try {
      const updatedResource: Resource = {
        ...existingResource,
        ...resourceData
      };
      
      const result = localStorageService.updateResource(updatedResource);
      
      toast({
        title: "Success",
        description: "Resource updated successfully"
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteResource = (resourceId: string) => {
    try {
      const success = localStorageService.deleteResource(resourceId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Resource deleted successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete resource",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    getAllResources,
    getResourceById,
    getResourcesByCourse,
    createResource,
    updateResource,
    deleteResource,
    isLoading
  };
};
