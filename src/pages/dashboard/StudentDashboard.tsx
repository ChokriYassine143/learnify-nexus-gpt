
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const StudentDashboard: React.FC = () => {
  // Sample data for enrolled courses
  const enrolledCourses = [
    {
      id: "1",
      title: "Web Development Fundamentals",
      instructor: "Prof. John Smith",
      progress: 75,
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      nextLesson: "CSS Layouts and Responsive Design",
      dueAssignment: "Portfolio Project - Phase 1",
      dueDate: "May 15, 2023"
    },
    {
      id: "2",
      title: "Data Science and Machine Learning",
      instructor: "Dr. Sarah Johnson",
      progress: 42,
      image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      nextLesson: "Introduction to Neural Networks",
      dueAssignment: "Data Visualization Project",
      dueDate: "May 18, 2023"
    },
  ];

  // Sample data for forum activity
  const forumActivity = [
    {
      id: "1",
      title: "How to implement responsive design in React?",
      course: "Web Development Fundamentals",
      lastActivity: "2 hours ago",
      replies: 12,
      unread: true
    },
    {
      id: "2",
      title: "Best practices for Python data visualization?",
      course: "Data Science and Machine Learning",
      lastActivity: "Yesterday",
      replies: 8,
      unread: false
    },
    {
      id: "3",
      title: "Tips for optimizing website performance",
      course: "Web Development Fundamentals",
      lastActivity: "3 days ago",
      replies: 15,
      unread: false
    },
  ];

  // Sample data for recommended courses
  const recommendedCourses = [
    {
      id: "3",
      title: "Frontend Development with React",
      instructor: "Thomas Brown",
      students: 9632,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "4",
      title: "Mobile App Development with React Native",
      instructor: "Michael Chen",
      students: 7432,
      image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    }
  ];

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
            <div className="grid gap-8">
              {enrolledCourses.map((course) => (
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
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2">
                          <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Next Lesson</p>
                            <p className="text-sm text-gray-600">{course.nextLesson}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Due Soon</p>
                            <p className="text-sm text-gray-600">
                              {course.dueAssignment} - Due {course.dueDate}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button asChild>
                          <Link to={`/course/${course.id}`}>Continue Learning</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={`/course/${course.id}/forum`}>Course Forum</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="forums" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Forum Activity</CardTitle>
                <CardDescription>Your recent discussions and replies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forumActivity.map((topic) => (
                    <div key={topic.id} className="border rounded-md p-4 hover:border-primary-200 transition-colors">
                      <div className="flex justify-between mb-2">
                        <div>
                          <Link to={`/forum/${topic.id}`} className="font-medium hover:text-primary">
                            {topic.title}
                          </Link>
                          <div className="text-sm text-gray-600 mt-1">
                            Course: {topic.course}
                          </div>
                        </div>
                        {topic.unread && (
                          <Badge>New Replies</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          <span>{topic.replies} replies</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>Last activity {topic.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
              <div className="grid gap-6 md:grid-cols-2">
                {recommendedCourses.map((course) => (
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
                        <p className="text-sm text-gray-600">{course.students.toLocaleString()} students enrolled</p>
                      </CardContent>
                      <CardFooter className="border-t p-4">
                        <Button className="w-full" asChild>
                          <Link to={`/course/${course.id}`}>View Course</Link>
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
              
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
