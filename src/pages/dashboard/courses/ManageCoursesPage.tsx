
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, LayoutGrid, List, Edit, Trash2, Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Sample course data
const sampleCourses = [
  {
    id: "1",
    title: "Introduction à la Programmation",
    description: "Cours de base pour les débutants en programmation",
    lessons: 9,
    modules: 2,
    students: 12,
    image: null
  },
  {
    id: "2",
    title: "Web Development Fundamentals",
    description: "HTML, CSS, and JavaScript basics",
    lessons: 12,
    modules: 3,
    students: 24,
    image: null
  },
  {
    id: "3",
    title: "Data Science Principles",
    description: "Introduction to data analysis and visualization",
    lessons: 8,
    modules: 2,
    students: 18,
    image: null
  }
];

const ManageCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState(sampleCourses);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateCourse = () => {
    navigate("/dashboard/courses/create");
  };
  
  const handleEditCourse = (courseId: string) => {
    navigate(`/dashboard/courses/edit/${courseId}`);
  };
  
  const confirmDelete = (courseId: string) => {
    setSelectedCourseId(courseId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteCourse = () => {
    if (selectedCourseId) {
      setCourses(courses.filter(course => course.id !== selectedCourseId));
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès."
      });
      setDeleteDialogOpen(false);
      setSelectedCourseId(null);
    }
  };
  
  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
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
          <Button 
            className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 transition-all"
            onClick={handleCreateCourse}
          >
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrer</span>
            </Button>
            <div className="flex rounded-md border">
              <Button 
                variant={viewType === "grid" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-r-none border-r"
                onClick={() => setViewType("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewType === "list" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-l-none"
                onClick={() => setViewType("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {filteredCourses.length === 0 ? (
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
                <Button 
                  className="bg-gradient-to-r from-learnup-blue1 to-learnup-blue2 hover:from-learnup-blue4 hover:to-learnup-blue1 transition-all"
                  onClick={handleCreateCourse}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un Nouveau Cours
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all group border shadow-md">
                  <div className="h-40 bg-gradient-to-r from-learnup-blue3 to-learnup-blue2 flex items-center justify-center text-white">
                    <BookIcon className="h-16 w-16" />
                  </div>
                  <CardHeader className="p-4 pb-2 pt-3">
                    <CardTitle className="text-lg group-hover:text-learnup-blue1 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <span>{course.lessons} leçons</span>
                      <span>•</span>
                      <span>{course.modules} modules</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-learnup-blue4">
                        {course.students} étudiants inscrits
                      </span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="p-1" 
                          onClick={() => handleViewCourse(course.id)}
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="p-1" 
                          onClick={() => handleEditCourse(course.id)}
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="p-1" 
                            onClick={() => confirmDelete(course.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-sm transition-all border">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-16 h-16 sm:h-auto bg-gradient-to-r from-learnup-blue3 to-learnup-blue2 flex items-center justify-center text-white">
                      <BookIcon className="h-8 w-8" />
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                          <h3 className="font-medium text-lg">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                        </div>
                        <div className="flex mt-3 sm:mt-0 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewCourse(course.id)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Voir
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditCourse(course.id)}
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Modifier
                          </Button>
                          {isAdmin && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-200 text-red-500 hover:bg-red-50"
                              onClick={() => confirmDelete(course.id)}
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>{course.lessons} leçons</span>
                        <span className="mx-2">•</span>
                        <span>{course.modules} modules</span>
                        <span className="mx-2">•</span>
                        <span>{course.students} étudiants</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        )}
        
        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteCourse}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
