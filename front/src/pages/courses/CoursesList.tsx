import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/types";
import { courseService } from "@/services/courseService";
import { paymentService } from "@/services/paymentService";

const CoursesList: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { getAllCourses } = useCourses();
  const { user, enrollInCourse } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>(category || "all");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCourses, setVisibleCourses] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  const allowedLevels = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const allCourses = await courseService.getAllCourses();
        setCourses(allCourses);
        setFilteredCourses(allCourses);

        // Load enrolled courses if user is logged in
        if (user && user.id) {
          try {
            const userEnrollments = await courseService.getUserEnrollments(user.id);
            setEnrolledCourses(userEnrollments.map(e => e.courseId));
          } catch (err) {
            console.error("Error loading user enrollments:", err);
            setEnrolledCourses([]);
          }
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [user, toast]);

  useEffect(() => {
    // Filter courses based on search, level, and category
    let filtered = courses;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        course =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(course => {
        if (typeof course.level !== 'string') return false;
        return allowedLevels.includes(course.level.toLowerCase() as string) && 
               course.level.toLowerCase() === selectedLevel.toLowerCase();
      });
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => course.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedLevel, selectedCategory]);

  const handlePurchase = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase courses",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        throw new Error("Course not found");
      }

      // Create payment record
      const payment = {
        id: `payment-${Date.now()}`,
        userId: user.id,
        courseId: course.id,
        amount: course.price,
        currency: "USD",
        status: "completed" as const,
        paymentMethod: "credit_card",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create payment and enroll in course
      await paymentService.createPayment(payment);
      await enrollInCourse(courseId);
      
      toast({
        title: "Success",
        description: "Course purchased successfully!",
      });
    } catch (error) {
      console.error("Error purchasing course:", error);
      toast({
        title: "Error",
        description: "Failed to purchase course. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCourses(prev => Math.min(prev + 6, filteredCourses.length));
      setIsLoading(false);
    }, 800);
  };
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container py-8">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">Explore Our Courses</h1>
            <p className="mx-auto max-w-2xl text-gray-600">
              Discover a wide range of courses taught by industry experts. Start your learning journey today!
          </p>
        </div>
        
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Filter Options */}
            <div className={`mt-4 space-y-4 ${showFilters ? "block" : "hidden md:block"}`}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Level</Label>
                  <Select value={selectedLevel} onValueChange={(val) => setSelectedLevel(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="development">Développement</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="photography">Photographie</SelectItem>
                      <SelectItem value="music">Musique</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </div>
              </div>
            </div>
            
          {/* Course Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                instructor={course.instructor}
                level={course.level}
                rating={course.rating}
                duration={typeof course.duration === 'number' ? course.duration : parseInt(course.duration) || 0}
                enrolledStudents={typeof course.enrolledStudents === 'number' ? course.enrolledStudents : 0}
                image={course.image}
                category={course.category}
                price={course.price}
                isEnrolled={user?.enrolledCourses?.includes(course.id)}
                onPurchase={() => handlePurchase(course.id)}
              />
                  ))}
                </div>
                
          {/* No Results */}
          {filteredCourses.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">No courses found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLevel("all");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {visibleCourses < filteredCourses.length && (
                  <div className="mt-10 flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <span className="animate-pulse">Loading courses...</span>
                      ) : (
                        <>
                          <span>Load More Courses</span>
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                </Button>
              </div>
            )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CoursesList;
