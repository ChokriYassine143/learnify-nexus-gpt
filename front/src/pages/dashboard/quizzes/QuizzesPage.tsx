import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Clock, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { quizService } from "@/services/quizService";
import { Quiz } from "@/types";
import { useToast } from "@/hooks/use-toast";

const QuizzesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadQuizzes = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const loadedQuizzes = await quizService.getAllQuizzes();
        setQuizzes(loadedQuizzes);
      } catch (error) {
        console.error("Error loading quizzes:", error);
        toast({
          title: "Error",
          description: "Failed to load quizzes. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizzes();
  }, [user]);

  const startQuiz = (quizId: string) => {
    navigate(`/dashboard/quizzes/${quizId}`);
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p>Loading quizzes...</p>
            ) : quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Card key={quiz.id || quiz._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.timeLimit} minutes</span>
                      </div>
                      {user?.role === 'teacher' ? (
                        <Button onClick={() => navigate(`/dashboard/quizzes/${quiz.id}/edit`)}>
                          Modify Quiz <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button onClick={() => startQuiz(quiz.id)}>
                          Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No quizzes found.</p>
            )}
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default QuizzesPage;
