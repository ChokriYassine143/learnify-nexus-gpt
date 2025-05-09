
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Users, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const TeacherDashboard: React.FC = () => {
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your courses and interact with students</p>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="forums">Discussion Forums</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Courses</h2>
              <Link to="/dashboard/courses/create">
                <Button>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create New Course
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="p-4">
                  <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                       className="w-full h-36 object-cover rounded-md mb-3" />
                  <CardTitle className="text-base">Web Development Fundamentals</CardTitle>
                  <CardDescription>Created: Jan 15, 2023</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 pt-0 px-4">
                  <div className="flex justify-between text-sm">
                    <span>Students: 347</span>
                    <span>Rating: 4.7/5</span>
                  </div>
                </CardContent>
                <CardFooter className="px-4 py-3 border-t flex justify-between">
                  <Link to="/dashboard/courses/edit/1">
                    <Button variant="outline" size="sm">
                      Edit Course
                    </Button>
                  </Link>
                  <Link to="/dashboard/courses/manage">
                    <Button size="sm">
                      Manage
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                       className="w-full h-36 object-cover rounded-md mb-3" />
                  <CardTitle className="text-base">Frontend Development with React</CardTitle>
                  <CardDescription>Created: Mar 22, 2023</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 pt-0 px-4">
                  <div className="flex justify-between text-sm">
                    <span>Students: 296</span>
                    <span>Rating: 4.9/5</span>
                  </div>
                </CardContent>
                <CardFooter className="px-4 py-3 border-t flex justify-between">
                  <Link to="/dashboard/courses/edit/2">
                    <Button variant="outline" size="sm">
                      Edit Course
                    </Button>
                  </Link>
                  <Link to="/dashboard/courses/manage">
                    <Button size="sm">
                      Manage
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4 flex flex-col items-center justify-center h-56 border-2 border-dashed border-gray-200 rounded-md">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-2" />
                  <CardTitle className="text-base text-gray-600">Create New Course</CardTitle>
                </CardHeader>
                <CardFooter className="px-4 py-3 border-t">
                  <Link to="/dashboard/courses/create" className="w-full">
                    <Button className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Create Course
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Assignments & Quizzes</h2>
              <div className="flex gap-3">
                <Link to="/dashboard/quizzes/manage">
                  <Button variant="outline">
                    Manage Quizzes
                  </Button>
                </Link>
                <Link to="/dashboard/assignments/manage">
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Student Assignments
                  </Button>
                </Link>
              </div>
            </div>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>
                  Submissions waiting for your review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">Portfolio Project</h3>
                      <div className="flex gap-2 text-sm text-gray-600">
                        <span>3 submissions</span>
                        <span>•</span>
                        <span>Web Development Fundamentals</span>
                      </div>
                    </div>
                    <Link to="/dashboard/assignments/manage">
                      <Button size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">REST API Project</h3>
                      <div className="flex gap-2 text-sm text-gray-600">
                        <span>2 submissions</span>
                        <span>•</span>
                        <span>Backend Development</span>
                      </div>
                    </div>
                    <Link to="/dashboard/assignments/manage">
                      <Button size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Course Statistics</CardTitle>
                <CardDescription>Performance metrics for your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Web Development Fundamentals</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="bg-gray-50 p-3 rounded-md flex-1">
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="text-xl font-bold">78%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md flex-1">
                        <p className="text-sm text-gray-600">Average Quiz Score</p>
                        <p className="text-xl font-bold">84%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md flex-1">
                        <p className="text-sm text-gray-600">Student Satisfaction</p>
                        <p className="text-xl font-bold">4.7/5</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Frontend Development with React</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="bg-gray-50 p-3 rounded-md flex-1">
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="text-xl font-bold">81%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md flex-1">
                        <p className="text-sm text-gray-600">Average Quiz Score</p>
                        <p className="text-xl font-bold">89%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md flex-1">
                        <p className="text-sm text-gray-600">Student Satisfaction</p>
                        <p className="text-xl font-bold">4.9/5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    <input
                      type="search"
                      placeholder="Search students..."
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

                  <div>
                    <Button variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Export Student List
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Enrolled Course</th>
                        <th className="text-left p-3">Progress</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">John Smith</td>
                        <td className="p-3">john.smith@example.com</td>
                        <td className="p-3">Web Development Fundamentals</td>
                        <td className="p-3">
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                          <span className="text-xs text-gray-600">75%</span>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">View Details</Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Emma Johnson</td>
                        <td className="p-3">emma.j@example.com</td>
                        <td className="p-3">Web Development Fundamentals</td>
                        <td className="p-3">
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                          </div>
                          <span className="text-xs text-gray-600">92%</span>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">View Details</Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Michael Chen</td>
                        <td className="p-3">m.chen@example.com</td>
                        <td className="p-3">Frontend Development with React</td>
                        <td className="p-3">
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                          <span className="text-xs text-gray-600">45%</span>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">View Details</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Sarah Parker</td>
                        <td className="p-3">sarah.p@example.com</td>
                        <td className="p-3">Frontend Development with React</td>
                        <td className="p-3">
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }}></div>
                          </div>
                          <span className="text-xs text-gray-600">68%</span>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">View Details</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="border-t py-3 px-6 flex justify-center">
                <Button variant="outline">View All Students</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="forums" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Course Discussion Forums</CardTitle>
                  <CardDescription>Manage forum discussions for your courses</CardDescription>
                </div>
                <Link to="/dashboard/forum/manage">
                  <Button>
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
                      placeholder="Search discussions..."
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
                    Create Discussion
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Web Development Fundamentals - General Discussion</h3>
                        <div className="flex gap-2 text-sm text-gray-600 mt-1">
                          <span>45 topics</span>
                          <span>•</span>
                          <span>312 replies</span>
                          <span>•</span>
                          <span>Last post: 2 hours ago</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>General discussion forum for Web Development course materials and topics.</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Web Development Fundamentals - Assignments Help</h3>
                        <div className="flex gap-2 text-sm text-gray-600 mt-1">
                          <span>23 topics</span>
                          <span>•</span>
                          <span>156 replies</span>
                          <span>•</span>
                          <span>Last post: Yesterday</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>Forum dedicated to assignment help and questions for Web Development course.</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Frontend Development with React - General Discussion</h3>
                        <div className="flex gap-2 text-sm text-gray-600 mt-1">
                          <span>38 topics</span>
                          <span>•</span>
                          <span>264 replies</span>
                          <span>•</span>
                          <span>Last post: 4 hours ago</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>General discussion forum for React course materials and topics.</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Frontend Development with React - Project Showcase</h3>
                        <div className="flex gap-2 text-sm text-gray-600 mt-1">
                          <span>17 topics</span>
                          <span>•</span>
                          <span>98 replies</span>
                          <span>•</span>
                          <span>Last post: 3 days ago</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>Forum for students to showcase their React projects and receive feedback.</p>
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

export default TeacherDashboard;
