
import { useState } from "react";
import { localStorageService, Assignment, AssignmentSubmission } from "@/services/localStorageService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useAssignments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getAllAssignments = () => {
    try {
      return localStorageService.getAssignments();
    } catch (error) {
      console.error("Error fetching assignments:", error);
      return [];
    }
  };
  
  const getAssignmentById = (assignmentId: string) => {
    return localStorageService.getAssignmentById(assignmentId);
  };
  
  const getAssignmentsByCourse = (courseId: string) => {
    return localStorageService.getAssignmentsByCourse(courseId);
  };
  
  const createAssignment = async (assignmentData: {
    title: string;
    description: string;
    courseId: string;
    dueDate: string;
  }) => {
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
      const newAssignment: Assignment = {
        id: `assignment-${Math.random().toString(36).substr(2, 9)}`,
        ...assignmentData,
        createdAt: new Date().toISOString(),
        submissions: []
      };
      
      const createdAssignment = localStorageService.addAssignment(newAssignment);
      
      toast({
        title: "Success",
        description: "Assignment created successfully"
      });
      
      return createdAssignment;
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
    
    const existingAssignment = localStorageService.getAssignmentById(assignmentId);
    
    if (!existingAssignment) {
      toast({
        title: "Error",
        description: "Assignment not found",
        variant: "destructive"
      });
      throw new Error("Assignment not found");
    }
    
    setIsLoading(true);
    
    try {
      const updatedAssignment: Assignment = {
        ...existingAssignment,
        ...assignmentData
      };
      
      const result = localStorageService.updateAssignment(updatedAssignment);
      
      toast({
        title: "Success",
        description: "Assignment updated successfully"
      });
      
      return result;
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
  
  const deleteAssignment = (assignmentId: string) => {
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
      const success = localStorageService.deleteAssignment(assignmentId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Assignment deleted successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete assignment",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const submitAssignment = async (assignmentId: string, content: string) => {
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
    
    const assignment = localStorageService.getAssignmentById(assignmentId);
    
    if (!assignment) {
      toast({
        title: "Error",
        description: "Assignment not found",
        variant: "destructive"
      });
      throw new Error("Assignment not found");
    }
    
    // Check if student already submitted
    const existingSubmission = assignment.submissions.find(
      submission => submission.studentId === user.id
    );
    
    if (existingSubmission) {
      toast({
        title: "Error",
        description: "You have already submitted this assignment",
        variant: "destructive"
      });
      throw new Error("Already submitted");
    }
    
    setIsLoading(true);
    
    try {
      const submission: AssignmentSubmission = {
        id: `submission-${Math.random().toString(36).substr(2, 9)}`,
        assignmentId,
        studentId: user.id,
        studentName: user.name,
        content,
        submittedAt: new Date().toISOString()
      };
      
      const result = localStorageService.addSubmission(assignmentId, submission);
      
      toast({
        title: "Success",
        description: "Assignment submitted successfully"
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
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
    
    const assignment = localStorageService.getAssignmentById(assignmentId);
    
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
      
      const result = localStorageService.updateSubmission(assignmentId, updatedSubmission);
      
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
