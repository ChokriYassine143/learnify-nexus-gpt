import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Clock, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/services/courseService";
import { forumService } from "@/services/forumService";
import { Course, ForumTopic, CourseProgress } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const StudentDashboard: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const { user, refreshUser } = useAuth();
  const [forumActivity, setForumActivity] = useState<ForumTopic[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<{ [key: string]: CourseProgress }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get enrolled courses and filter out undefined values
      const enrolledCourseIds = (user.enrolledCourses || []).filter(Boolean);
      
      // Fetch all required data in parallel
      const [allCourses, allTopics] = await Promise.all([
        courseService.getAllCourses(),
        forumService.getTopics()
      ]);
      
      // Filter enrolled courses
      const validCourses = allCourses.filter(course => {
        const courseId = course.id || course._id;
        return enrolledCourseIds.includes(courseId);
      });
      setEnrolledCourses(validCourses);

      // Get course progress for valid courses
      const progressPromises = validCourses.map(async (course) => {
        try {
          const courseId = course.id || course._id;
          const progress = await courseService.getCourseProgress(courseId, user.id);
          return progress;
        } catch (error) {
          return null;
        }
      });
      
      const progressResults = await Promise.all(progressPromises);
      const progressMap = progressResults.reduce((acc, curr) => {
        if (curr) {
          acc[curr.courseId] = curr;
        }
        return acc;
      }, {} as { [key: string]: CourseProgress });
      setCourseProgress(progressMap);

      // Filter forum topics
      const validCourseIds = validCourses.map(c => c.id || c._id);
      const filteredTopics = allTopics.filter(topic => 
        !topic.courseId || validCourseIds.includes(topic.courseId)
      );
      setForumActivity(filteredTopics);

      // Get recommended courses
      const recommended = allCourses.filter(course => {
        const courseId = course.id || course._id;
        return !validCourseIds.includes(courseId);
      });
      setRecommendedCourses(recommended);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Effect to handle user refresh
  useEffect(() => {
    const refreshUserData = async () => {
      if (user && !user.enrolledCourses) {
        setIsRefreshing(true);
        await refreshUser();
        setIsRefreshing(false);
      }
    };
    refreshUserData();
  }, [user, refreshUser]);

  // Effect to handle dashboard data fetching
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (mounted && user) {
        await fetchDashboardData();
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [user, fetchDashboardData, location.pathname]);

  // Add a refresh function that can be called manually
  const handleRefresh = useCallback(async () => {
    if (user) {
      await fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Loading skeleton component
  const CourseSkeleton = () => (
    <Card className="mb-4">
      <div className="md:flex">
        <div className="md:w-1/3">
          <Skeleton className="h-48 w-full md:h-full" />
        </div>
        <div className="p-6 md:w-2/3">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your progress and manage your enrolled courses</p>
        </div>

        <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="enrolled">My Courses</TabsTrigger>
            <TabsTrigger value="forums">Forum Activity</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="mt-6">
            {isLoading ? (
              // Show loading skeletons
              <div className="space-y-4">
                <CourseSkeleton />
                <CourseSkeleton />
                <CourseSkeleton />
              </div>
            ) : (
              <div className="grid gap-8">
                {enrolledCourses.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
                      <Button asChild className="mt-4">
                        <Link to="/courses">Browse Courses</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  enrolledCourses.map((course) => (
                    <Card key={course.id}>
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="h-48 w-full object-cover md:h-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" 
                          />
                        </div>
                        <div className="p-6 md:w-2/3">
                          <CardTitle className="mb-1">{course.title}</CardTitle>
                          <p className="text-sm text-gray-600 mb-4">Instructor: {course.instructor}</p>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{(() => {
                                const totalLessons = (course.modules || []).reduce((acc, m) => acc + ((m.lessons && Array.isArray(m.lessons)) ? m.lessons.length : 0), 0);
                                const completedLessons = courseProgress[course.id]?.completedLessons?.length || 0;
                                return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                              })()}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${(() => {
                                  const totalLessons = (course.modules || []).reduce((acc, m) => acc + ((m.lessons && Array.isArray(m.lessons)) ? m.lessons.length : 0), 0);
                                  const completedLessons = courseProgress[course.id]?.completedLessons?.length || 0;
                                  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                                })()}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-2">
                              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium">Next Lesson</p>
                                <p className="text-sm text-gray-600">
                                  {(course.modules && course.modules[0] && course.modules[0].lessons && course.modules[0].lessons[0]?.title) || 'No upcoming lessons'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                              <div>
                                <p className="font-medium">Due Soon</p>
                                <p className="text-sm text-gray-600">
                                  {(course.modules && course.modules[0] && course.modules[0].lessons && course.modules[0].lessons[0]?.type === 'assignment') ? 
                                    course.modules[0].lessons[0].title : 
                                    'No upcoming assignments'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-4">
                            <Button asChild>
                              <Link to={`/course/${course.id}/learn`}>Continue Learning</Link>
                            </Button>
                            <Button variant="outline" asChild>
                              <Link to={`/course/${course.id}/forum`}>Course Forum</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="forums" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Forum Activity</CardTitle>
                <CardDescription>Your recent discussions and replies</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forumActivity.length === 0 ? (
                      <p className="text-center text-gray-600">No forum activity to display.</p>
                    ) : (
                      forumActivity.map((topic) => (
                        <div key={topic.id} className="border rounded-md p-4 hover:border-primary-200 transition-colors">
                          <div className="flex justify-between mb-2">
                            <div>
                              <Link to={`/forum/${topic.id}`} className="font-medium hover:text-primary">
                                {topic.title}
                              </Link>
                              <div className="text-sm text-gray-600 mt-1">
                                Course: {topic.courseId ? (enrolledCourses.find(c => c.id === topic.courseId)?.title || 'Unknown Course') : 'General Discussion'}
                              </div>
                            </div>
                            {topic.replies.length > 0 && (
                              <Badge>New Replies</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              <span>{topic.replies.length} replies</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Last activity {new Date(topic.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4 flex justify-between">
                <Button variant="outline" asChild>
                  <Link to="/forum">Browse All Forums</Link>
                </Button>
                <Button asChild>
                  <Link to="/forum/new">Start New Discussion</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recommended Courses</h2>
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {recommendedCourses.length === 0 ? (
                    <p className="text-center text-gray-600 col-span-2">No recommended courses available.</p>
                  ) : (
                    recommendedCourses.map((course) => (
                      <Card key={course.id}>
                        <div className="flex flex-col h-full">
                          <div>
                            <img
                              src={course.image}
                              alt={course.title}
                              className="h-40 w-full object-cover rounded-t-lg"
                            />
                          </div>
                          <CardContent className="flex-grow p-4">
                            <h3 className="font-semibold mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</p>
                            <p className="text-sm text-gray-600">{course.enrolledStudents} students enrolled</p>
                          </CardContent>
                          <CardFooter className="border-t p-4">
                            <Button className="w-full" asChild>
                              <Link to={`/course/${course.id}`}>View Course</Link>
                            </Button>
                          </CardFooter>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link to="/courses">Browse All Courses</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default StudentDashboard;
