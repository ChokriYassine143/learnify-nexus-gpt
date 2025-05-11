
import { useState } from "react";
import { localStorageService, ForumTopic, ForumReply } from "@/services/localStorageService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useForums = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getForumTopics = (limit?: number) => {
    try {
      const topics = localStorageService.getForumTopics();
      // Sort by most recent
      const sortedTopics = [...topics].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      if (limit) {
        return sortedTopics.slice(0, limit);
      }
      return sortedTopics;
    } catch (error) {
      console.error("Error fetching forum topics:", error);
      return [];
    }
  };
  
  const getForumTopicById = (topicId: string) => {
    return localStorageService.getForumTopicById(topicId);
  };
  
  const getForumTopicsByCourse = (courseId: string) => {
    return localStorageService.getForumTopicsByCourse(courseId);
  };
  
  const createForumTopic = async (topicData: {
    title: string;
    content: string;
    courseId?: string;
    tags: string[];
  }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a topic",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    setIsLoading(true);
    
    try {
      const newTopic: ForumTopic = {
        id: `topic-${Math.random().toString(36).substr(2, 9)}`,
        title: topicData.title,
        content: topicData.content,
        author: user.name,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        courseId: topicData.courseId,
        replies: [],
        tags: topicData.tags,
        views: 0
      };
      
      const createdTopic = localStorageService.addForumTopic(newTopic);
      
      toast({
        title: "Success",
        description: "Topic created successfully"
      });
      
      return createdTopic;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create topic",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addReplyToTopic = async (topicId: string, content: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to reply",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    setIsLoading(true);
    
    try {
      const reply: ForumReply = {
        id: `reply-${Math.random().toString(36).substr(2, 9)}`,
        content,
        author: user.name,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        topicId
      };
      
      const createdReply = localStorageService.addForumReply(topicId, reply);
      
      toast({
        title: "Success",
        description: "Reply added successfully"
      });
      
      return createdReply;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteTopic = (topicId: string) => {
    try {
      const success = localStorageService.deleteForumTopic(topicId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Topic deleted successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete topic",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    getForumTopics,
    getForumTopicById,
    getForumTopicsByCourse,
    createForumTopic,
    addReplyToTopic,
    deleteTopic,
    isLoading
  };
};
