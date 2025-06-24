import { Message } from '@/types';
import api from './api';

class ChatService {
  async getConversation(userId: string): Promise<Message[]> {
    if (!userId) {
      console.error('No user ID provided for getConversation');
      return [];
    }

    try {
      const { data } = await api.get<Message[]>(`/users/${userId}/conversations`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }
  }

  async addMessage(userId: string, message: Message): Promise<Message> {
    if (!userId) {
      console.error('No user ID provided for addMessage');
      throw new Error('User ID is required');
    }

    try {
      const { data } = await api.post<Message>(`/users/${userId}/conversations`, message);
      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      // For now, return the message even if saving fails
      // This allows the chat to work even if the backend is not ready
      return message;
    }
  }

  async clearConversation(userId: string): Promise<void> {
    if (!userId) {
      console.error('No user ID provided for clearConversation');
      throw new Error('User ID is required');
    }

    try {
      await api.delete(`/users/${userId}/conversations`);
    } catch (error) {
      console.error('Error clearing conversation:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService(); 