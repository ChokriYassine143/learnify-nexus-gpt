import { useState } from "react";
import { Resource } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { resourceService } from "@/services/resourceService";

export const useResources = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getAllResources = async () => {
    try {
      const resources = await resourceService.getAllResources();
      return resources;
    } catch (error) {
      console.error("Error fetching resources:", error);
      return [];
    }
  };
  
  const getResourceById = async (resourceId: string) => {
    try {
      const resource = await resourceService.getResource(resourceId);
      return resource;
    } catch (error) {
      console.error("Error fetching resource:", error);
      return undefined;
    }
  };
  
  const getResourcesByCourse = async (courseId: string) => {
    try {
      const resources = await resourceService.getResourcesByCourse(courseId);
      return resources;
    } catch (error) {
      console.error("Error fetching course resources:", error);
      return [];
    }
  };
  
  const getResourcesByModule = async (moduleId: string) => {
    try {
      const resources = await resourceService.getResourcesByModule(moduleId);
      return resources;
    } catch (error) {
      console.error("Error fetching module resources:", error);
      return [];
    }
  };
  
  const getResourcesByLesson = async (lessonId: string) => {
    try {
      const resources = await resourceService.getResourcesByLesson(lessonId);
      return resources;
    } catch (error) {
      console.error("Error fetching lesson resources:", error);
      return [];
    }
  };
  
  const createResource = async (resourceData: Partial<Resource>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a resource",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    // Only teachers and admins can create resources
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to create resources",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    setIsLoading(true);
    
    try {
      const newResource = await resourceService.createResource(resourceData);
      
      toast({
        title: "Success",
        description: "Resource created successfully"
      });
      
      return newResource;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create resource",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateResource = async (resourceId: string, resourceData: Partial<Resource>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a resource",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    // Only teachers and admins can update resources
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to update resources",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    setIsLoading(true);
    
    try {
      const updatedResource = await resourceService.updateResource(resourceId, resourceData);
      
      toast({
        title: "Success",
        description: "Resource updated successfully"
      });
      
      return updatedResource;
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
  
  const deleteResource = async (resourceId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a resource",
        variant: "destructive"
      });
      return false;
    }
    
    // Only teachers and admins can delete resources
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to delete resources",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      await resourceService.deleteResource(resourceId);
      
      toast({
        title: "Success",
        description: "Resource deleted successfully"
      });
      
      return true;
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
    getResourcesByModule,
    getResourcesByLesson,
    createResource,
    updateResource,
    deleteResource,
    isLoading
  };
};
