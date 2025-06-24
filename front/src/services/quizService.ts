import { Quiz } from '@/types';
import api from './api';

class QuizService {
  async getAllQuizzes(): Promise<Quiz[]> {
    const { data } = await api.get<Quiz[]>('/quizzes');
    return data;
  }

  async getQuiz(quizId: string): Promise<Quiz> {
    const { data } = await api.get<Quiz>(`/quizzes/${quizId}`);
    return data;
  }

  async createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
    const { data } = await api.post<Quiz>('/quizzes', quizData);
    return data;
  }

  async updateQuiz(quizId: string, quizData: Partial<Quiz>): Promise<Quiz> {
    const { data } = await api.put<Quiz>(`/quizzes/${quizId}`, quizData);
    return data;
  }

  async deleteQuiz(quizId: string): Promise<void> {
    await api.delete(`/quizzes/${quizId}`);
  }

  async getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    const { data } = await api.get<Quiz[]>(`/courses/${courseId}/quizzes`);
    return data;
  }

  async getQuizzesByModule(moduleId: string): Promise<Quiz[]> {
    const { data } = await api.get<Quiz[]>(`/modules/${moduleId}/quizzes`);
    return data;
  }

  async getQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
    const { data } = await api.get<Quiz[]>(`/quizzes/lesson/${lessonId}`);
    return data;
  }
}

export const quizService = new QuizService(); 