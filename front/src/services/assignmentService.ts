import { Assignment, AssignmentSubmission } from '@/types';
import { assignmentApi } from './api';

class AssignmentService {
  async getAssignments(): Promise<Assignment[]> {
    const { data } = await assignmentApi.getAssignments();
    return data;
  }

  async getAssignment(assignmentId: string): Promise<Assignment> {
    const { data } = await assignmentApi.getAssignment(assignmentId);
    return data;
  }

  async createAssignment(assignmentData: Partial<Assignment>): Promise<Assignment> {
    const { data } = await assignmentApi.createAssignment(assignmentData);
    return data;
  }

  async updateAssignment(assignmentId: string, assignmentData: Partial<Assignment>): Promise<Assignment> {
    const { data } = await assignmentApi.updateAssignment(assignmentId, assignmentData);
    return data;
  }

  async deleteAssignment(assignmentId: string): Promise<void> {
    await assignmentApi.deleteAssignment(assignmentId);
  }

  async submitAssignment(
    assignmentId: string,
    submissionData: {
      studentId: string;
      content: string;
      attachments?: string[];
    }
  ): Promise<AssignmentSubmission> {
    const { data } = await assignmentApi.submitAssignment(assignmentId, submissionData);
    return data;
  }
}

export const assignmentService = new AssignmentService(); 