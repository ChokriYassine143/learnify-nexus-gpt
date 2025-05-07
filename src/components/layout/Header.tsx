
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogIn, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    
    switch(user.role) {
      case "admin":
        return "/dashboard/admin";
      case "teacher":
        return "/dashboard/teacher";
      default:
        return "/dashboard/student";
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/lovable-uploads/b14b8995-4cec-4fca-af8c-857f1e9e3699.png"
              alt="LearnUp Logo"
              className="h-9 w-auto"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 bg-clip-text text-transparent">LearnUp</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 nav-link-main">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dropdown-content">
                <DropdownMenuItem className="dropdown-item">
                  <Link to="/courses/web-development" className="w-full">Web Development</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dropdown-item">
                  <Link to="/courses/data-science" className="w-full">Data Science</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dropdown-item">
                  <Link to="/courses/mobile-apps" className="w-full">Mobile Apps</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dropdown-item">
                  <Link to="/courses/graphic-design" className="w-full">Graphic Design</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/courses" className="nav-link-main">
              All Courses
            </Link>
            
            <Link to="/forum" className="nav-link-main">
              Forum
            </Link>
            
            <Link to="/about" className="nav-link-main">
              About Us
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search courses..."
              className="h-10 w-64 rounded-md border border-gray-200 bg-gray-50 pl-8 text-sm focus:border-learnup-blue2 focus:ring-1 focus:ring-learnup-blue3 transition-all"
            />
          </div>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-learnup-blue3 text-learnup-blue1 hover:bg-learnup-blue3/20 hover:text-learnup-blue4">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dropdown-content">
                <DropdownMenuItem asChild className="dropdown-item">
                  <Link to={getDashboardLink()} className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="dropdown-item">
                  <Link to="/profile" className="w-full">My Profile</Link>
                </DropdownMenuItem>
                {user?.role === "teacher" && (
                  <DropdownMenuItem asChild className="dropdown-item">
                    <Link to="/dashboard/courses/manage" className="w-full">My Courses</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild className="dropdown-item">
                    <Link to="/dashboard/admin" className="w-full">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="dropdown-item">
                  <Link to="/settings" className="w-full">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="dropdown-item text-red-600 hover:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" className="text-learnup-blue1 border-learnup-blue3 hover:bg-learnup-blue3/20 hover:text-learnup-blue4" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              
              <Button className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 text-white" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search courses..."
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 text-sm"
            />
          </div>
          <nav className="flex flex-col space-y-2">
            <Link to="/courses" className="nav-link">
              All Courses
            </Link>
            <Link to="/courses/web-development" className="nav-link">
              Web Development
            </Link>
            <Link to="/courses/data-science" className="nav-link">
              Data Science
            </Link>
            <Link to="/courses/mobile-apps" className="nav-link">
              Mobile Apps
            </Link>
            <Link to="/courses/graphic-design" className="nav-link">
              Graphic Design
            </Link>
            <Link to="/forum" className="nav-link">
              Forum
            </Link>
            <Link to="/about" className="nav-link">
              About Us
            </Link>
            
            {isAuthenticated && (
              <>
                <div className="border-t my-2 pt-2">
                  <Link to={getDashboardLink()} className="nav-link font-medium">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="nav-link">
                    My Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center text-left px-2 py-1 text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
