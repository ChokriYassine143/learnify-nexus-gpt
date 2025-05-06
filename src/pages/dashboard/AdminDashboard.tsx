
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, MessageSquare, Settings } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminDashboard: React.FC = () => {
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage courses, users, and platform settings</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="forums">Forums</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,853</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3">
                  <Link to="/dashboard/users" className="text-xs text-blue-600 hover:underline">
                    View all users
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">128</div>
                  <p className="text-xs text-muted-foreground mt-1">+4 new this week</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3">
                  <Link to="/dashboard/courses" className="text-xs text-blue-600 hover:underline">
                    View all courses
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Forum Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">592</div>
                  <p className="text-xs text-muted-foreground mt-1">+38 this week</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3">
                  <Link to="/forum" className="text-xs text-blue-600 hover:underline">
                    View all discussions
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,234</div>
                  <p className="text-xs text-muted-foreground mt-1">+7.4% from last month</p>
                </CardContent>
                <CardFooter className="border-t px-6 py-3">
                  <Link to="/dashboard/finances" className="text-xs text-blue-600 hover:underline">
                    View financial details
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">New User Registration</p>
                      <p className="text-sm text-gray-600">Sarah Johnson joined the platform</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">New Course Published</p>
                      <p className="text-sm text-gray-600">Advanced Machine Learning Techniques</p>
                      <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">New Forum Discussion</p>
                      <p className="text-sm text-gray-600">Best practices for React state management</p>
                      <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t py-3 px-6">
                <Button variant="outline" className="w-full">View All Activity</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <input
                      type="search"
                      placeholder="Search users..."
                      className="w-full h-10 px-3 py-2 border rounded-md pl-8"
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
                        className="text-gray-500"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>

                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Add New User
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">John Smith</td>
                        <td className="p-3">john.smith@example.com</td>
                        <td className="p-3">Student</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Disable</Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Emma Johnson</td>
                        <td className="p-3">emma.j@example.com</td>
                        <td className="p-3">Teacher</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Disable</Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Michael Chen</td>
                        <td className="p-3">m.chen@example.com</td>
                        <td className="p-3">Admin</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Disable</Button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Sarah Parker</td>
                        <td className="p-3">sarah.p@example.com</td>
                        <td className="p-3">Student</td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Inactive</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Enable</Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>View and manage all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <input
                      type="search"
                      placeholder="Search courses..."
                      className="w-full h-10 px-3 py-2 border rounded-md pl-8"
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
                        className="text-gray-500"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>

                  <Button>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Add New Course
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="p-4">
                      <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                           className="w-full h-36 object-cover rounded-md mb-3" />
                      <CardTitle className="text-base">Web Development Fundamentals</CardTitle>
                      <CardDescription>Prof. John Smith</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 px-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Students: 12,543</span>
                        <span>Rating: 4.7/5</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-3 border-t flex justify-between">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <img src="https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                           className="w-full h-36 object-cover rounded-md mb-3" />
                      <CardTitle className="text-base">Data Science and Machine Learning</CardTitle>
                      <CardDescription>Dr. Sarah Johnson</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 px-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Students: 8,976</span>
                        <span>Rating: 4.9/5</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-3 border-t flex justify-between">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <img src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                           className="w-full h-36 object-cover rounded-md mb-3" />
                      <CardTitle className="text-base">Mobile App Development</CardTitle>
                      <CardDescription>Michael Chen</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0 px-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Students: 7,432</span>
                        <span>Rating: 4.6/5</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-3 border-t flex justify-between">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="border-t py-3 px-6">
                <Button variant="outline" className="w-full">View All Courses</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="forums" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Forum Management</CardTitle>
                <CardDescription>Manage forum categories and discussions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <input
                      type="search"
                      placeholder="Search forums..."
                      className="w-full h-10 px-3 py-2 border rounded-md pl-8"
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
                        className="text-gray-500"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>

                  <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Web Development</h3>
                        <p className="text-sm text-gray-600">Discussions about web development technologies</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>253 topics</span>
                      <span>1,243 posts</span>
                      <span>Last post: 2 hours ago</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Data Science</h3>
                        <p className="text-sm text-gray-600">Discussions about data science and analytics</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>187 topics</span>
                      <span>932 posts</span>
                      <span>Last post: Yesterday</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Mobile Apps</h3>
                        <p className="text-sm text-gray-600">Discussions about mobile app development</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>135 topics</span>
                      <span>612 posts</span>
                      <span>Last post: 3 days ago</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Graphic Design</h3>
                        <p className="text-sm text-gray-600">Discussions about graphic design and visual arts</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
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
