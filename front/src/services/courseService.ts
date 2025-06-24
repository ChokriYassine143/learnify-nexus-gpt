import { Course, CourseProgress } from '@/types';
import { api } from '@/lib/api';

class CourseService {
  async getAllCourses(): Promise<Course[]> {
    const { data } = await api.get<Course[]>('/courses');
    return data.map((course: any) => ({
      ...course,
      id: course.id || course._id,
      modules: (course.modules || []).map((module: any) => ({
        ...module,
        id: module.id || module._id,
        lessons: (module.lessons || []).map((lesson: any) => ({
          ...lesson,
          id: lesson.id || lesson._id
        }))
      }))
    }));
  }

  async getCourse(courseId: string): Promise<Course> {
    const { data } = await api.get<Course>(`/courses/${courseId}`);
    return {
      ...data,
      id: data.id || data._id
    };
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const { data } = await api.post<Course>('/courses', courseData);
    return data;
  }

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
    const { data } = await api.put<Course>(`/courses/${courseId}`, courseData);
    return data;
  }

  async deleteCourse(courseId: string): Promise<void> {
    await api.delete(`/courses/${courseId}`);
  }

  async enrollInCourse(courseId: string, userId: string): Promise<void> {
    await api.post(`/courses/${courseId}/enroll`, { userId });
  }

  async unenrollFromCourse(courseId: string, userId: string): Promise<void> {
    await api.post(`/courses/${courseId}/unenroll`, { userId });
  }

  async getCourseProgress(courseId: string, userId: string): Promise<CourseProgress> {
    const { data } = await api.get<CourseProgress>(`/courses/${courseId}/progress/${userId}`);
    return data;
  }

  async getCourseNotes(userId: string, courseId: string): Promise<{ notes: string } | null> {
    try {
      const { data } = await api.get<{ notes: string }>(`/courses/${courseId}/notes/${userId}`);
      return data;
    } catch (error) {
      // Return null if no notes exist
      return null;
    }
  }

  async updateCourseProgress(courseId: string, progress: Partial<CourseProgress>): Promise<CourseProgress> {
    // Ensure userId is included in the request body
    const progressData = {
      ...progress,
      userId: progress.userId // Make sure userId is included
    };
    const { data } = await api.put<CourseProgress>(`/courses/${courseId}/progress`, progressData);
    return data;
  }

  async createPayment(payment: {
    id: string;
    userId: string;
    courseId: string;
    amount: number;
    currency: string;
    status: "completed" | "pending" | "failed";
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
  }): Promise<void> {
    await api.post('/payments', payment);
  }

  async getUserEnrollments(userId: string): Promise<{ courseId: string }[]> {
    const { data } = await api.get<{ courseId: string }[]>(`/users/${userId}/enrollments`);
    return data;
  }

  async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollments = await this.getUserEnrollments(userId);
    return enrollments.some(enrollment => enrollment.courseId === courseId);
  }

  async getCourseDiscussions(courseId: string) {
    const { data } = await api.get(`/courses/${courseId}/discussions`);
    return data;
  }

  async addCourseDiscussion(courseId: string, discussion: any) {
    const { data } = await api.post(`/courses/${courseId}/discussions`, discussion);
    return data;
  }

  async addDiscussionReply(courseId: string, discussionId: string, reply: any) {
    const { data } = await api.post(`/courses/${courseId}/discussions/${discussionId}/replies`, reply);
    return data;
  }
}

export const courseService = new CourseService(); 