import { useState } from "react";
import { Course } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/services/courseService";

export const useCourses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getAllCourses = async () => {
    try {
      const courses = await courseService.getAllCourses();
      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };
  
  const getCourseById = async (courseId: string) => {
    try {
      const course = await courseService.getCourse(courseId);
      return course;
    } catch (error) {
      console.error("Error fetching course:", error);
      return undefined;
    }
  };
  
  const getCoursesByInstructor = (instructorId: string) => {
    return courseService.getCoursesByInstructor(instructorId);
  };
  
  const createCourse = async (courseData: Partial<Course>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a course",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    // Only teachers and admins can create courses
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to create courses",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    setIsLoading(true);
    
    try {
      const newCourse = await courseService.createCourse(courseData);
      
      toast({
        title: "Success",
        description: "Course created successfully"
      });
      
      return newCourse;
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
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a course",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }
    
    // Only teachers and admins can update courses
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to update courses",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }
    
    setIsLoading(true);
    
    try {
      const updatedCourse = await courseService.updateCourse(courseId, courseData);
      
      toast({
        title: "Success",
        description: "Course updated successfully"
      });
      
      return updatedCourse;
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
  
  const deleteCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a course",
        variant: "destructive"
      });
      return false;
    }
    
    // Only teachers and admins can delete courses
    if (user.role !== "teacher" && user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to delete courses",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      await courseService.deleteCourse(courseId);
      
      toast({
        title: "Success",
        description: "Course deleted successfully"
      });
      
      return true;
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
    const course = courseService.getCourseById(courseId);
    
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

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to enroll in a course",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }

    // Only students can enroll in courses
    if (user.role !== "student") {
      toast({
        title: "Error",
        description: "Only students can enroll in courses",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }

    try {
      await courseService.enrollInCourse(courseId, user.id);
      
      toast({
        title: "Success",
        description: "Successfully enrolled in course"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive"
      });
      throw error;
    }
  };

  const unenrollFromCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to unenroll from a course",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }

    // Only students can unenroll from courses
    if (user.role !== "student") {
      toast({
        title: "Error",
        description: "Only students can unenroll from courses",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }

    try {
      await courseService.unenrollFromCourse(courseId, user.id);
      
      toast({
        title: "Success",
        description: "Successfully unenrolled from course"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unenroll from course",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    getAllCourses,
    getCourseById,
    getCoursesByInstructor,
    createCourse,
    updateCourse,
    deleteCourse,
    addLessonToCourse,
    enrollInCourse,
    unenrollFromCourse,
    isLoading
  };
};
