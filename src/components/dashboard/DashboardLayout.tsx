
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  GraduationCap 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const userRole = user?.role || "student";
  
  // Check if the user has purchased courses (for payment menu visibility)
  const hasPurchasedCourses = user?.hasPurchasedCourses || false;

  // Navigation items based on role
  const navigationItems = [
    // Users/Profile section - visible to all roles
    {
      title: "Profile",
      icon: <Users className="mr-2 h-5 w-5" />,
      items: [
        {
          label: "Manage Profile",
          link: "/dashboard/profile",
          roles: ["admin", "teacher", "student"]
        },
        {
          label: "Manage Users",
          link: "/dashboard/admin",
          roles: ["admin"]
        }
      ]
    },
    // Courses section
    {
      title: "Courses",
      icon: <BookOpen className="mr-2 h-5 w-5" />,
      items: [
        {
          label: "Manage Courses",
          link: "/dashboard/courses/manage",
          roles: ["admin", "teacher"]
        },
        {
          label: "Manage Resources",
          link: "/dashboard/resources",
          roles: ["admin", "teacher"]
        },
        {
          label: "Access Courses",
          link: "/courses",
          roles: ["admin", "teacher", "student"]
        }
      ]
    },
    // Quiz and Payments section
    {
      title: "Quiz & Payments",
      icon: <FileText className="mr-2 h-5 w-5" />,
      items: [
        {
          label: "Manage Quizzes",
          link: "/dashboard/quizzes/manage",
          roles: ["admin", "teacher"]
        },
        {
          label: "Take Quizzes",
          link: "/dashboard/quizzes",
          roles: ["student"]
        },
        {
          label: "Make Payments",
          link: "/dashboard/payments",
          roles: ["student"]
        },
        {
          label: "Monitor Payments",
          link: "/dashboard/payments/monitor",
          roles: ["admin"]
        }
      ]
    },
    // Forum and Support section
    {
      title: "Support",
      icon: <MessageSquare className="mr-2 h-5 w-5" />,
      items: [
        {
          label: "Forum",
          link: "/forum",
          roles: ["admin", "teacher", "student"]
        },
        {
          label: "Chatbot",
          link: "/dashboard/chatbot",
          roles: ["admin", "teacher", "student"]
        }
      ]
    }
  ];

  return (
    <div className="container py-12">
      {/* Dashboard header with navigation */}
      <div className="mb-8 bg-white rounded-xl shadow-md border p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/b14b8995-4cec-4fca-af8c-857f1e9e3699.png"
              alt="LearnUp Logo"
              className="h-12 w-auto mr-4"
            />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 bg-clip-text text-transparent">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
            </h2>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3/20"
            >
              Return to Home
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-wrap gap-3">
          {navigationItems.map((category, index) => (
            <div key={index} className="relative group">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3/20 transition-all"
              >
                {category.icon}
                {category.title}
              </Button>
              
              {/* Dropdown menu */}
              <div className="absolute left-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
                <div className="py-1">
                  {category.items
                    .filter(item => item.roles.includes(userRole))
                    .map((item, itemIndex) => (
                      <Link 
                        key={itemIndex} 
                        to={item.link}
                        className="flex px-4 py-2 text-sm text-gray-700 hover:bg-learnup-blue3/20 hover:text-learnup-blue1 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
