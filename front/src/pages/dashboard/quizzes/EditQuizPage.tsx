import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import { quizService } from "@/services/quizService";
import { courseService } from "@/services/courseService";
import { Quiz } from "@/types";

const EditQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();

  const [quizData, setQuizData] = useState<any>(null);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load courses
        const loadedCourses = await courseService.getAllCourses();
        setCourses(loadedCourses);

        if (quizId) {
          // Load quiz data
          const quiz = await quizService.getQuiz(quizId);
          if (quiz) {
            // Transform questions/options for the edit form
            const transformedQuestions = quiz.questions.map((q: any) => {
              let options = q.options;
              if (typeof options[0] === "string") {
                options = options.map((opt: string, idx: number) => ({
                  id: `o${idx + 1}-${q.id}`,
                  text: opt,
                  isCorrect: Array.isArray(q.correctAnswer)
                    ? q.correctAnswer.includes(opt)
                    : q.correctAnswer === opt,
                }));
              }
              return {
                ...q,
                options,
              };
            });
            setQuizData({
              ...quiz,
              questions: transformedQuestions,
            });

            // Set modules and lessons for the course
            const selectedCourse = loadedCourses.find((c: any) => c.id === quiz.courseId);
            setModules(selectedCourse?.modules || []);
            const selectedModule = selectedCourse?.modules?.find((m: any) => m.id === quiz.moduleId);
            setLessons(selectedModule?.lessons || []);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load quiz data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [quizId]);

  // Load modules when course changes
  useEffect(() => {
    if (quizData && quizData.courseId) {
      const selectedCourse = courses.find((c: any) => c.id === quizData.courseId);
      setModules(selectedCourse?.modules || []);
      // Only reset if not already set
      setQuizData((prev: any) => ({
        ...prev,
        moduleId: prev.moduleId || (selectedCourse?.modules?.[0]?.id ?? ""),
        lessonId: prev.lessonId || (selectedCourse?.modules?.[0]?.lessons?.[0]?.id ?? "")
      }));
      setLessons(
        selectedCourse?.modules?.find((m: any) => m.id === (quizData.moduleId || selectedCourse?.modules?.[0]?.id))?.lessons || []
      );
    }
  }, [quizData?.courseId, courses]);

  // Load lessons when module changes
  useEffect(() => {
    if (quizData && quizData.moduleId) {
      const selectedModule = modules.find((m: any) => m.id === quizData.moduleId);
      setLessons(selectedModule?.lessons || []);
      setQuizData((prev: any) => ({ ...prev, lessonId: "" }));
    }
  }, [quizData?.moduleId, modules]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setQuizData((prev: any) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setQuizData((prev: any) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSwitchChange = (checked: boolean, field: string) => {
    setQuizData((prev: any) => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setQuizData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateQuestion = (questionId: string, field: string, value: string) => {
    setQuizData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionId: string, optionId: string, value: string) => {
    setQuizData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o: any) =>
              o.id === optionId ? { ...o, text: value } : o
            )
          };
        }
        return q;
      })
    }));
  };

  const setCorrectOption = (questionId: string, optionId: string) => {
    setQuizData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o: any) => ({
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
    setQuizData((prev: any) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: newQuestionId,
          question: "",
          options: [
            { id: `o1-${newQuestionId}`, text: "", isCorrect: false },
            { id: `o2-${newQuestionId}`, text: "", isCorrect: false },
            { id: `o3-${newQuestionId}`, text: "", isCorrect: false },
            { id: `o4-${newQuestionId}`, text: "", isCorrect: false }
          ],
          explanation: ""
        }
      ]
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
    setQuizData((prev: any) => ({
      ...prev,
      questions: prev.questions.filter((q: any) => q.id !== questionId)
    }));
  };

  const handleSaveQuiz = async () => {
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
        description: "Veuillez sélectionner un cours.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Transform the quiz data for the API
      const quizForApi = {
        ...quizData,
        questions: quizData.questions.map((q: any) => ({
          question: q.question,
          type: "multiple-choice",
          options: q.options.map((o: any) => o.text),
          correctAnswer: q.options.find((o: any) => o.isCorrect)?.text || '',
          points: 1,
          explanation: q.explanation
        }))
      };

      // Update the quiz
      await quizService.updateQuiz(quizId!, quizForApi);

      toast({ 
        title: "Quiz mis à jour", 
        description: "Le quiz a été mis à jour avec succès." 
      });
      navigate("/dashboard/quizzes/manage");
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du quiz.",
        variant: "destructive"
      });
    }
  };

  if (loading || !quizData) {
    return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  }

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>Modifier le Quiz</CardTitle>
              <CardDescription>Modifiez les informations de votre quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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

                {modules.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="moduleName">Module associé</Label>
                    <Select
                      value={quizData.moduleId}
                      onValueChange={value => handleSelectChange(value, 'moduleId')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un module" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.map(module => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {lessons.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="lessonName">Leçon associée</Label>
                    <Select
                      value={quizData.lessonId || ""}
                      onValueChange={value => handleSelectChange(value, 'lessonId')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une leçon" />
                      </SelectTrigger>
                      <SelectContent>
                        {lessons.map(lesson => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {lesson.title} ({lesson.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Questions */}
                {quizData.questions.map((question, questionIndex) => (
                  <Card key={`question-${question.id || questionIndex}`} id={`question-${questionIndex + 1}`} className="mt-6">
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
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Intitulé de la question</Label>
                        <Input
                          value={question.question}
                          onChange={e => updateQuestion(question.id, 'question', e.target.value)}
                          placeholder="Saisissez la question ici"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Réponses</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {question.options.map((option, optionIdx) => (
                            <div key={`option-${option.id || optionIdx}`} className="flex items-center gap-2">
                              <RadioGroup
                                value={question.options.find((o: any) => o.isCorrect)?.id || ""}
                                onValueChange={val => setCorrectOption(question.id, val)}
                              >
                                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                              </RadioGroup>
                              <Input
                                value={option.text}
                                onChange={e => updateOption(question.id, option.id, e.target.value)}
                                placeholder={`Option ${optionIdx + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Label>Explication (facultatif)</Label>
                        <Textarea
                          value={question.explanation}
                          onChange={e => updateQuestion(question.id, 'explanation', e.target.value)}
                          placeholder="Ajoutez une explication ou un commentaire pour cette question"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button className="mt-4" variant="outline" onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" /> Ajouter une question
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveQuiz}>Enregistrer les modifications</Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default EditQuizPage; 