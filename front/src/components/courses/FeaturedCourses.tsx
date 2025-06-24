import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CourseCard from "./CourseCard";
import { courseService } from "@/services/courseService";
import { Course } from "@/types";
import { useToast } from "@/hooks/use-toast";

const FeaturedCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.getAllCourses();
        
        // Ensure response is an array and has valid course data
        if (Array.isArray(response) && response.length > 0) {
          // Sort courses by rating and get top 3
          const sortedCourses = [...response].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          setCourses(sortedCourses.slice(0, 3));
        } else {
          console.warn("No courses available");
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching featured courses:", error);
        setCourses([]);
        toast({
          title: "Error",
          description: "Failed to load featured courses. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  if (isLoading) {
    return (
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured Courses</h2>
            <p className="mt-2 text-gray-600">
              Explore our most popular and highly-rated courses
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/courses">View All Courses</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!courses.length) {
    return (
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured Courses</h2>
            <p className="mt-2 text-gray-600">
              No featured courses available at the moment
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/courses">View All Courses</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Featured Courses</h2>
          <p className="mt-2 text-gray-600">
            Explore our most popular and highly-rated courses
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/courses">View All Courses</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses
          .filter(course => !!course.id)
          .map((course, idx) => (
            <CourseCard
              key={course.id || idx}
              id={course.id}
              title={course.title}
              instructor={course.instructor || "Unknown Instructor"}
              level={(course.level as "beginner" | "intermediate" | "advanced") || "beginner"}
              rating={course.rating || 0}
              duration={typeof course.duration === 'number' ? course.duration : parseInt(course.duration) || 0}
              enrolledStudents={course.enrolledStudents || 0}
              image={course.image || "/placeholder-course.jpg"}
              category={course.category || "Uncategorized"}
              price={course.price || 0}
            />
          ))}
      </div>
    </section>
  );
};

export default FeaturedCourses;
