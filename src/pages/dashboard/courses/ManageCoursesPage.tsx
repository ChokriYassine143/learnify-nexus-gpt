
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const ManageCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-learnup-blue1 to-learnup-blue4 bg-clip-text text-transparent">
              Gestion des Cours
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdmin ? "Gérez tous les cours sur la plateforme" : "Créez et gérez vos cours"}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Créer un Nouveau Cours
          </Button>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Rechercher des cours..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-learnup-blue2"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrer</span>
            </Button>
            <div className="flex rounded-md border">
              <Button variant="ghost" size="sm" className="rounded-r-none border-r">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-l-none">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Card className="mb-8 overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 text-white">
            <CardTitle>Mes Cours</CardTitle>
            <CardDescription className="text-white/90">
              {isAdmin ? "Liste de tous les cours actifs" : "Liste de vos cours actifs"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-learnup-blue3 rounded-full p-4 mb-4">
                <BookIcon className="h-8 w-8 text-learnup-blue1" />
              </div>
              <h3 className="text-lg font-medium mb-2">Aucun cours trouvé</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Vous n'avez pas encore de cours. Commencez par créer un nouveau cours pour partager votre expertise.
              </p>
              <Button className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 transition-all">
                <Plus className="mr-2 h-4 w-4" />
                Créer un Nouveau Cours
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* These would be populated from real data */}
          {/* Example course card for visual purposes */}
          <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group border-none shadow-md">
            <div className="h-40 bg-gradient-to-r from-learnup-blue3 to-learnup-blue2 flex items-center justify-center text-white">
              <BookIcon className="h-16 w-16" />
            </div>
            <CardHeader className="p-4 pb-2 pt-3">
              <CardTitle className="text-lg group-hover:text-learnup-blue1 transition-colors">
                Introduction à la Programmation
              </CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm">
                <span>9 leçons</span>
                <span>•</span>
                <span>2 modules</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-learnup-blue4">
                  12 étudiants inscrits
                </span>
                <Button variant="outline" size="sm" className="border-learnup-blue2 text-learnup-blue1 hover:bg-learnup-blue3/20">
                  Gérer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
};

// Custom Book icon component
const BookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export default ManageCoursesPage;
