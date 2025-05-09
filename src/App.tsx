
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CoursesList from "./pages/courses/CoursesList";
import CourseDetails from "./pages/courses/CourseDetails";
import ForumIndex from "./pages/forum/ForumIndex";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import AboutUs from "./pages/about/AboutUs";
import ContactUs from "./pages/contact/ContactUs";
import CourseLearningPage from "./pages/courses/CourseLearningPage";
import CreateForumPost from "./pages/forum/CreateForumPost";
import ForumTopicPage from "./pages/forum/ForumTopicPage";

// Dashboard pages
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";
import ManageCoursesPage from "./pages/dashboard/courses/ManageCoursesPage";
import CreateCoursePage from "./pages/dashboard/courses/CreateCoursePage";
import ResourcesPage from "./pages/dashboard/resources/ResourcesPage";
import ManageResourcesPage from "./pages/dashboard/resources/ManageResourcesPage";
import QuizzesPage from "./pages/dashboard/quizzes/QuizzesPage";
import ManageQuizzesPage from "./pages/dashboard/quizzes/ManageQuizzesPage";
import CreateQuizPage from "./pages/dashboard/quizzes/CreateQuizPage";
import PaymentsPage from "./pages/dashboard/payments/PaymentsPage";
import MonitorPaymentsPage from "./pages/dashboard/payments/MonitorPaymentsPage";
import ChatbotPage from "./pages/dashboard/ChatbotPage";
import AssignmentsPage from "./pages/dashboard/assignments/AssignmentsPage";
import TeacherAssignmentsPage from "./pages/dashboard/assignments/TeacherAssignmentsPage";
import UserManagementPage from "./pages/dashboard/users/UserManagementPage";
import CourseEditPage from "./pages/dashboard/courses/CourseEditPage";
import ForumManagementPage from "./pages/dashboard/forum/ForumManagementPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<CoursesList />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/course/:courseId/learn/:lessonId?" element={<CourseLearningPage />} />
              <Route path="/forum" element={<ForumIndex />} />
              <Route path="/forum/new" element={<CreateForumPost />} />
              <Route path="/forum/:topicId" element={<ForumTopicPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              
              {/* User profile and settings routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              
              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={<ProtectedRoute />}>
                <Route index element={<Navigate to="/dashboard/student" replace />} />
                
                {/* Role-specific dashboard pages */}
                <Route path="admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route index element={<AdminDashboard />} />
                </Route>
                
                <Route path="teacher" element={<ProtectedRoute allowedRoles={["teacher"]} />}>
                  <Route index element={<TeacherDashboard />} />
                </Route>
                
                <Route path="student" element={<ProtectedRoute allowedRoles={["student"]} />}>
                  <Route index element={<StudentDashboard />} />
                </Route>
                
                {/* Sprint 1 Routes - available to all authenticated users */}
                <Route path="profile" element={<ProfilePage />} />
                
                {/* Sprint 2 Routes */}
                <Route path="courses/manage" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                  <Route index element={<ManageCoursesPage />} />
                </Route>
                
                <Route path="courses/create" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                  <Route index element={<CreateCoursePage />} />
                </Route>

                <Route path="courses/edit/:id" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                  <Route index element={<CourseEditPage />} />
                </Route>

                <Route path="resources" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                  <Route index element={<ResourcesPage />} />
                </Route>

                <Route path="resources/manage" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                  <Route index element={<ManageResourcesPage />} />
                </Route>
                
                {/* Sprint 3 Routes */}
                <Route path="quizzes" element={<ProtectedRoute allowedRoles={["student"]} />}>
                  <Route index element={<QuizzesPage />} />
                </Route>

                <Route path="assignments" element={<ProtectedRoute allowedRoles={["student"]} />}>
                  <Route index element={<AssignmentsPage />} />
                </Route>
                
                <Route path="assignments/manage" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                  <Route index element={<TeacherAssignmentsPage />} />
                </Route>
                
                <Route path="quizzes/manage" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                  <Route index element={<ManageQuizzesPage />} />
                </Route>

                <Route path="quizzes/create" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                  <Route index element={<CreateQuizPage />} />
                </Route>
                
                <Route path="payments" element={<ProtectedRoute allowedRoles={["student"]} />}>
                  <Route index element={<PaymentsPage />} />
                </Route>
                
                <Route path="payments/monitor" element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route index element={<MonitorPaymentsPage />} />
                </Route>
                
                {/* Admin only routes */}
                <Route path="users/manage" element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route index element={<UserManagementPage />} />
                </Route>
                
                <Route path="forum/manage" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                  <Route index element={<ForumManagementPage />} />
                </Route>
                
                {/* Sprint 4 Routes - Chatbot available to all roles */}
                <Route path="chatbot" element={<ChatbotPage />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
