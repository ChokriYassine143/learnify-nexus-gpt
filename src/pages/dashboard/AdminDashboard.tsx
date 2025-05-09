
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, MessageSquare, Settings, Edit, Trash2, Shield, ShieldOff } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminDashboard: React.FC = () => {
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold dashboard-header">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage courses, users, and platform settings</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-learnup-blue3/30">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-learnup-blue1 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-learnup-blue1 data-[state=active]:text-white"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="courses"
              className="data-[state=active]:bg-learnup-blue1 data-[state=active]:text-white"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="forums"
              className="data-[state=active]:bg-learnup-blue1 data-[state=active]:text-white"
            >
              Forums
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 */}
              <Card className="dashboard-card border-learnup-blue3/20">
                <CardHeader className="pb-2 bg-gradient-to-r from-learnup-blue3/10 to-transparent">
                  <CardTitle className="text-sm font-medium text-learnup-blue5">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-learnup-blue1">2,853</div>
                  <p className="text-xs text-learnup-blue4 mt-1">+12% from last month</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3 bg-learnup-blue3/5">
                  <Link to="/dashboard/users" className="text-xs text-learnup-blue1 hover:underline">
                    View all users
                  </Link>
                </CardFooter>
              </Card>

              {/* Card 2 */}
              <Card className="dashboard-card border-learnup-blue3/20">
                <CardHeader className="pb-2 bg-gradient-to-r from-learnup-blue3/10 to-transparent">
                  <CardTitle className="text-sm font-medium text-learnup-blue5">Active Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-learnup-blue1">128</div>
                  <p className="text-xs text-learnup-blue4 mt-1">+4 new this week</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3 bg-learnup-blue3/5">
                  <Link to="/dashboard/courses" className="text-xs text-learnup-blue1 hover:underline">
                    View all courses
                  </Link>
                </CardFooter>
              </Card>

              {/* Card 3 */}
              <Card className="dashboard-card border-learnup-blue3/20">
                <CardHeader className="pb-2 bg-gradient-to-r from-learnup-blue3/10 to-transparent">
                  <CardTitle className="text-sm font-medium text-learnup-blue5">Forum Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-learnup-blue1">592</div>
                  <p className="text-xs text-learnup-blue4 mt-1">+38 this week</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3 bg-learnup-blue3/5">
                  <Link to="/forum" className="text-xs text-learnup-blue1 hover:underline">
                    View all discussions
                  </Link>
                </CardFooter>
              </Card>

              {/* Card 4 */}
              <Card className="dashboard-card border-learnup-blue3/20">
                <CardHeader className="pb-2 bg-gradient-to-r from-learnup-blue3/10 to-transparent">
                  <CardTitle className="text-sm font-medium text-learnup-blue5">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-learnup-blue1">$12,234</div>
                  <p className="text-xs text-learnup-blue4 mt-1">+7.4% from last month</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3 bg-learnup-blue3/5">
                  <Link to="/dashboard/finances" className="text-xs text-learnup-blue1 hover:underline">
                    View financial details
                  </Link>
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
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-learnup-blue3 flex items-center justify-center">
                      <Users className="h-5 w-5 text-learnup-blue1" />
                    </div>
                    <div>
                      <p className="font-medium text-learnup-blue5">New User Registration</p>
                      <p className="text-sm text-gray-600">Sarah Johnson joined the platform</p>
                      <p className="text-xs text-learnup-blue4 mt-1">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-learnup-blue3 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-learnup-blue1" />
                    </div>
                    <div>
                      <p className="font-medium text-learnup-blue5">New Course Published</p>
                      <p className="text-sm text-gray-600">Advanced Machine Learning Techniques</p>
                      <p className="text-xs text-learnup-blue4 mt-1">Yesterday</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-learnup-blue3 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-learnup-blue1" />
                    </div>
                    <div>
                      <p className="font-medium text-learnup-blue5">New Forum Discussion</p>
                      <p className="text-sm text-gray-600">Best practices for React state management</p>
                      <p className="text-xs text-learnup-blue4 mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t py-3 px-6 bg-learnup-blue3/5">
                <Button variant="outline" className="w-full border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5">View All Activity</Button>
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
                <Link to="/dashboard/users/manage">
                  <Button className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 text-white">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
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

                  <Button className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 text-white">
                    <Users className="mr-2 h-4 w-4" />
                    Add New User
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-learnup-blue3/20 bg-learnup-blue3/10">
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Name</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Email</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Role</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Status</th>
                        <th className="text-left p-3 text-learnup-blue5 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-learnup-blue3/10 hover:bg-learnup-blue3/5">
                        <td className="p-3">John Smith</td>
                        <td className="p-3">john.smith@example.com</td>
                        <td className="p-3">Student</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <ShieldOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-learnup-blue3/10 hover:bg-learnup-blue3/5">
                        <td className="p-3">Emma Johnson</td>
                        <td className="p-3">emma.j@example.com</td>
                        <td className="p-3">Teacher</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <ShieldOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-learnup-blue3/10 hover:bg-learnup-blue3/5">
                        <td className="p-3">Michael Chen</td>
                        <td className="p-3">m.chen@example.com</td>
                        <td className="p-3">Admin</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <ShieldOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-learnup-blue3/5">
                        <td className="p-3">Sarah Parker</td>
                        <td className="p-3">sarah.p@example.com</td>
                        <td className="p-3">Student</td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Inactive</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5">Edit</Button>
                            <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-50">Enable</Button>
                          </div>
                        </td>
                      </tr>
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

                  <Button className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 text-white">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Add New Course
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Course Card 1 */}
                  <Card className="overflow-hidden border-learnup-blue3/20 hover:border-learnup-blue1 transition-all duration-300 hover:shadow-md">
                    <CardHeader className="p-4">
                      <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                           className="w-full h-36 object-cover rounded-md mb-3" />
                      <CardTitle className="text-base text-learnup-blue5">Web Development Fundamentals</CardTitle>
                      <CardDescription>Prof. John Smith</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 px-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-learnup-blue4">Students: 12,543</span>
                        <span className="text-learnup-blue1">Rating: 4.7/5</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-3 border-t bg-learnup-blue3/5 flex justify-between">
                      <Link to="/dashboard/courses/edit/1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Course Card 2 */}
                  <Card className="overflow-hidden border-learnup-blue3/20 hover:border-learnup-blue1 transition-all duration-300 hover:shadow-md">
                    <CardHeader className="p-4">
                      <img src="https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                           className="w-full h-36 object-cover rounded-md mb-3" />
                      <CardTitle className="text-base text-learnup-blue5">Data Science and Machine Learning</CardTitle>
                      <CardDescription>Dr. Sarah Johnson</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 px-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-learnup-blue4">Students: 8,976</span>
                        <span className="text-learnup-blue1">Rating: 4.9/5</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-3 border-t bg-learnup-blue3/5 flex justify-between">
                      <Link to="/dashboard/courses/edit/2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Course Card 3 */}
                  <Card className="overflow-hidden border-learnup-blue3/20 hover:border-learnup-blue1 transition-all duration-300 hover:shadow-md">
                    <CardHeader className="p-4">
                      <img src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                           className="w-full h-36 object-cover rounded-md mb-3" />
                      <CardTitle className="text-base text-learnup-blue5">Mobile App Development</CardTitle>
                      <CardDescription>Michael Chen</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 px-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-learnup-blue4">Students: 7,432</span>
                        <span className="text-learnup-blue1">Rating: 4.6/5</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-3 border-t bg-learnup-blue3/5 flex justify-between">
                      <Link to="/dashboard/courses/edit/3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="border-t py-3 px-6 bg-learnup-blue3/5">
                <Link to="/dashboard/courses/manage">
                  <Button 
                    variant="outline" 
                    className="w-full border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5"
                  >
                    View All Courses
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Forums Tab Content */}
          <TabsContent value="forums" className="mt-6">
            <Card className="dashboard-card border-learnup-blue3/20">
              <CardHeader className="bg-gradient-to-r from-learnup-blue3/10 to-transparent flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-learnup-blue5">Forum Management</CardTitle>
                  <CardDescription>Manage forum categories and discussions</CardDescription>
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
                      placeholder="Search forums..."
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

                  <Button className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 text-white">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* Forum Category 1 */}
                  <div className="border border-learnup-blue3/20 rounded-md p-4 hover:border-learnup-blue1 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-learnup-blue5">Web Development</h3>
                        <p className="text-sm text-gray-600">Discussions about web development technologies</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-learnup-blue4">
                      <span>253 topics</span>
                      <span>1,243 posts</span>
                      <span>Last post: 2 hours ago</span>
                    </div>
                  </div>
                  
                  {/* Forum Category 2 */}
                  <div className="border border-learnup-blue3/20 rounded-md p-4 hover:border-learnup-blue1 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-learnup-blue5">Data Science</h3>
                        <p className="text-sm text-gray-600">Discussions about data science and analytics</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-learnup-blue4">
                      <span>187 topics</span>
                      <span>932 posts</span>
                      <span>Last post: Yesterday</span>
                    </div>
                  </div>
                  
                  {/* Forum Category 3 */}
                  <div className="border border-learnup-blue3/20 rounded-md p-4 hover:border-learnup-blue1 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-learnup-blue5">Mobile Apps</h3>
                        <p className="text-sm text-gray-600">Discussions about mobile app development</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-learnup-blue4">
                      <span>135 topics</span>
                      <span>612 posts</span>
                      <span>Last post: 3 days ago</span>
                    </div>
                  </div>
                  
                  {/* Forum Category 4 */}
                  <div className="border border-learnup-blue3/20 rounded-md p-4 hover:border-learnup-blue1 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-learnup-blue5">Graphic Design</h3>
                        <p className="text-sm text-gray-600">Discussions about graphic design and visual arts</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3 hover:text-learnup-blue5">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-learnup-blue4">
                      <span>98 topics</span>
                      <span>432 posts</span>
                      <span>Last post: 5 days ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default AdminDashboard;
