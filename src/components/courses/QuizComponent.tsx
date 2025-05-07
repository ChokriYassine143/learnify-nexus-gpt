
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
}

const mockQuizData = {
  title: "CSS Layouts Quiz",
  description: "Test your knowledge of CSS layouts and responsive design",
  questions: [
    {
      id: "q1",
      question: "Quelle propriété CSS est utilisée pour créer un layout flexible ?",
      options: [
        { id: "a", text: "display: block" },
        { id: "b", text: "display: flex" },
        { id: "c", text: "display: inline" },
        { id: "d", text: "display: grid" }
      ],
      correctAnswerId: "b"
    },
    {
      id: "q2",
      question: "Comment centrer horizontalement et verticalement un élément avec Flexbox ?",
      options: [
        { id: "a", text: "align: center; justify: center;" },
        { id: "b", text: "text-align: center; vertical-align: middle;" },
        { id: "c", text: "justify-content: center; align-items: center;" },
        { id: "d", text: "margin: auto; position: center;" }
      ],
      correctAnswerId: "c"
    },
    {
      id: "q3",
      question: "Quelle unité est relative à la taille de la police de l'élément parent ?",
      options: [
        { id: "a", text: "px" },
        { id: "b", text: "rem" },
        { id: "c", text: "em" },
        { id: "d", text: "vh" }
      ],
      correctAnswerId: "c"
    },
    {
      id: "q4",
      question: "Comment définir une colonne qui prend tout l'espace disponible en CSS Grid ?",
      options: [
        { id: "a", text: "grid-column: auto;" },
        { id: "b", text: "grid-column: 1fr;" },
        { id: "c", text: "grid-column: span;" },
        { id: "d", text: "grid-column: 100%;" }
      ],
      correctAnswerId: "b"
    }
  ]
};

interface QuizComponentProps {
  lessonId: string;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ lessonId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const handleAnswerChange = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < mockQuizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const calculateScore = () => {
    let correctAnswers = 0;
    mockQuizData.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswerId) {
        correctAnswers++;
      }
    });
    
    return {
      score: correctAnswers,
      total: mockQuizData.questions.length,
      percentage: Math.round((correctAnswers / mockQuizData.questions.length) * 100)
    };
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };
  
  const currentQuestion = mockQuizData.questions[currentQuestionIndex];
  const isAnswered = !!selectedAnswers[currentQuestion?.id];
  const score = calculateScore();
  
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
          
          <div className="space-y-6">
            {mockQuizData.questions.map((question, index) => {
              const isCorrect = selectedAnswers[question.id] === question.correctAnswerId;
              const userAnswer = question.options.find(opt => opt.id === selectedAnswers[question.id]);
              const correctAnswer = question.options.find(opt => opt.id === question.correctAnswerId);
              
              return (
                <div key={question.id} className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
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
                        <p>Votre réponse: {userAnswer?.text || "Aucune réponse"}</p>
                        {!isCorrect && (
                          <p className="text-green-700 mt-1">Réponse correcte: {correctAnswer?.text}</p>
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
            Question {currentQuestionIndex + 1} sur {mockQuizData.questions.length}
          </h3>
          <div className="text-sm text-gray-500">
            {Math.round(((currentQuestionIndex + 1) / mockQuizData.questions.length) * 100)}% terminé
          </div>
        </div>
        
        <div className="mb-8">
          <h4 className="text-lg mb-4">{currentQuestion.question}</h4>
          
          <RadioGroup
            value={selectedAnswers[currentQuestion.id] || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
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
            {currentQuestionIndex < mockQuizData.questions.length - 1 
              ? "Question suivante" 
              : "Terminer le quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
