import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, MessageSquare, Settings, Edit, Trash2, Shield, ShieldOff } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/services/courseService";
import { forumService } from "@/services/forumService";
import { userApi } from "@/services/api";
import { Analytics, ForumTopic, Course, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentActivity, setRecentActivity] = useState<{
    type: 'user' | 'course' | 'forum';
    title: string;
    description: string;
    timestamp: Date;
  }[]>([]);
  const { user, setUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedForumTopic, setSelectedForumTopic] = useState<ForumTopic | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'user' | 'course' | 'forum' | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get all users
        const { data: allUsers } = await userApi.getAllUsers();
        // Ensure each user has an id property
        setUsers(allUsers.map(u => ({ ...u, id: u.id || u._id })));

        // Get all courses
        const allCourses = await courseService.getAllCourses();
        setCourses(allCourses);

        // Get all forum topics
        const topics = await forumService.getTopics();
        setForumTopics(topics);

        // Calculate analytics
        const analytics: Analytics = {
          totalUsers: allUsers.length,
          activeUsers: allUsers.filter(u => !u.isDisabled).length,
          totalCourses: allCourses.length,
          activeCourses: allCourses.filter(c => c.isPublished).length,
          courseCompletionRate: allCourses.reduce((acc, course) => acc + (course.completionRate || 0), 0) / allCourses.length || 0,
          averageRating: allCourses.reduce((acc, course) => acc + (course.rating || 0), 0) / allCourses.length || 0,
        };
        setAnalytics(analytics);

        // Generate recent activity
        const activity = [
          ...allUsers.slice(-3).map(user => ({
            type: 'user' as const,
            title: 'New User Registration',
            description: `${user.firstName} ${user.lastName} joined the platform`,
            timestamp: new Date(user.createdAt)
          })),
          ...allCourses.slice(-3).map(course => ({
            type: 'course' as const,
            title: 'New Course Published',
            description: course.title,
            timestamp: new Date(course.createdAt)
          })),
          ...topics.slice(-3).map(topic => ({
            type: 'forum' as const,
            title: 'New Forum Discussion',
            description: topic.title,
            timestamp: new Date(topic.createdAt)
          }))
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
         .slice(0, 3);

        setRecentActivity(activity);

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

  // Handlers for Users
  const handleEditUser = async (userId: string) => {
    try {
      const { data: updatedUser } = await userApi.updateUser(userId, { /* user data */ });
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await userApi.deleteUser(selectedUser.id);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // Handlers for Courses
  const handleEditCourse = async (courseId: string) => {
    try {
      const updatedCourse = await courseService.updateCourse(courseId, { /* course data */ });
      setCourses(courses.map(c => c.id === courseId ? updatedCourse : c));
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      await courseService.deleteCourse(selectedCourse.id);
      setCourses(courses.filter(c => c.id !== selectedCourse.id));
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  // Handlers for Forum Topics
  const handleDeleteForumTopic = async (topicId: string) => {
    try {
      await forumService.deleteTopic(topicId);
      setForumTopics(forumTopics.filter(topic => topic.id !== topicId));
      setDeleteDialogOpen(false);
      setSelectedForumTopic(null);
      toast({
        title: "Success",
        description: "Forum topic deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete forum topic",
        variant: "destructive",
      });
    }
  };

  // Handler to disable/enable user
  const handleToggleUserStatus = async (user: User) => {
    if (!user.id) {
      toast({
        title: "Error",
        description: "User ID is missing. Cannot update user status.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { data: updatedUser } = await userApi.updateUser(user.id, { 
        isDisabled: !user.isDisabled,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      });
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      toast({
        title: "Success",
        description: `User ${updatedUser.isDisabled ? 'disabled' : 'enabled'} successfully`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  // Add this function to handle forum topic search
  const filteredForumTopics = forumTopics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshUser = async (): Promise<void> => {
    if (!user) return;

    try {
      // Get the latest user data
      const { data: userData } = await userApi.getUser(user.id);
      
      // Get user's enrollments
      const { data: enrollments } = await userApi.getUserEnrollments(user.id);
      console.log("Enrollments fetched from backend:", enrollments);

      // Handle both cases: array of course objects or array of IDs
      let enrolledCourseIds: string[] = [];
      if (Array.isArray(enrollments) && enrollments.length > 0) {
        if (typeof enrollments[0] === "string") {
          enrolledCourseIds = enrollments;
        } else if (typeof enrollments[0] === "object") {
          enrolledCourseIds = enrollments.map(
            (e) => e._id || e.id || e.courseId
          );
        }
      }

      setUser({
        ...userData,
        enrolledCourses: enrolledCourseIds,
      });
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh user data",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold dashboard-header">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage courses, users, and platform settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-learnup-blue3/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-learnup-blue1 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-learnup-blue1 data-[state=active]:text-white">Users</TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-learnup-blue1 data-[state=active]:text-white">Courses</TabsTrigger>
            <TabsTrigger value="forums" className="data-[state=active]:bg-learnup-blue1 data-[state=active]:text-white">Forums</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <Card className="dashboard-card border-learnup-blue3/20">
                <CardHeader className="pb-2 bg-gradient-to-r from-learnup-blue3/10 to-transparent">
                  <CardTitle className="text-sm font-medium text-learnup-blue5">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-learnup-blue1">{analytics?.totalUsers || 0}</div>
                  <p className="text-xs text-learnup-blue4 mt-1">Active Users: {analytics?.activeUsers || 0}</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3 bg-learnup-blue3/5">
                  <Button variant="link" className="text-xs text-learnup-blue1 hover:underline p-0" onClick={() => setActiveTab('users')}>View all users</Button>
                </CardFooter>
              </Card>
              {/* Card 2 */}
              <Card className="dashboard-card border-learnup-blue3/20">
                <CardHeader className="pb-2 bg-gradient-to-r from-learnup-blue3/10 to-transparent">
                  <CardTitle className="text-sm font-medium text-learnup-blue5">Active Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-learnup-blue1">{analytics?.activeCourses || 0}</div>
                  <p className="text-xs text-learnup-blue4 mt-1">Total Courses: {analytics?.totalCourses || 0}</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3 bg-learnup-blue3/5">
                  <Button variant="link" className="text-xs text-learnup-blue1 hover:underline p-0" onClick={() => setActiveTab('courses')}>View all courses</Button>
                </CardFooter>
              </Card>
              {/* Card 3 */}
              <Card className="dashboard-card border-learnup-blue3/20">
                <CardHeader className="pb-2 bg-gradient-to-r from-learnup-blue3/10 to-transparent">
                  <CardTitle className="text-sm font-medium text-learnup-blue5">Course Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-learnup-blue1">{(analytics?.courseCompletionRate * 100 || 0).toFixed(1)}%</div>
                  <p className="text-xs text-learnup-blue4 mt-1">Average Rating: {analytics?.averageRating.toFixed(1) || 0}</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3 bg-learnup-blue3/5">
                  <Button variant="link" className="text-xs text-learnup-blue1 hover:underline p-0" onClick={() => setActiveTab('courses')}>View detailed analytics</Button>
                </CardFooter>
              </Card>
            </div>

            {/* Recent Activity Card */}
            <Card className="dashboard-card border-learnup-blue3/20">
              <CardHeader className="bg-gradient-to-r from-learnup-blue3/10 to-transparent">
                <CardTitle className="text-learnup-blue5">Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={`${activity.type}-${activity.timestamp.getTime()}-${activity.title}`} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-learnup-blue3 flex items-center justify-center">
                        {activity.type === 'user' ? (
                          <Users className="h-5 w-5 text-learnup-blue1" />
                        ) : activity.type === 'course' ? (
                          <BookOpen className="h-5 w-5 text-learnup-blue1" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-learnup-blue1" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-learnup-blue5">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-learnup-blue4 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t py-3 px-6 bg-learnup-blue3/5">
                <Button variant="outline" className="w-full border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Users Tab Content */}
          <TabsContent value="users" className="mt-6">
            <Card className="dashboard-card border-learnup-blue3/20">
              <CardHeader className="bg-gradient-to-r from-learnup-blue3/10 to-transparent flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-learnup-blue5">User Management</CardTitle>
                  <CardDescription>View and manage user accounts</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <input
                      type="search"
                      placeholder="Search users..."
                      className="w-full h-10 px-3 py-2 border border-learnup-blue3/30 rounded-md pl-8 focus:border-learnup-blue1 focus:ring-1 focus:ring-learnup-blue1 focus:outline-none"
                    />
                    <div className="absolute left-2.5 top-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-learnup-blue4"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr key="header" className="border-b border-learnup-blue3/20 bg-learnup-blue3/10">
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Name</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Email</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Role</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Status</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Created At</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Updated At</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={`user-${user.id}-${user.email}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Teacher' : 'Student'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              !user.isDisabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {!user.isDisabled ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-400 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-400 text-sm">{new Date(user.updatedAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="p-1" onClick={() => handleToggleUserStatus(user)}>
                                {user.isDisabled ? <ShieldOff className="h-4 w-4 text-yellow-600" /> : <Shield className="h-4 w-4 text-green-600" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="p-1" onClick={() => { setSelectedUser(user); setDeleteType('user'); setDeleteDialogOpen(true); }}>
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab Content */}
          <TabsContent value="courses" className="mt-6">
            <Card className="dashboard-card border-learnup-blue3/20">
              <CardHeader className="bg-gradient-to-r from-learnup-blue3/10 to-transparent flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-learnup-blue5">Course Management</CardTitle>
                  <CardDescription>View and manage all courses</CardDescription>
                </div>
                <Link to="/dashboard/courses/manage">
                  <Button className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 text-white">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Manage Courses
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <input
                      type="search"
                      placeholder="Search courses..."
                      className="w-full h-10 px-3 py-2 border border-learnup-blue3/30 rounded-md pl-8 focus:border-learnup-blue1 focus:ring-1 focus:ring-learnup-blue1 focus:outline-none"
                    />
                    <div className="absolute left-2.5 top-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-learnup-blue4"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map(course => (
                    <Card key={`course-${course.id}-${course.title}`} className="overflow-hidden border-learnup-blue3/20 hover:border-learnup-blue1 transition-all duration-300 hover:shadow-md">
                      <CardHeader className="p-4">
                        <img src={course.image} alt={course.title} className="w-full h-36 object-cover rounded-md mb-3" />
                        <CardTitle className="text-base text-learnup-blue5">{course.title}</CardTitle>
                        <CardDescription>{course.instructor}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0 px-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-learnup-blue4">Students: {course.enrolledStudents || 0}</span>
                          <span className="text-learnup-blue1">Rating: {course.rating}/5</span>
                        </div>
                      </CardContent>
                      <CardFooter className="px-4 py-3 border-t bg-learnup-blue3/5 flex justify-between">
                        <Link to={`/dashboard/courses/${course.id}/edit`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5"
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => { setSelectedCourse(course); setDeleteType('course'); setDeleteDialogOpen(true); }}>
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forums Tab Content */}
          <TabsContent value="forums" className="mt-6">
            <Card className="dashboard-card border-learnup-blue3/20">
              <CardHeader className="bg-gradient-to-r from-learnup-blue3/10 to-transparent flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-learnup-blue5">Forum Management</CardTitle>
                  <CardDescription>Manage forum topics and discussions</CardDescription>
                </div>
                <Link to="/dashboard/forum/manage">
                  <Button className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 text-white">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Manage Forums
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <input
                      type="search"
                      placeholder="Search forum topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 px-3 py-2 border border-learnup-blue3/30 rounded-md pl-8 focus:border-learnup-blue1 focus:ring-1 focus:ring-learnup-blue1 focus:outline-none"
                    />
                    <div className="absolute left-2.5 top-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-learnup-blue4"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredForumTopics.map(topic => (
                    <div key={`forum-${topic.id}-${topic.title}`} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-200 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-learnup-blue5">{topic.title}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            {topic.category && (
                              <Badge variant="secondary" className="font-normal">{topic.category}</Badge>
                            )}
                            {topic.tags && topic.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs font-normal">#{tag}</Badge>
                            ))}
                            <span className="text-xs text-learnup-blue4">Course: {topic.courseId}</span>
                          </div>
                          <div className="mt-2 text-gray-500 text-sm">
                            {topic.content.substring(0, 100)}...
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                          <div className="flex items-center text-gray-500 text-xs">
                            <Users className="mr-1 h-3 w-3" />
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
                          <div className="flex gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5"
                              onClick={() => window.open(`/forum/${topic.id}`, '_blank')}
                            >
                              View
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => {
                                setSelectedForumTopic(topic);
                                setDeleteType('forum');
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredForumTopics.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      {searchQuery ? 'No matching forum topics found' : 'No forum topics found'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          (deleteType === 'user' && selectedUser) ||
          (deleteType === 'course' && selectedCourse) ||
          (deleteType === 'forum' && selectedForumTopic) ? (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this {deleteType}?</p>
                <div className="flex gap-4 mt-6">
                  <Button variant="destructive" onClick={() => {
                    if (deleteType === 'user') handleDeleteUser();
                    if (deleteType === 'course') handleDeleteCourse();
                    if (deleteType === 'forum') handleDeleteForumTopic(selectedForumTopic?.id || '');
                  }}>Delete</Button>
                  <Button variant="outline" onClick={() => {
                    setDeleteDialogOpen(false);
                    setSelectedUser(null);
                    setSelectedCourse(null);
                    setSelectedForumTopic(null);
                  }}>Cancel</Button>
                </div>
              </div>
            </div>
          ) : null
        )}
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default AdminDashboard;
