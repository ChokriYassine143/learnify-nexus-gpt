
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, ChevronDown, LogIn, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
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
            <Book className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LearnifyNexus</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/courses/web-development">Web Development</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/courses/data-science">Data Science</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/courses/mobile-apps">Mobile Apps</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/courses/graphic-design">Graphic Design</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/courses" className="nav-link">
              All Courses
            </Link>
            
            <Link to="/forum" className="nav-link">
              Forum
            </Link>
            
            <Link to="/about" className="nav-link">
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
              className="h-10 w-64 rounded-md border border-gray-200 bg-gray-50 pl-8 text-sm"
            />
          </div>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                {user?.role === "teacher" && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/teacher">My Courses</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              
              <Button asChild>
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
