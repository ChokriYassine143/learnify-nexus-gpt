
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Users, BookOpen, FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  name: string;
  path: string;
  roles: Array<"admin" | "teacher" | "student">;
  condition?: () => boolean;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
  icon: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userRole = user?.role || "student";
  
  // Simulate a condition where a student has purchased a course
  // In a real app, this would check if the user has any purchased courses
  const hasPurchasedCourses = () => {
    // This is a placeholder. In a real app, you'd check the user's purchased courses
    return user?.hasPurchasedCourses || false;
  };
  
  const navigationItems: SidebarGroup[] = [
    {
      title: "Utilisateurs",
      items: [
        { name: "Authentification", path: "/dashboard/auth", roles: ["student", "teacher", "admin"] },
        { name: "Gérer Profil", path: "/dashboard/profile", roles: ["student", "teacher", "admin"] },
        { name: "Gérer Utilisateurs", path: "/dashboard/admin", roles: ["admin"] },
      ],
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Cours",
      items: [
        { name: "Gérer les Cours", path: "/dashboard/courses/manage", roles: ["teacher", "admin"] },
        { name: "Gérer les Ressources", path: "/dashboard/resources", roles: ["teacher", "admin"] },
        { name: "Accéder aux Cours", path: "/courses", roles: ["student", "teacher", "admin"] },
      ],
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Quiz et Paiements",
      items: [
        { name: "Gérer Quiz/Devoirs", path: "/dashboard/quizzes/manage", roles: ["teacher", "admin"] },
        { name: "Passer Quiz/Devoirs", path: "/dashboard/quizzes", roles: ["student"] },
        { 
          name: "Payer les Frais", 
          path: "/dashboard/payments", 
          roles: ["student"],
          condition: hasPurchasedCourses
        },
        { name: "Surveiller Paiements", path: "/dashboard/payments/monitor", roles: ["admin"] },
      ],
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Forums et Assistance",
      items: [
        { name: "Participer au Forum", path: "/forum", roles: ["student", "teacher", "admin"] },
        { name: "Interagir avec le Chatbot", path: "/dashboard/chatbot", roles: ["student", "teacher", "admin"] },
      ],
      icon: <MessageSquare className="h-5 w-5" />
    }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Filter sidebar groups to only show items relevant to the current user's role
  // Also apply any conditional logic for showing/hiding menu items
  const filteredSidebarItems = navigationItems.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const hasRole = item.roles.includes(userRole as "admin" | "teacher" | "student");
      const passesCondition = item.condition !== undefined ? item.condition() : true;
      return hasRole && passesCondition;
    })
  })).filter(group => group.items.length > 0); // Only show groups that have at least one item

  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-white border rounded-lg shadow-sm transition-all duration-300 h-fit sticky top-24",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <div className="p-4 flex justify-between items-center">
            {!collapsed && <h3 className="font-semibold">Dashboard</h3>}
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </div>
          
          <Separator />
          
          <div className="p-2">
            {filteredSidebarItems.map((navGroup, idx) => (
              <div key={idx} className={cn("mb-4", collapsed && "flex flex-col items-center")}>
                {!collapsed && <p className="text-xs font-bold uppercase tracking-wider text-gray-500 px-3 mb-1">
                  {navGroup.title}
                </p>}
                {collapsed && (
                  <div className="flex items-center justify-center p-2 mb-1">
                    {navGroup.icon}
                  </div>
                )}
                {!collapsed && (
                  <div className="space-y-1">
                    {navGroup.items.map((item, itemIdx) => (
                      <Button
                        key={itemIdx}
                        variant={isActive(item.path) ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left",
                          isActive(item.path) ? "bg-secondary/50" : ""
                        )}
                        onClick={() => navigate(item.path)}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>
                )}
                {collapsed && navGroup.items.map((item, itemIdx) => (
                  <Button
                    key={itemIdx}
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    size="sm"
                    className="w-10 h-10 p-0 mb-1"
                    title={item.name}
                    onClick={() => navigate(item.path)}
                  >
                    {item.name.charAt(0)}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
