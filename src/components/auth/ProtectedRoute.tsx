
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface RoleBasedRouteProps {
  allowedRoles?: Array<"student" | "teacher" | "admin">;
}

const ProtectedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  
  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // If allowedRoles is specified, check if user's role is included
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    let redirectPath = "/dashboard/student";
    if (user.role === "teacher") {
      redirectPath = "/dashboard/teacher";
    } else if (user.role === "admin") {
      redirectPath = "/dashboard/admin";
    }
    
    return <Navigate to={redirectPath} replace />;
  }
  
  // Check if user is on the right dashboard based on their role
  const path = location.pathname;
  
  if (path === "/dashboard/admin" && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (path === "/dashboard/teacher" && user?.role !== "teacher") {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (path === "/dashboard/student" && user?.role !== "student" && user?.role !== undefined) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Allow the user to access the protected route
  return <Outlet />;
};

export default ProtectedRoute;
