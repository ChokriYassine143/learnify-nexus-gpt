
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { 
  Users, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  GraduationCap 
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const userRole = user?.role || "student";
  
  // Check if the user has purchased courses (for payment menu visibility)
  const hasPurchasedCourses = user?.hasPurchasedCourses || false;

  return (
    <div className="container py-12">
      {/* Dashboard navigation menu */}
      <div className="mb-8">
        <NavigationMenu className="max-w-full w-full justify-start mb-10 bg-white rounded-lg shadow-sm border p-2">
          <NavigationMenuList className="flex-wrap gap-2">
            {/* Users Section */}
            {(userRole === "admin" || userRole === "teacher" || userRole === "student") && (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-learnup-blue3/20 text-learnup-blue1 hover:bg-learnup-blue3/40 focus:bg-learnup-blue3/40">
                  <Users className="mr-2 h-4 w-4" /> Utilisateurs
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[220px]">
                    <li>
                      <Link 
                        to="/dashboard/profile"
                        className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                      >
                        <span className="text-sm font-medium">Gérer Profil</span>
                      </Link>
                    </li>
                    {userRole === "admin" && (
                      <li>
                        <Link 
                          to="/dashboard/admin"
                          className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                        >
                          <span className="text-sm font-medium">Gérer Utilisateurs</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
            
            {/* Courses Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-learnup-blue3/20 text-learnup-blue1 hover:bg-learnup-blue3/40 focus:bg-learnup-blue3/40">
                <BookOpen className="mr-2 h-4 w-4" /> Cours
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[220px]">
                  {(userRole === "teacher" || userRole === "admin") && (
                    <>
                      <li>
                        <Link 
                          to="/dashboard/courses/manage"
                          className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                        >
                          <span className="text-sm font-medium">Gérer les Cours</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/resources"
                          className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                        >
                          <span className="text-sm font-medium">Gérer les Ressources</span>
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link 
                      to="/courses"
                      className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                    >
                      <span className="text-sm font-medium">Accéder aux Cours</span>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Quiz and Payments Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-learnup-blue3/20 text-learnup-blue1 hover:bg-learnup-blue3/40 focus:bg-learnup-blue3/40">
                <FileText className="mr-2 h-4 w-4" /> Quiz et Paiements
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[220px]">
                  {(userRole === "teacher" || userRole === "admin") && (
                    <li>
                      <Link 
                        to="/dashboard/quizzes/manage"
                        className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                      >
                        <span className="text-sm font-medium">Gérer Quiz/Devoirs</span>
                      </Link>
                    </li>
                  )}
                  {userRole === "student" && (
                    <li>
                      <Link 
                        to="/dashboard/quizzes"
                        className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                      >
                        <span className="text-sm font-medium">Passer Quiz/Devoirs</span>
                      </Link>
                    </li>
                  )}
                  {userRole === "student" && hasPurchasedCourses && (
                    <li>
                      <Link 
                        to="/dashboard/payments"
                        className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                      >
                        <span className="text-sm font-medium">Payer les Frais</span>
                      </Link>
                    </li>
                  )}
                  {userRole === "admin" && (
                    <li>
                      <Link 
                        to="/dashboard/payments/monitor"
                        className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                      >
                        <span className="text-sm font-medium">Surveiller Paiements</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Forums and Support Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-learnup-blue3/20 text-learnup-blue1 hover:bg-learnup-blue3/40 focus:bg-learnup-blue3/40">
                <MessageSquare className="mr-2 h-4 w-4" /> Forums et Assistance
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[220px]">
                  <li>
                    <Link 
                      to="/forum"
                      className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                    >
                      <span className="text-sm font-medium">Participer au Forum</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/dashboard/chatbot"
                      className="flex items-center p-2 hover:bg-learnup-blue3/20 rounded-md"
                    >
                      <span className="text-sm font-medium">Interagir avec le Chatbot</span>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-md border p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
