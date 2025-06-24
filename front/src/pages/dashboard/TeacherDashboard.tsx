import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Users, FileText, Search, UserIcon, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/services/courseService";
import { forumService } from "@/services/forumService";
import { assignmentService } from "@/services/assignmentService";
import { userService } from "@/services/userService";
import { Course, CourseProgress, Assignment, ForumTopic, User } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [courseProgress, setCourseProgress] = useState<{ [courseId: string]: CourseProgress[] }>({});
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch teacher's courses and related data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        // Get teacher's courses
        const allCoursesRaw = await courseService.getAllCourses();
        const allCourses = allCoursesRaw.map(course => ({ ...course, id: course.id }));
        const teacherCourses = allCourses.filter(course => course.instructor === user.id);
        setCourses(teacherCourses);

        // Get all students enrolled in teacher's courses
        let allStudents: User[] = [];
        for (const course of teacherCourses) {
          const studentsForCourse = await userService.getUsersByCourse(course.id);
          allStudents = allStudents.concat(studentsForCourse);
        }
        // Remove duplicates by user id
        const uniqueStudents = Array.from(new Map(allStudents.map(s => [s.id, s])).values());
        setStudents(uniqueStudents);

        // Get course progress for all students
        const progress: { [courseId: string]: CourseProgress[] } = {};
        for (const course of teacherCourses) {
          const courseProgress = await Promise.all(
            uniqueStudents
              .filter(student => !!student.id)
              .map(student => courseService.getCourseProgress(course.id, student.id))
          );
          progress[course.id] = courseProgress.filter((p): p is CourseProgress => p !== undefined);
        }
        setCourseProgress(progress);

        // Get pending assignments
        const assignmentsRaw = await assignmentService.getAssignments();
        const assignments = Array.isArray(assignmentsRaw) ? assignmentsRaw : [];
        const pendingAssignments = assignments.filter(assignment => 
          teacherCourses.some(course => course.id === assignment.courseId) &&
          assignment.submissions.some(sub => sub.status === "submitted")
        );
        setPendingAssignments(pendingAssignments);

        // Get all forum topics authored by the teacher or where the teacher has replied
        const topics = await forumService.getTopics();
        const authoredOrRepliedTopics = topics.filter(topic =>
          (typeof topic.author === 'object' ? topic.author.id === user.id : topic.author === user.id) ||
          (Array.isArray(topic.replies) && topic.replies.some(reply => reply.author === user.id))
        );
        setForumTopics(authoredOrRepliedTopics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, toast]);

  // Calculate course statistics
  const getCourseStats = (courseId: string) => {
    const progress = courseProgress[courseId] || [];
    const totalStudents = progress.length;
    if (totalStudents === 0) return { completionRate: 0, avgQuizScore: 0, satisfaction: 0 };

    const completionRate = progress.reduce((sum, p) => sum + (p.status === "completed" ? 1 : 0), 0) / totalStudents * 100;
    const avgQuizScore = progress.reduce((sum, p) => {
      const scores = Object.values(p.quizScores || {});
      return sum + (scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
    }, 0) / totalStudents;
    const course = courses.find(c => c.id === courseId);
    const satisfaction = course?.rating || 0;

    return { completionRate, avgQuizScore, satisfaction };
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  });

  // Filter forum topics based on search query
  const filteredTopics = forumTopics.filter(topic => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(query) ||
      topic.content.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your courses and interact with students</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="forums">Discussion Forums</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Courses</h2>
              <Link to="/dashboard/teacher/courses/create">
                <Button>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create New Course
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, idx) => {
                const stats = getCourseStats(course.id);
                return (
                  <Card key={course.id || idx}>
                    <CardHeader className="p-4">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-36 object-cover rounded-md mb-3" 
                      />
                      <CardTitle className="text-base">{course.title}</CardTitle>
                      <CardDescription>Created: {new Date(course.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 px-4">
                      <div className="flex justify-between text-sm">
                        <span>Students: {courseProgress[course.id]?.length || 0}</span>
                        <span>Rating: {course.rating.toFixed(1)}/5</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-3 border-t flex justify-between">
                      <Link to={`/dashboard/teacher/courses/${course.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit Course
                        </Button>
                      </Link>
                      <Link to={`/dashboard/teacher/courses/${course.id}/manage`}>
                        <Button size="sm">
                          Manage
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}

              <Card key="create-new-course">
                <CardHeader className="p-4 flex flex-col items-center justify-center h-56 border-2 border-dashed border-gray-200 rounded-md">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-2" />
                  <CardTitle className="text-base text-gray-600">Create New Course</CardTitle>
                </CardHeader>
                <CardFooter className="px-4 py-3 border-t">
                  <Link to="/dashboard/teacher/courses/create" className="w-full">
                    <Button className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Create Course
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Reviews</CardTitle>
                  <CardDescription>
                    Submissions waiting for your review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingAssignments.map((assignment, idx) => (
                      <div key={assignment.id || idx} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <div className="flex gap-2 text-sm text-gray-600">
                            <span>{assignment.submissions.filter(s => s.status === "submitted").length} submissions</span>
                            <span>•</span>
                            <span>{courses.find(c => c.id === assignment.courseId)?.title}</span>
                          </div>
                        </div>
                        <Link to={`/dashboard/teacher/assignments/${assignment.id}/review`}>
                          <Button size="sm">
                            Review
                          </Button>
                        </Link>
                      </div>
                    ))}
                    {pendingAssignments.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No pending reviews</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Statistics</CardTitle>
                  <CardDescription>Performance metrics for your courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {courses.map((course, idx) => {
                      const stats = getCourseStats(course.id);
                      return (
                        <div key={course.id || idx}>
                          <h3 className="font-medium mb-2">{course.title}</h3>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="bg-gray-50 p-3 rounded-md flex-1">
                              <p className="text-sm text-gray-600">Completion Rate</p>
                              <p className="text-xl font-bold">{stats.completionRate.toFixed(0)}%</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md flex-1">
                              <p className="text-sm text-gray-600">Average Quiz Score</p>
                              <p className="text-xl font-bold">{stats.avgQuizScore.toFixed(0)}%</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md flex-1">
                              <p className="text-sm text-gray-600">Student Satisfaction</p>
                              <p className="text-xl font-bold">{stats.satisfaction.toFixed(1)}/5</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>View and manage your students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search students..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Export Student List
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Enrolled Course</th>
                        <th className="text-left p-3">Progress</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, idx) => {
                        const enrolledCourse = courses.find(course => 
                          student.enrolledCourses?.includes(course.id)
                        );
                        const progressObj = enrolledCourse ? 
                          courseProgress[enrolledCourse.id]?.find(p => p.userId === student.id) : 
                          undefined;
                        let progressPercent = 0;
                        if (progressObj && enrolledCourse && Array.isArray(enrolledCourse.modules)) {
                          const totalLessons = enrolledCourse.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
                          const completedLessons = progressObj.completedLessons?.length || 0;
                          progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                        }

                        return (
                          <tr key={student.id || idx} className="border-b">
                            <td className="p-3">{student.firstName && student.lastName ? `${student.firstName} ${student.lastName}` : student.name}</td>
                            <td className="p-3">{student.email}</td>
                            <td className="p-3">{enrolledCourse?.title || "Not enrolled"}</td>
                            <td className="p-3">
                              {progressObj ? (
                                <>
                                  <div className="w-full bg-gray-200 h-2 rounded-full">
                                    <div 
                                      className="bg-primary h-2 rounded-full" 
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-600">{progressPercent}%</span>
                                </>
                              ) : (
                                <span className="text-gray-500">No progress</span>
                              )}
                            </td>
                            <td className="p-3">
                              <Link to={`/dashboard/teacher/students/${student.id}`}>
                                <Button variant="outline" size="sm">View Details</Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-gray-500">
                            No students found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forums" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Course Discussion Forums</CardTitle>
                  <CardDescription>Manage forum discussions for your courses</CardDescription>
                </div>
                {user?.role === "admin" && (
                  <Link to="/dashboard/teacher/forums/manage">
                    <Button>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Manage Forums
                    </Button>
                  </Link>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search discussions..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Link to="/dashboard/teacher/forums/create">
                    <Button>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Create Discussion
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {filteredTopics.map((topic, idx) => {
                    const course = courses.find(c => c.id === topic.courseId);
                    return (
                      <div key={topic.id || idx} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-200 transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <Link to={`/forum/${topic.id}`} className="text-lg font-semibold hover:text-primary">
                              {topic.title}
                            </Link>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                              {topic.category && (
                                <Badge variant="secondary" className="font-normal">{topic.category}</Badge>
                              )}
                              {topic.tags && topic.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs font-normal">#{tag}</Badge>
                              ))}
                              {course && (
                                <Badge variant="outline" className="text-xs font-normal">{course.title}</Badge>
                              )}
                            </div>
                            <div className="mt-2 text-gray-500 text-sm">
                              {topic.content.substring(0, 100)}...
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 min-w-[120px]">
                            <div className="flex items-center text-gray-500 text-xs">
                              <UserIcon className="mr-1 h-3 w-3" />
                              <span>{typeof topic.author === 'object' ? `${topic.author.firstName} ${topic.author.lastName}` : topic.author}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center text-gray-500 text-xs">
                                <MessageSquare className="mr-1 h-3 w-3" />
                                <span>{topic.replies?.length || 0} replies</span>
                              </div>
                              <div className="flex items-center text-gray-500 text-xs">
                                <span role="img" aria-label="likes">👍</span>
                                <span className="ml-1">{topic.likes?.length || 0} likes</span>
                              </div>
                              <div className="flex items-center text-gray-500 text-xs">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>{new Date(topic.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredTopics.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No forum topics found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Outlet />
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default TeacherDashboard;
