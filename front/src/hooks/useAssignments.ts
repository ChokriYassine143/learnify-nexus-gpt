import { useState } from "react";
import { Assignment, AssignmentSubmission } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { assignmentService } from "@/services/assignmentService";

export const useAssignments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getAllAssignments = async () => {
    try {
      const assignments = await assignmentService.getAssignments();
      return assignments;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      return [];
    }
  };
  
  const getAssignmentById = async (assignmentId: string) => {
    try {
      const assignment = await assignmentService.getAssignment(assignmentId);
      return assignment;
    } catch (error) {
      console.error("Error fetching assignment:", error);
      return undefined;
    }
  };
  
  const getAssignmentsByCourse = (courseId: string) => {
    return assignmentService.getAssignmentsByCourse(courseId);
  };
  
  const createAssignment = async (assignmentData: Partial<Assignment>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an assignment",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    // Only teachers and admins can create assignments
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to create assignments",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    setIsLoading(true);
    
    try {
      const newAssignment = await assignmentService.createAssignment(assignmentData);
      
      toast({
        title: "Success",
        description: "Assignment created successfully"
      });
      
      return newAssignment;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateAssignment = async (assignmentId: string, assignmentData: Partial<Assignment>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update an assignment",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    // Only teachers and admins can update assignments
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to update assignments",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    setIsLoading(true);
    
    try {
      const updatedAssignment = await assignmentService.updateAssignment(assignmentId, assignmentData);
      
      toast({
        title: "Success",
        description: "Assignment updated successfully"
      });
      
      return updatedAssignment;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assignment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAssignment = async (assignmentId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete an assignment",
        variant: "destructive"
      });
      return false;
    }
    
    // Only teachers and admins can delete assignments
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to delete assignments",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      await assignmentService.deleteAssignment(assignmentId);
      
      toast({
        title: "Success",
        description: "Assignment deleted successfully"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const submitAssignment = async (
    assignmentId: string,
    content: string,
    attachments?: string[]
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an assignment",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    // Only students can submit assignments
    if (user.role !== "student") {
      toast({
        title: "Error",
        description: "Only students can submit assignments",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    try {
      const submission = await assignmentService.submitAssignment(assignmentId, {
        studentId: user.id,
        content,
        attachments
      });
      
      toast({
        title: "Success",
        description: "Assignment submitted successfully"
      });
      
      return submission;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const gradeSubmission = async (
    assignmentId: string,
    submissionId: string,
    grade: number,
    feedback: string
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to grade a submission",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    // Only teachers and admins can grade submissions
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to grade submissions",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    const assignment = await getAssignmentById(assignmentId);
    
    if (!assignment) {
      toast({
        title: "Error",
        description: "Assignment not found",
        variant: "destructive"
      });
      throw new Error("Assignment not found");
    }
    
    const submissionIndex = assignment.submissions.findIndex(
      submission => submission.id === submissionId
    );
    
    if (submissionIndex === -1) {
      toast({
        title: "Error",
        description: "Submission not found",
        variant: "destructive"
      });
      throw new Error("Submission not found");
    }
    
    setIsLoading(true);
    
    try {
      const updatedSubmission: AssignmentSubmission = {
        ...assignment.submissions[submissionIndex],
        grade,
        feedback
      };
      
      const result = assignmentService.updateSubmission(assignmentId, updatedSubmission);
      
      toast({
        title: "Success",
        description: "Submission graded successfully"
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to grade submission",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    getAllAssignments,
    getAssignmentById,
    getAssignmentsByCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    gradeSubmission,
    isLoading
  };
};
