
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Edit } from "lucide-react";

const mockQuizzes = [
  {
    id: "q1",
    title: "Quiz CSS Flexbox",
    courseTitle: "Web Development Fundamentals",
    questionsCount: 10,
    published: true,
    createdAt: "2023-09-12"
  },
  {
    id: "q2",
    title: "Test JavaScript Basics",
    courseTitle: "JavaScript Essentials",
    questionsCount: 15,
    published: true,
    createdAt: "2023-10-05"
  }
];

const mockAssignments = [
  {
    id: "a1",
    title: "Projet Portfolio",
    courseTitle: "Web Development Fundamentals",
    dueDate: "2023-12-15",
    submissions: 12,
    createdAt: "2023-09-01"
  },
  {
    id: "a2",
    title: "Créer une API REST",
    courseTitle: "Backend Development",
    dueDate: "2023-11-30",
    submissions: 8,
    createdAt: "2023-09-15"
  }
];

const ManageQuizzesPage: React.FC = () => {
  const navigate = useNavigate();
  
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
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mes Quiz</CardTitle>
            <CardDescription>Quiz que vous avez créés</CardDescription>
          </CardHeader>
          <CardContent>
            {mockQuizzes.length > 0 ? (
              <div className="divide-y">
                {mockQuizzes.map(quiz => (
                  <div key={quiz.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{quiz.title}</h3>
                      <p className="text-sm text-gray-500">{quiz.courseTitle} • {quiz.questionsCount} questions</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditQuiz(quiz.id)}>
                        <Edit className="h-4 w-4 mr-1" /> Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">
                Vous n'avez pas encore créé de quiz
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mes Devoirs</CardTitle>
            <CardDescription>Devoirs que vous avez assignés</CardDescription>
          </CardHeader>
          <CardContent>
            {mockAssignments.length > 0 ? (
              <div className="divide-y">
                {mockAssignments.map(assignment => (
                  <div key={assignment.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{assignment.title}</h3>
                      <p className="text-sm text-gray-500">
                        {assignment.courseTitle} • Échéance: {assignment.dueDate} • {assignment.submissions} soumissions
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">
                Vous n'avez pas encore créé de devoirs
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
