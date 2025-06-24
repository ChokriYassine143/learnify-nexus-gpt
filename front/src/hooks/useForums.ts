import { useState } from "react";
import { ForumTopic } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { forumService } from "@/services/forumService";

export const useForums = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getForumTopics = async () => {
    try {
      const topics = await forumService.getTopics();
      return topics;
    } catch (error) {
      console.error("Error fetching forum topics:", error);
      return [];
    }
  };
  
  const getForumTopicById = async (topicId: string) => {
    if (!topicId) {
      console.error("Error: Topic ID is undefined");
      return undefined;
    }
    
    try {
      const topic = await forumService.getTopic(topicId);
      return topic;
    } catch (error) {
      console.error("Error fetching forum topic:", error);
      return undefined;
    }
  };
  
  const getForumTopicsByCourse = async (courseId: string) => {
    try {
      const topics = await forumService.getTopics();
      return topics.filter(topic => topic.courseId === courseId);
    } catch (error) {
      console.error("Error fetching forum topics by course:", error);
      return [];
    }
  };
  
  const createForumTopic = async (topicData: Partial<ForumTopic>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a forum topic",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    setIsLoading(true);
    
    try {
      const newTopic = await forumService.createTopic(topicData);
      
      toast({
        title: "Success",
        description: "Forum topic created successfully"
      });
      
      return newTopic;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create forum topic",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateForumTopic = async (topicId: string, topicData: Partial<ForumTopic>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a forum topic",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    setIsLoading(true);
    
    try {
      const updatedTopic = await forumService.updateTopic(topicId, topicData);
      
      toast({
        title: "Success",
        description: "Forum topic updated successfully"
      });
      
      return updatedTopic;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update forum topic",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteForumTopic = async (topicId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a forum topic",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      await forumService.deleteTopic(topicId);
      
      toast({
        title: "Success",
        description: "Forum topic deleted successfully"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete forum topic",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const addReplyToTopic = async (topicId: string, content: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a reply",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    // Try to get the correct user ID
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const authorId = user._id || user.id || storedUser._id || storedUser.id;
    console.log('Reply authorId:', authorId);
    
    try {
      const reply = await forumService.addReply(topicId, {
        content,
        author: authorId,
      });
      
      toast({
        title: "Success",
        description: "Reply added successfully"
      });
      
      return reply;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    getForumTopics,
    getForumTopicById,
    getForumTopicsByCourse,
    createForumTopic,
    updateForumTopic,
    deleteForumTopic,
    addReplyToTopic,
    isLoading
  };
};
