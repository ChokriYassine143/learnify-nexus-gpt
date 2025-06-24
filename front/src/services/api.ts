import axios from 'axios';
import { User, Course, ForumTopic, Assignment, Notification, CourseProgress } from '@/types';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    api.post<{ user: User; token: string }>('/auth/login', { email, password }),
  
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "student" | "teacher" | "admin";
  }) => api.post<{ user: User; token: string }>('/auth/register', userData),
  
  logout: () => api.post('/auth/logout'),
};

// User API
export const userApi = {
  getCurrentUser: () => api.get<User>('/auth/me'),
  
  getAllUsers: () => api.get<User[]>('/users'),
  
  getUserById: (userId: string) => api.get<User>(`/users/${userId}`),
  
  updateUser: (userId: string, userData: Partial<User>) => 
    api.put<User>(`/users/${userId}`, userData),
  
  deleteUser: (userId: string) => api.delete(`/users/${userId}`),
  
  updateProfile: (userId: string, userData: Partial<User>) => 
    api.put<User>(`/users/${userId}`, userData),
  
  updatePreferences: (userId: string, preferences: User["preferences"]) => 
    api.put<User>(`/users/${userId}/preferences`, preferences),
};

// Course API
export const courseApi = {
  getAllCourses: () => api.get<Course[]>('/courses'),
  
  getCourse: (courseId: string) => api.get<Course>(`/courses/${courseId}`),
  
  createCourse: (courseData: Partial<Course>) => 
    api.post<Course>('/courses', courseData),
  
  updateCourse: (courseId: string, courseData: Partial<Course>) => 
    api.put<Course>(`/courses/${courseId}`, courseData),
  
  deleteCourse: (courseId: string) => api.delete(`/courses/${courseId}`),
  
  enrollInCourse: (courseId: string, userId: string) => 
    api.post(`/courses/${courseId}/enroll`, { userId }),
  
  unenrollFromCourse: (courseId: string, userId: string) => 
    api.post(`/courses/${courseId}/unenroll`, { userId }),
  
  getCourseProgress: (courseId: string, userId: string) => 
    api.get<CourseProgress>(`/courses/${courseId}/progress/${userId}`),
  
  updateCourseProgress: (courseId: string, progress: Partial<CourseProgress>) => 
    api.put<CourseProgress>(`/courses/${courseId}/progress`, progress),
};

// Forum API
export const forumApi = {
  getTopics: () => api.get<ForumTopic[]>('/forums'),
  
  getTopic: (topicId: string) => api.get<ForumTopic>(`/forums/${topicId}`),
  
  createTopic: (topicData: Partial<ForumTopic>) => 
    api.post<ForumTopic>('/forums', topicData),
  
  updateTopic: (topicId: string, topicData: Partial<ForumTopic>) => 
    api.put<ForumTopic>(`/forums/${topicId}`, topicData),
  
  deleteTopic: (topicId: string) => api.delete(`/forums/${topicId}`),
  
  addReply: (topicId: string, replyData: { content: string; author: string }) => 
    api.post(`/forums/${topicId}/replies`, replyData),
};

// Assignment API
export const assignmentApi = {
  getAssignments: () => api.get<Assignment[]>('/assignments'),
  
  getAssignment: (assignmentId: string) => 
    api.get<Assignment>(`/assignments/${assignmentId}`),
  
  createAssignment: (assignmentData: Partial<Assignment>) => 
    api.post<Assignment>('/assignments', assignmentData),
  
  updateAssignment: (assignmentId: string, assignmentData: Partial<Assignment>) => 
    api.put<Assignment>(`/assignments/${assignmentId}`, assignmentData),
  
  deleteAssignment: (assignmentId: string) => 
    api.delete(`/assignments/${assignmentId}`),
  
  submitAssignment: (assignmentId: string, submissionData: {
    studentId: string;
    content: string;
    attachments?: string[];
  }) => api.post(`/assignments/${assignmentId}/submit`, submissionData),
};

// Notification API
export const notificationApi = {
  getNotifications: (userId: string) => 
    api.get<Notification[]>(`/notifications/${userId}`),
  
  markAsRead: (notificationId: string) => 
    api.put(`/notifications/${notificationId}/read`),
  
  deleteNotification: (notificationId: string) => 
    api.delete(`/notifications/${notificationId}`),
};

export default api; 