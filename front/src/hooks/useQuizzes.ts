import { useState } from "react";
import { Quiz } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { quizService } from "@/services/quizService";

export const useQuizzes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getAllQuizzes = async () => {
    try {
      const quizzes = await quizService.getAllQuizzes();
      return quizzes;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
  };

  const getQuizById = async (quizId: string) => {
    try {
      const quiz = await quizService.getQuiz(quizId);
      return quiz;
    } catch (error) {
      console.error("Error fetching quiz:", error);
      return undefined;
    }
  };

  const getQuizzesByCourse = async (courseId: string) => {
    try {
      const quizzes = await quizService.getQuizzesByCourse(courseId);
      return quizzes;
    } catch (error) {
      console.error("Error fetching course quizzes:", error);
      return [];
    }
  };

  const getQuizzesByModule = async (moduleId: string) => {
    try {
      const quizzes = await quizService.getQuizzesByModule(moduleId);
      return quizzes;
    } catch (error) {
      console.error("Error fetching module quizzes:", error);
      return [];
    }
  };

  const getQuizzesByLesson = async (lessonId: string) => {
    try {
      const quizzes = await quizService.getQuizzesByLesson(lessonId);
      return quizzes;
    } catch (error) {
      console.error("Error fetching lesson quizzes:", error);
      return [];
    }
  };

  const createQuiz = async (quizData: Partial<Quiz>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a quiz",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }

    // Only teachers and admins can create quizzes
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to create quizzes",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }

    setIsLoading(true);

    try {
      const newQuiz = await quizService.createQuiz(quizData);
      
      toast({
        title: "Success",
        description: "Quiz created successfully"
      });
      
      return newQuiz;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quiz",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuiz = async (quizId: string, quizData: Partial<Quiz>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a quiz",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }

    // Only teachers and admins can update quizzes
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to update quizzes",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }

    setIsLoading(true);

    try {
      const updatedQuiz = await quizService.updateQuiz(quizId, quizData);
      
      toast({
        title: "Success",
        description: "Quiz updated successfully"
      });
      
      return updatedQuiz;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quiz",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a quiz",
        variant: "destructive"
      });
      return false;
    }

    // Only teachers and admins can delete quizzes
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to delete quizzes",
        variant: "destructive"
      });
      return false;
    }

    try {
      await quizService.deleteQuiz(quizId);
      
      toast({
        title: "Success",
        description: "Quiz deleted successfully"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    getAllQuizzes,
    getQuizById,
    getQuizzesByCourse,
    getQuizzesByModule,
    getQuizzesByLesson,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    isLoading
  };
}; 