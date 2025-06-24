import { User } from "@/types";
import { api } from "@/lib/api";

class UserService {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const response = await api.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  }

  async getUsersByCourse(courseId: string): Promise<User[]> {
    try {
      const response = await api.get(`/users/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for course ${courseId}:`, error);
      throw error;
    }
  }

  async getPublicUserById(userId: string): Promise<Pick<User, "firstName" | "lastName" | "name" | "avatar" | "bio">> {
    try {
      const response = await api.get(`/users/${userId}/public`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching public user ${userId}:`, error);
      throw error;
    }
  }
}

export const userService = new UserService(); 