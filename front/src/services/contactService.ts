import { ContactMessage } from "@/types";
import { api } from "@/lib/api";

class ContactService {
  async sendContactMessage(message: ContactMessage): Promise<ContactMessage> {
    try {
      const response = await api.post("/contact", message);
      return response.data;
    } catch (error) {
      console.error("Error sending contact message:", error);
      throw error;
    }
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const response = await api.get("/contact");
      return response.data;
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      throw error;
    }
  }

  async getContactMessageById(id: string): Promise<ContactMessage> {
    try {
      const response = await api.get(`/contact/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching contact message:", error);
      throw error;
    }
  }

  async updateContactMessageStatus(id: string, status: "pending" | "in_progress" | "resolved"): Promise<ContactMessage> {
    try {
      const response = await api.patch(`/contact/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating contact message status:", error);
      throw error;
    }
  }

  async deleteContactMessage(id: string): Promise<void> {
    try {
      await api.delete(`/contact/${id}`);
    } catch (error) {
      console.error("Error deleting contact message:", error);
      throw error;
    }
  }
}

export const contactService = new ContactService(); 