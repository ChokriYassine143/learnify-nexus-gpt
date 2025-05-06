
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

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";
  
  const sprintItems = [
    {
      sprint: "Sprint 1",
      title: "Gestion des Utilisateurs",
      items: [
        { name: "Authentification", path: "/dashboard/auth" },
        { name: "Gérer Profil", path: "/dashboard/profile" },
        ...(isAdmin ? [{ name: "Gérer Utilisateurs", path: "/dashboard/admin" }] : []),
      ],
      icon: <Users className="h-5 w-5" />
    },
    {
      sprint: "Sprint 2",
      title: "Gestion des Cours",
      items: [
        ...(isTeacher || isAdmin ? [{ name: "Gérer les Cours", path: "/dashboard/courses/manage" }] : []),
        { name: "Gérer les Ressources", path: "/dashboard/resources" },
        { name: "Accéder aux Cours", path: "/courses" },
      ],
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      sprint: "Sprint 3",
      title: "Quiz et Paiements",
      items: [
        ...(isTeacher || isAdmin ? [{ name: "Gérer Quiz/Devoirs", path: "/dashboard/quizzes/manage" }] : []),
        { name: "Passer Quiz/Devoirs", path: "/dashboard/quizzes" },
        { name: "Payer les Frais", path: "/dashboard/payments" },
        ...(isAdmin ? [{ name: "Surveiller Paiements", path: "/dashboard/payments/monitor" }] : []),
      ],
      icon: <FileText className="h-5 w-5" />
    },
    {
      sprint: "Sprint 4",
      title: "Forum et Chatbot",
      items: [
        { name: "Participer au Forum", path: "/forum" },
        { name: "Interagir avec le Chatbot", path: "/dashboard/chatbot" },
      ],
      icon: <MessageSquare className="h-5 w-5" />
    }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
            {sprintItems.map((sprintGroup, idx) => (
              <div key={idx} className={cn("mb-4", collapsed && "flex flex-col items-center")}>
                {!collapsed && <p className="text-xs font-bold uppercase tracking-wider text-gray-500 px-3 mb-1">
                  {sprintGroup.sprint}
                </p>}
                {collapsed && (
                  <div className="flex items-center justify-center p-2 mb-1">
                    {sprintGroup.icon}
                  </div>
                )}
                {!collapsed && (
                  <div className="space-y-1">
                    {sprintGroup.items.map((item, itemIdx) => (
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
                {collapsed && sprintGroup.items.map((item, itemIdx) => (
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
