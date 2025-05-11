
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Book, LogIn } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect URL from the query string if it exists
  const params = new URLSearchParams(location.search);
  const redirectUrl = params.get("redirect") || "/dashboard";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const userData = await login(email, password);
      
      // After successful login, redirect based on user role
      let targetUrl = redirectUrl;
      
      // Only override if the redirect is the generic dashboard
      if (redirectUrl === "/dashboard" && userData?.role) {
        switch(userData.role) {
          case "admin":
            targetUrl = "/dashboard/admin";
            break;
          case "teacher":
            targetUrl = "/dashboard/teacher";
            break;
          case "student":
            targetUrl = "/dashboard/student";
            break;
        }
      }
      
      navigate(targetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Header />
      <main className="container py-12">
        <div className="mx-auto max-w-md space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto bg-primary-100 p-3 rounded-full">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-600">
              Enter your email and password to access your account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <LogIn className="mr-2 h-4 w-4" /> 
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
          
          {/* Quick login options for demo purposes */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 text-center mb-2">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEmail("student@example.com");
                  setPassword("password123");
                }}
              >
                Student
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEmail("teacher@example.com");
                  setPassword("password123");
                }}
              >
                Teacher
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEmail("admin@example.com");
                  setPassword("password123");
                }}
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
