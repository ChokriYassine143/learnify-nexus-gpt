import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { QuizQuestion } from "@/types/index";
import { useAuth } from "@/contexts/AuthContext";

interface QuizComponentProps {
  quiz: {
    title: string;
    description: string;
    questions: QuizQuestion[];
    id: string;
  };
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz }) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    if (user && quiz && quiz.id) {
      const key = `quizResult_${user.id}_${quiz.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setLastResult(JSON.parse(saved));
      }
    }
  }, [user, quiz]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div>Aucun quiz à afficher.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  const handleAnswerChange = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      // Save result to localStorage
      if (user && quiz && quiz.id) {
        const score = calculateScore();
        const result = {
          userId: user.id,
          quizId: quiz.id,
          date: new Date().toISOString(),
          answers: selectedAnswers,
          score: score.score,
          total: score.total,
          percentage: score.percentage
        };
        localStorage.setItem(`quizResult_${user.id}_${quiz.id}`, JSON.stringify(result));
        setLastResult(result);
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      const questionId = question.id || `q${index}`;
      const correctAnswer = Array.isArray(question.correctAnswer)
        ? question.correctAnswer[0]
        : question.correctAnswer;
      const userAnswer = selectedAnswers[questionId];
      
      // Compare answers case-insensitively and trim whitespace
      if (userAnswer && correctAnswer && 
          userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
        correctAnswers++;
      }
    });
    return {
      score: correctAnswers,
      total: quiz.questions.length,
      percentage: Math.round((correctAnswers / quiz.questions.length) * 100)
    };
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setLastResult(null);
  };
  
  const getQuestionId = (question: QuizQuestion, index: number) => {
    return question.id || `q${index}`;
  };
  
  const currentQuestionId = getQuestionId(currentQuestion, currentQuestionIndex);
  const isAnswered = !!selectedAnswers[currentQuestionId];
  const score = calculateScore();
  
  // Show last result before starting a new attempt
  if (!showResults && lastResult) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Dernier résultat du Quiz</h2>
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
              <span className="text-2xl font-bold text-primary">{lastResult.percentage}%</span>
            </div>
            <p className="text-lg">
              Vous avez obtenu <strong>{lastResult.score}</strong> sur <strong>{lastResult.total}</strong> questions
            </p>
            <p className="text-sm text-gray-500 mt-2">Date: {new Date(lastResult.date).toLocaleString()}</p>
          </div>
          <div className="mt-8 flex justify-center">
            <Button onClick={resetQuiz}>Reprendre le quiz</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (showResults) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Résultats du Quiz</h2>
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
              <span className="text-2xl font-bold text-primary">{score.percentage}%</span>
            </div>
            
            <p className="text-lg">
              Vous avez obtenu <strong>{score.score}</strong> sur <strong>{score.total}</strong> questions
            </p>
            
            {score.percentage >= 80 ? (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Félicitations ! Vous avez réussi ce quiz.</span>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                <span>Vous n'avez pas atteint le score minimum requis (80%).</span>
              </div>
            )}
          </div>
          
          <h3 className="font-semibold mt-8 mb-4">Révision des questions</h3>
          
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const questionId = getQuestionId(question, index);
              const correctAnswer = Array.isArray(question.correctAnswer)
                ? question.correctAnswer[0]
                : question.correctAnswer;
              const userAnswer = selectedAnswers[questionId];
              const isCorrect = userAnswer && correctAnswer && 
                userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
              
              return (
                <div key={`question-${questionId}`} className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="font-medium mb-2">
                    {index + 1}. {question.question}
                  </p>
                  <div className="ml-4">
                    <div className="flex items-start">
                      <div className="mr-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p>Votre réponse: {userAnswer || "Aucune réponse"}</p>
                        {!isCorrect && (
                          <p className="text-green-700 mt-1">Réponse correcte: {correctAnswer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button onClick={resetQuiz}>Recommencer le quiz</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Question {currentQuestionIndex + 1} sur {quiz.questions.length}
          </h3>
          <div className="text-sm text-gray-500">
            {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% terminé
          </div>
        </div>
        
        <div className="mb-8">
          <h4 className="text-lg mb-4">{currentQuestion.question}</h4>
          
          <RadioGroup
            value={selectedAnswers[currentQuestionId] || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestionId, value)}
          >
            <div className="space-y-3">
              {(currentQuestion.options || []).map((option, idx) => {
                const optionKey = `${currentQuestionId}-option-${idx}`;
                const optionValue = typeof option === 'object' ? option.text : option;
                return (
                  <div key={optionKey} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                    <RadioGroupItem value={optionValue} id={optionKey} />
                    <Label htmlFor={optionKey} className="flex-grow cursor-pointer">
                      {optionValue}
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Question précédente
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={!isAnswered}
          >
            {currentQuestionIndex < quiz.questions.length - 1 
              ? "Question suivante" 
              : "Terminer le quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
