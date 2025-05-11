
import { useState } from "react";
import { localStorageService, Course, Lesson } from "@/services/localStorageService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useCourses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getAllCourses = (limit?: number) => {
    try {
      const courses = localStorageService.getCourses();
      
      if (limit) {
        return courses.slice(0, limit);
      }
      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };
  
  const getCourseById = (courseId: string) => {
    return localStorageService.getCourseById(courseId);
  };
  
  const getCoursesByInstructor = (instructorId: string) => {
    return localStorageService.getCoursesByInstructor(instructorId);
  };
  
  const createCourse = async (courseData: Omit<Course, "id" | "instructorId" | "instructor" | "createdAt" | "updatedAt">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a course",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    setIsLoading(true);
    
    try {
      const newCourse: Course = {
        id: `course-${Math.random().toString(36).substr(2, 9)}`,
        ...courseData,
        instructor: user.name,
        instructorId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const createdCourse = localStorageService.addCourse(newCourse);
      
      toast({
        title: "Success",
        description: "Course created successfully"
      });
      
      return createdCourse;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateCourse = async (courseId: string, courseData: Partial<Course>) => {
    const existingCourse = localStorageService.getCourseById(courseId);
    
    if (!existingCourse) {
      toast({
        title: "Error",
        description: "Course not found",
        variant: "destructive"
      });
      throw new Error("Course not found");
    }
    
    setIsLoading(true);
    
    try {
      const updatedCourse: Course = {
        ...existingCourse,
        ...courseData,
        updatedAt: new Date().toISOString()
      };
      
      const result = localStorageService.updateCourse(updatedCourse);
      
      toast({
        title: "Success",
        description: "Course updated successfully"
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteCourse = (courseId: string) => {
    try {
      const success = localStorageService.deleteCourse(courseId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Course deleted successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const addLessonToCourse = (courseId: string, lessonData: Omit<Lesson, "id" | "courseId">) => {
    const course = localStorageService.getCourseById(courseId);
    
    if (!course) {
      toast({
        title: "Error",
        description: "Course not found",
        variant: "destructive"
      });
      throw new Error("Course not found");
    }
    
    const newLesson: Lesson = {
      id: `lesson-${Math.random().toString(36).substr(2, 9)}`,
      courseId,
      ...lessonData
    };
    
    const updatedLessons = [...(course.lessons || []), newLesson];
    
    return updateCourse(courseId, { lessons: updatedLessons });
  };

  return {
    getAllCourses,
    getCourseById,
    getCoursesByInstructor,
    createCourse,
    updateCourse,
    deleteCourse,
    addLessonToCourse,
    isLoading
  };
};
