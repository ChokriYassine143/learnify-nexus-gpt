
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const CreateQuizPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    courseId: "",
    passingScore: 70,
    timeLimit: 30,
    randomizeQuestions: false,
    showResults: true,
    questions: [
      {
        id: "q1",
        question: "",
        options: [
          { id: "o1-q1", text: "", isCorrect: false },
          { id: "o2-q1", text: "", isCorrect: false },
          { id: "o3-q1", text: "", isCorrect: false },
          { id: "o4-q1", text: "", isCorrect: false }
        ],
        explanation: ""
      }
    ]
  });
  
  const courses = [
    { id: "c1", title: "Web Development Fundamentals" },
    { id: "c2", title: "Data Science and Machine Learning" },
    { id: "c3", title: "Frontend Development with React" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setQuizData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setQuizData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleSwitchChange = (checked: boolean, field: string) => {
    setQuizData(prev => ({
      ...prev,
      [field]: checked
    }));
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const updateQuestion = (questionId: string, field: string, value: string) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };
  
  const updateOption = (questionId: string, optionId: string, value: string) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map(o => 
              o.id === optionId ? { ...o, text: value } : o
            )
          };
        }
        return q;
      })
    }));
  };
  
  const setCorrectOption = (questionId: string, optionId: string) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map(o => ({
              ...o,
              isCorrect: o.id === optionId
            }))
          };
        }
        return q;
      })
    }));
  };
  
  const addQuestion = () => {
    const newQuestionId = `q${quizData.questions.length + 1}`;
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: newQuestionId,
        question: "",
        options: [
          { id: `o1-${newQuestionId}`, text: "", isCorrect: false },
          { id: `o2-${newQuestionId}`, text: "", isCorrect: false },
          { id: `o3-${newQuestionId}`, text: "", isCorrect: false },
          { id: `o4-${newQuestionId}`, text: "", isCorrect: false }
        ],
        explanation: ""
      }]
    }));
  };
  
  const removeQuestion = (questionId: string) => {
    if (quizData.questions.length <= 1) {
      toast({
        title: "Action impossible",
        description: "Vous devez avoir au moins une question dans votre quiz.",
        variant: "destructive"
      });
      return;
    }
    
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };
  
  const handleSaveQuiz = () => {
    // Validate quiz data
    if (!quizData.title.trim()) {
      toast({
        title: "Titre manquant",
        description: "Veuillez donner un titre à votre quiz.",
        variant: "destructive"
      });
      return;
    }
    
    if (!quizData.courseId) {
      toast({
        title: "Cours non sélectionné",
        description: "Veuillez sélectionner un cours pour ce quiz.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if all questions have content and a correct answer
    for (const question of quizData.questions) {
      if (!question.question.trim()) {
        toast({
          title: "Question incomplète",
          description: "Toutes les questions doivent avoir un contenu.",
          variant: "destructive"
        });
        return;
      }
      
      if (!question.options.some(o => o.isCorrect)) {
        toast({
          title: "Réponse correcte manquante",
          description: "Chaque question doit avoir une réponse correcte sélectionnée.",
          variant: "destructive"
        });
        return;
      }
      
      if (question.options.some(o => o.isCorrect && !o.text.trim())) {
        toast({
          title: "Option incomplète",
          description: "La réponse correcte ne peut pas être vide.",
          variant: "destructive"
        });
        return;
      }
    }
    
    toast({
      title: "Quiz créé avec succès",
      description: "Votre quiz a été enregistré et est prêt à être utilisé.",
    });
    
    // In a real app, this would save the quiz data to a database
    navigate('/dashboard/quizzes/manage');
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Créer un nouveau quiz</h1>
            <p className="text-gray-600 mt-2">Créez un quiz pour évaluer les connaissances de vos étudiants</p>
          </div>
          <Button onClick={handleSaveQuiz}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Enregistrer le quiz
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Définissez les détails de votre quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="quizTitle">Titre du quiz</Label>
                  <Input
                    id="quizTitle"
                    placeholder="Ex: Quiz sur les fondamentaux HTML"
                    value={quizData.title}
                    onChange={(e) => handleInputChange(e, 'title')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quizDescription">Description</Label>
                  <Textarea
                    id="quizDescription"
                    placeholder="Décrivez brièvement le contenu de ce quiz..."
                    value={quizData.description}
                    onChange={(e) => handleInputChange(e, 'description')}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="courseName">Cours associé</Label>
                  <Select 
                    value={quizData.courseId}
                    onValueChange={(value) => handleSelectChange(value, 'courseId')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {quizData.questions.map((question, questionIndex) => (
              <Card key={question.id} id={`question-${questionIndex + 1}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                    <CardDescription>Créez votre question et ses réponses</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${question.id}`}>Question</Label>
                    <Textarea
                      id={`question-${question.id}`}
                      placeholder="Écrivez votre question ici..."
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Options de réponse</Label>
                    <RadioGroup 
                      value={question.options.find(o => o.isCorrect)?.id || ""}
                      onValueChange={(value) => setCorrectOption(question.id, value)}
                    >
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={option.id}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Input
                            className="flex-1"
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option.text}
                            onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                          />
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-sm text-gray-500">
                      Sélectionnez la réponse correcte en cochant le cercle à côté de l'option.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`explanation-${question.id}`}>Explication (optionnel)</Label>
                    <Textarea
                      id={`explanation-${question.id}`}
                      placeholder="Expliquez pourquoi cette réponse est correcte..."
                      value={question.explanation}
                      onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                      rows={2}
                    />
                    <p className="text-xs text-gray-500">
                      Cette explication sera montrée aux étudiants après qu'ils ont répondu à la question.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button 
              variant="outline" 
              onClick={addQuestion}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une question
            </Button>
          </div>
          
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Paramètres du quiz</CardTitle>
                <CardDescription>Configurez les options pour ce quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="passingScore">Score de réussite (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={quizData.passingScore}
                    onChange={(e) => handleNumberChange(e, 'passingScore')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Limite de temps (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="0"
                    value={quizData.timeLimit}
                    onChange={(e) => handleNumberChange(e, 'timeLimit')}
                  />
                  <p className="text-xs text-gray-500">
                    Laissez 0 pour un quiz sans limite de temps.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="randomize" className="text-sm font-medium">Ordre aléatoire des questions</Label>
                    <p className="text-xs text-gray-500">
                      Les questions seront présentées dans un ordre aléatoire.
                    </p>
                  </div>
                  <Switch
                    id="randomize"
                    checked={quizData.randomizeQuestions}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'randomizeQuestions')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showResults" className="text-sm font-medium">Afficher les résultats</Label>
                    <p className="text-xs text-gray-500">
                      Les étudiants verront leurs réponses après avoir terminé.
                    </p>
                  </div>
                  <Switch
                    id="showResults"
                    checked={quizData.showResults}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'showResults')}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button onClick={handleSaveQuiz}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Enregistrer le quiz
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default CreateQuizPage;
