
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Clock, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockQuizzes = [
  {
    id: "q1",
    title: "Quiz CSS Flexbox",
    courseTitle: "Web Development Fundamentals",
    dueDate: "2023-12-10",
    timeLimit: 30,
    questionsCount: 10
  },
  {
    id: "q2",
    title: "Test JavaScript Basics",
    courseTitle: "JavaScript Essentials",
    dueDate: "2023-11-30",
    timeLimit: 45,
    questionsCount: 15
  }
];

const mockAssignments = [
  {
    id: "a1",
    title: "Projet Portfolio",
    courseTitle: "Web Development Fundamentals",
    dueDate: "2023-12-15",
    status: "non-soumis"
  },
  {
    id: "a2",
    title: "Créer une API REST",
    courseTitle: "Backend Development",
    dueDate: "2023-11-30",
    status: "en-cours"
  }
];

const QuizzesPage: React.FC = () => {
  const navigate = useNavigate();

  const startQuiz = (quizId: string) => {
    navigate(`/course/1/learn/${quizId}`);
  };

  const viewAssignment = (assignmentId: string) => {
    navigate(`/dashboard/assignments`);
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mes Quiz et Devoirs</h1>
          <p className="text-gray-600 mt-2">Accédez et complétez vos quiz et devoirs</p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quiz à Compléter</CardTitle>
            <CardDescription>Quiz assignés que vous devez compléter</CardDescription>
          </CardHeader>
          <CardContent>
            {mockQuizzes.length > 0 ? (
              <div className="space-y-4">
                {mockQuizzes.map(quiz => (
                  <div key={quiz.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{quiz.title}</h3>
                        <p className="text-sm text-gray-500">{quiz.courseTitle}</p>
                      </div>
                      <Button onClick={() => startQuiz(quiz.id)}>
                        Commencer <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex text-sm text-gray-500 mt-2 gap-x-6">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" /> {quiz.timeLimit} minutes
                      </span>
                      <span className="flex items-center">
                        <FileText className="mr-1 h-4 w-4" /> {quiz.questionsCount} questions
                      </span>
                      <span>Date limite: {quiz.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">
                Vous n'avez pas de quiz à compléter pour le moment
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Devoirs à Soumettre</CardTitle>
            <CardDescription>Devoirs en attente de soumission</CardDescription>
          </CardHeader>
          <CardContent>
            {mockAssignments.length > 0 ? (
              <div className="space-y-4">
                {mockAssignments.map(assignment => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-gray-500">{assignment.courseTitle}</p>
                      </div>
                      <Button variant="outline" onClick={() => viewAssignment(assignment.id)}>
                        Voir le devoir <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex text-sm text-gray-500 mt-2 gap-x-6">
                      <span>Date limite: {assignment.dueDate}</span>
                      <span className={`${
                        assignment.status === 'non-soumis' ? 'text-red-500' : 'text-amber-500'
                      }`}>
                        Statut: {assignment.status === 'non-soumis' ? 'Non soumis' : 'En cours'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">
                Vous n'avez pas de devoirs à soumettre pour le moment
              </p>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default QuizzesPage;
