import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Edit, LinkIcon, BookOpen, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { quizService } from "@/services/quizService";
import { courseService } from "@/services/courseService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const ManageQuizzesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("quizzes");
  const [isLoading, setIsLoading] = useState(false);
  
  // State
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    courseId: "",
    moduleId: "",
    lessonId: "",
    dueDate: "",
    points: 100,
  });
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedCourses, loadedQuizzes] = await Promise.all([
          courseService.getAllCourses(),
          quizService.getAllQuizzes()
        ]);
        setCourses(loadedCourses);
        setQuizzes(loadedQuizzes);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load courses and quizzes",
          variant: "destructive"
        });
      }
    };
    loadData();
  }, []);

  // Defensive array check
  const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];
  const filteredQuizzes = selectedCourse && selectedCourse !== "all"
    ? safeQuizzes.filter(quiz => quiz.courseId === selectedCourse)
    : safeQuizzes;
  
  const handleCreateQuiz = () => {
    navigate('/dashboard/quizzes/create');
  };
  
  const handleEditQuiz = (quizId: string) => {
    navigate(`/dashboard/quizzes/edit/${quizId}`);
  };
  
  const handleViewInCourse = (courseId: string) => {
    navigate(`/course/${courseId}/learn`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!quizId) {
      console.error("Quiz ID is undefined!");
      return;
    }
    setIsLoading(true);
    try {
      await quizService.deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(q => q._id !== quizId));
      toast({ 
        title: "Quiz supprimé", 
        description: "Le quiz a été supprimé avec succès." 
      });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast({
        title: "Error",
        description: "Failed to delete quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Quiz</h1>
            <p className="text-gray-600 mt-2">Créez et gérez les quiz</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleCreateQuiz}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un Quiz
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
                  <SelectItem value="all">Tous les cours</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mes Quiz</CardTitle>
            <CardDescription>Quiz que vous avez créés</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredQuizzes.length > 0 ? (
              <div className="divide-y">
                {filteredQuizzes.map(quiz => {
                  const course = courses.find(c => c.id === quiz.courseId);
                  const isOwner = user && course && course.instructor === user.id;
                  return (
                    <div key={quiz.id || quiz._id} className="py-4 flex items-center justify-between">
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
                        {isOwner && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewInCourse(quiz.courseId)}
                          >
                            <BookOpen className="h-4 w-4 mr-1" /> Voir dans le cours
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleEditQuiz(quiz._id)}>
                          <Edit className="h-4 w-4 mr-1" /> Modifier
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteQuiz(quiz._id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  );
                })}
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
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ManageQuizzesPage;
