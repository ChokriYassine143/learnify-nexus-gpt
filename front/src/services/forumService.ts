import { ForumTopic, ForumReply } from '@/types';
import { api } from '@/lib/api';

class ForumService {
  async getTopics(): Promise<ForumTopic[]> {
    try {
      const response = await api.get("/forums/topics");
      return response.data.map((topic: any) => ({
        ...topic,
        id: topic._id,
        authorName: topic.author?.name ||
          (topic.author?.firstName ? topic.author.firstName + ' ' + (topic.author.lastName || '') : 'Unknown User'),
        authorAvatar: topic.author?.avatar,
      }));
    } catch (error) {
      console.error("Error fetching forum topics:", error);
      throw error;
    }
  }

  async getTopic(id: string): Promise<ForumTopic> {
    try {
      const response = await api.get(`/forums/topics/${id}`);
      const topic = response.data;
      return {
        ...topic,
        id: topic._id,
      };
    } catch (error) {
      console.error("Error fetching forum topic:", error);
      throw error;
    }
  }

  async createTopic(topicData: Partial<ForumTopic>): Promise<ForumTopic> {
    try {
      const response = await api.post("/forums/topics", topicData);
      const topic = response.data;
      return {
        ...topic,
        id: topic._id,
      };
    } catch (error: any) {
      console.error("Error creating forum topic:", error);
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.map((err: any) => err.msg).join(', '));
      }
      throw error;
    }
  }

  async updateTopic(id: string, topicData: Partial<ForumTopic>): Promise<ForumTopic> {
    try {
      const response = await api.patch(`/forums/topics/${id}`, topicData);
      return response.data;
    } catch (error) {
      console.error("Error updating forum topic:", error);
      throw error;
    }
  }

  async deleteTopic(id: string): Promise<void> {
    try {
      await api.delete(`/forums/topics/${id}`);
    } catch (error) {
      console.error("Error deleting forum topic:", error);
      throw error;
    }
  }

  async addReply(topicId: string, reply: Omit<ForumReply, "id" | "createdAt">): Promise<ForumReply> {
    try {
      const response = await api.post(`/forums/topics/${topicId}/replies`, reply);
      const newReply = response.data;
      return {
        ...newReply,
        id: newReply._id || newReply.id,
      };
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  }

  async updateReply(topicId: string, replyId: string, reply: Partial<ForumReply>): Promise<ForumReply> {
    try {
      const response = await api.patch(`/forums/topics/${topicId}/replies/${replyId}`, reply);
      return response.data;
    } catch (error) {
      console.error("Error updating reply:", error);
      throw error;
    }
  }

  async deleteReply(topicId: string, replyId: string): Promise<void> {
    try {
      await api.delete(`/forums/topics/${topicId}/replies/${replyId}`);
    } catch (error) {
      console.error("Error deleting reply:", error);
      throw error;
    }
  }

  async incrementViews(topicId: string): Promise<void> {
    try {
      await api.post(`/forums/topics/${topicId}/views`);
    } catch (error) {
      console.error("Error incrementing views:", error);
      throw error;
    }
  }

  async likeReply(topicId: string, replyId: string, userId: string): Promise<ForumReply> {
    try {
      const response = await api.patch(`/forums/topics/${topicId}/replies/${replyId}/like`, { userId });
      const updatedReply = response.data;
      return {
        ...updatedReply,
        id: updatedReply._id || updatedReply.id,
      };
    } catch (error) {
      console.error("Error liking/unliking reply:", error);
      throw error;
    }
  }

  async likeTopic(topicId: string, userId: string): Promise<string[]> {
    try {
      const response = await api.patch(`/forums/topics/${topicId}/like`, { userId });
      return response.data.likes;
    } catch (error) {
      console.error("Error liking/unliking topic:", error);
      throw error;
    }
  }
}

export const forumService = new ForumService(); 