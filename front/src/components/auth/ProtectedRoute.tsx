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

  // Determine the correct dashboard path based on user role
  const getRoleDashboard = (role: string) => {
    switch (role) {
      case "admin":
        return "/dashboard/admin";
      case "teacher":
        return "/dashboard/teacher";
      case "student":
        return "/dashboard/student";
      default:
        return "/dashboard";
    }
  };

  // If allowedRoles is specified, check if user's role is included
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const correctDashboard = getRoleDashboard(user.role);
    // Only redirect if we're not already on the correct dashboard
    if (location.pathname !== correctDashboard) {
      return <Navigate to={correctDashboard} replace />;
    }
  }

  // Check if user is on the correct dashboard for their role
  const currentPath = location.pathname;
  const correctDashboard = user ? getRoleDashboard(user.role) : "/dashboard";
  
  // Only redirect if we're on a different role's dashboard root
  if (
    (currentPath === "/dashboard/admin" && user?.role !== "admin") ||
    (currentPath === "/dashboard/teacher" && user?.role !== "teacher") ||
    (currentPath === "/dashboard/student" && user?.role !== "student")
  ) {
    return <Navigate to={correctDashboard} replace />;
  }
  
  // Allow the user to access the protected route
  return <Outlet />;
};

export default ProtectedRoute;
