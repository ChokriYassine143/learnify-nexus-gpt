
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Edit, LinkIcon, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for courses that can be linked to quizzes and assignments
const mockCourses = [
  {
    id: "c1",
    title: "Web Development Fundamentals",
  },
  {
    id: "c2",
    title: "JavaScript Essentials",
  },
  {
    id: "c3",
    title: "Backend Development",
  }
];

const mockQuizzes = [
  {
    id: "q1",
    title: "Quiz CSS Flexbox",
    courseTitle: "Web Development Fundamentals",
    courseId: "c1",
    questionsCount: 10,
    published: true,
    createdAt: "2023-09-12",
    linkedToModule: "Introduction to HTML"
  },
  {
    id: "q2",
    title: "Test JavaScript Basics",
    courseTitle: "JavaScript Essentials",
    courseId: "c2",
    questionsCount: 15,
    published: true,
    createdAt: "2023-10-05",
    linkedToModule: "JavaScript Basics"
  }
];

const mockAssignments = [
  {
    id: "a1",
    title: "Projet Portfolio",
    courseTitle: "Web Development Fundamentals",
    courseId: "c1",
    dueDate: "2023-12-15",
    submissions: 12,
    createdAt: "2023-09-01",
    linkedToModule: "CSS Fundamentals"
  },
  {
    id: "a2",
    title: "Créer une API REST",
    courseTitle: "Backend Development",
    courseId: "c3",
    dueDate: "2023-11-30",
    submissions: 8,
    createdAt: "2023-09-15",
    linkedToModule: "JavaScript Basics"
  }
];

// Mock resources that can be linked to courses and modules
const mockResources = [
  {
    id: "r1",
    title: "Guide CSS Layout",
    type: "PDF",
    courseId: "c1",
    moduleId: "m1",
    size: "1.2 MB"
  },
  {
    id: "r2",
    title: "JavaScript Cheatsheet",
    type: "PDF",
    courseId: "c2",
    moduleId: "m1",
    size: "0.8 MB"
  }
];

const ManageQuizzesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("quizzes");
  
  // Filter items based on selected course
  const filteredQuizzes = selectedCourse 
    ? mockQuizzes.filter(quiz => quiz.courseId === selectedCourse)
    : mockQuizzes;
    
  const filteredAssignments = selectedCourse
    ? mockAssignments.filter(assignment => assignment.courseId === selectedCourse)
    : mockAssignments;
    
  const filteredResources = selectedCourse
    ? mockResources.filter(resource => resource.courseId === selectedCourse)
    : mockResources;
  
  const handleCreateQuiz = () => {
    navigate('/dashboard/quizzes/create');
  };
  
  const handleCreateAssignment = () => {
    // In a real app, this would navigate to an assignment creation page
    navigate('/dashboard/quizzes/create');
  };
  
  const handleEditQuiz = (quizId: string) => {
    navigate(`/dashboard/quizzes/edit/${quizId}`);
  };
  
  const handleLinkResource = (resourceId: string) => {
    toast({
      title: "Ressource liée",
      description: "La ressource a été associée au cours avec succès",
    });
  };
  
  const handleViewInCourse = (courseId: string, itemType: string, itemId: string) => {
    // Navigate to the course learning page where this item would be displayed
    navigate(`/course/${courseId}/learn`);
    toast({
      title: "Navigation",
      description: `Affichage du ${itemType} dans le contexte du cours`,
    });
  };
  
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Quiz et Devoirs</h1>
            <p className="text-gray-600 mt-2">Créez et gérez les évaluations</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleCreateQuiz}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un Quiz
            </Button>
            <Button variant="outline" onClick={handleCreateAssignment}>
              <FileText className="mr-2 h-4 w-4" />
              Créer un Devoir
            </Button>
          </div>
        </div>
        
        {/* Course filter */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-72">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par cours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les cours</SelectItem>
                  {mockCourses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCourse && (
              <Button 
                variant="outline" 
                onClick={() => navigate(`/course/${selectedCourse}/learn`)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Voir le cours
              </Button>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="quizzes">Quiz</TabsTrigger>
            <TabsTrigger value="assignments">Devoirs</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quizzes">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Mes Quiz</CardTitle>
                <CardDescription>Quiz que vous avez créés</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredQuizzes.length > 0 ? (
                  <div className="divide-y">
                    {filteredQuizzes.map(quiz => (
                      <div key={quiz.id} className="py-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{quiz.title}</h3>
                          <p className="text-sm text-gray-500">
                            {quiz.courseTitle} • {quiz.questionsCount} questions
                            {quiz.linkedToModule && (
                              <span> • Module: {quiz.linkedToModule}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewInCourse(quiz.courseId, "quiz", quiz.id)}
                          >
                            <BookOpen className="h-4 w-4 mr-1" /> Voir dans le cours
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditQuiz(quiz.id)}>
                            <Edit className="h-4 w-4 mr-1" /> Modifier
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    {selectedCourse 
                      ? "Aucun quiz trouvé pour ce cours" 
                      : "Vous n'avez pas encore créé de quiz"}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assignments">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Mes Devoirs</CardTitle>
                <CardDescription>Devoirs que vous avez assignés</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAssignments.length > 0 ? (
                  <div className="divide-y">
                    {filteredAssignments.map(assignment => (
                      <div key={assignment.id} className="py-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <p className="text-sm text-gray-500">
                            {assignment.courseTitle} • Échéance: {assignment.dueDate} • {assignment.submissions} soumissions
                            {assignment.linkedToModule && (
                              <span> • Module: {assignment.linkedToModule}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewInCourse(assignment.courseId, "devoir", assignment.id)}
                          >
                            <BookOpen className="h-4 w-4 mr-1" /> Voir dans le cours
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" /> Modifier
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    {selectedCourse 
                      ? "Aucun devoir trouvé pour ce cours" 
                      : "Vous n'avez pas encore créé de devoirs"}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Ressources associées</CardTitle>
                <CardDescription>Ressources liées aux cours</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredResources.length > 0 ? (
                  <div className="divide-y">
                    {filteredResources.map(resource => (
                      <div key={resource.id} className="py-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-gray-500">
                            Type: {resource.type} • Taille: {resource.size}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewInCourse(resource.courseId, "ressource", resource.id)}
                          >
                            <BookOpen className="h-4 w-4 mr-1" /> Voir dans le cours
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleLinkResource(resource.id)}
                          >
                            <LinkIcon className="h-4 w-4 mr-1" /> Lier à un module
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    {selectedCourse 
                      ? "Aucune ressource trouvée pour ce cours" 
                      : "Vous n'avez pas encore ajouté de ressources"}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ManageQuizzesPage;

