
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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

// New pages
import AboutUs from "./pages/about/AboutUs";
import ContactUs from "./pages/contact/ContactUs";

// Placeholder pages for sprint routes
import ProfilePage from "./pages/dashboard/ProfilePage";
import ManageCoursesPage from "./pages/dashboard/courses/ManageCoursesPage";
import ResourcesPage from "./pages/dashboard/resources/ResourcesPage";
import QuizzesPage from "./pages/dashboard/quizzes/QuizzesPage";
import ManageQuizzesPage from "./pages/dashboard/quizzes/ManageQuizzesPage";
import PaymentsPage from "./pages/dashboard/payments/PaymentsPage";
import MonitorPaymentsPage from "./pages/dashboard/payments/MonitorPaymentsPage";
import ChatbotPage from "./pages/dashboard/ChatbotPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
            <Route path="/forum" element={<ForumIndex />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            
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
              
              <Route path="resources" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                <Route index element={<ResourcesPage />} />
              </Route>
              
              {/* Sprint 3 Routes */}
              <Route path="quizzes" element={<ProtectedRoute allowedRoles={["student"]} />}>
                <Route index element={<QuizzesPage />} />
              </Route>
              
              <Route path="quizzes/manage" element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                <Route index element={<ManageQuizzesPage />} />
              </Route>
              
              <Route path="payments" element={<ProtectedRoute allowedRoles={["student"]} />}>
                <Route index element={<PaymentsPage />} />
              </Route>
              
              <Route path="payments/monitor" element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route index element={<MonitorPaymentsPage />} />
              </Route>
              
              {/* Sprint 4 Routes - Chatbot available to all roles */}
              <Route path="chatbot" element={<ChatbotPage />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
