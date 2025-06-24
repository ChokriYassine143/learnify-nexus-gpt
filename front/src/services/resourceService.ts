import { Resource } from '@/types';
import api from './api';

class ResourceService {
  async getAllResources(): Promise<Resource[]> {
    const { data } = await api.get<Resource[]>('/resources');
    return data;
  }

  async getResource(resourceId: string): Promise<Resource> {
    const { data } = await api.get<Resource>(`/resources/${resourceId}`);
    return data;
  }

  async createResource(resourceData: Partial<Resource>): Promise<Resource> {
    // Ensure all required fields are present
    const requiredFields = ['title', 'type', 'url', 'courseId'];
    const missingFields = requiredFields.filter(field => !resourceData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const { data } = await api.post<Resource>('/resources', resourceData);
    return data;
  }

  async updateResource(resourceId: string, resourceData: Partial<Resource>): Promise<Resource> {
    const { data } = await api.put<Resource>(`/resources/${resourceId}`, resourceData);
    return data;
  }

  async deleteResource(resourceId: string): Promise<void> {
    await api.delete(`/resources/${resourceId}`);
  }

  async getResourcesByCourse(courseId: string): Promise<Resource[]> {
    const { data } = await api.get<Resource[]>(`/courses/${courseId}/resources`);
    return data;
  }

  async getResourcesByModule(moduleId: string): Promise<Resource[]> {
    const { data } = await api.get<Resource[]>(`/modules/${moduleId}/resources`);
    return data;
  }

  async getResourcesByLesson(lessonId: string): Promise<Resource[]> {
    const { data } = await api.get<Resource[]>(`/resources/lesson/${lessonId}`);
    return data;
  }
}

export const resourceService = new ResourceService(); 