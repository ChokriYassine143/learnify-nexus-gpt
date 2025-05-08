
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, FileText, MessageSquare, BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseSidebar, { Course, Lesson } from "@/components/courses/CourseSidebar";
import LessonContent from "@/components/courses/LessonContent";
import QuizComponent from "@/components/courses/QuizComponent";
import { toast } from "@/hooks/use-toast";

// Mock data with proper type annotations for lessons
const courseMockData: Course = {
  id: "1",
  title: "Web Development Fundamentals",
  description: "Learn the basics of web development with HTML, CSS, and JavaScript.",
  instructor: "Prof. John Smith",
  progress: 42,
  enrolled: true,
  modules: [
    {
      id: "m1",
      title: "Introduction to HTML",
      complete: true,
      lessons: [
        { id: "l1", title: "HTML Basics", type: "video" as const, duration: "12:30", complete: true },
        { id: "l2", title: "HTML Elements", type: "video" as const, duration: "15:45", complete: true },
        { id: "l3", title: "HTML Forms", type: "reading" as const, duration: "10 min", complete: true },
        { id: "l4", title: "HTML Quiz", type: "quiz" as const, duration: "15 min", complete: true }
      ]
    },
    {
      id: "m2",
      title: "CSS Fundamentals",
      complete: true,
      lessons: [
        { id: "l5", title: "CSS Selectors", type: "video" as const, duration: "14:20", complete: true },
        { id: "l6", title: "CSS Box Model", type: "video" as const, duration: "18:15", complete: true },
        { id: "l7", title: "CSS Layouts", type: "reading" as const, duration: "15 min", complete: false },
        { id: "l8", title: "CSS Quiz", type: "quiz" as const, duration: "20 min", complete: false }
      ]
    },
    {
      id: "m3",
      title: "JavaScript Basics",
      complete: false,
      lessons: [
        { id: "l9", title: "JavaScript Syntax", type: "video" as const, duration: "20:10", complete: false },
        { id: "l10", title: "JavaScript Functions", type: "video" as const, duration: "22:35", complete: false },
        { id: "l11", title: "DOM Manipulation", type: "reading" as const, duration: "15 min", complete: false },
        { id: "l12", title: "JavaScript Quiz", type: "quiz" as const, duration: "25 min", complete: false, locked: true }
      ]
    }
  ]
};

// Course for unenrolled preview
const notEnrolledCourse: Course = {
  ...courseMockData,
  enrolled: false,
  modules: courseMockData.modules.map(module => ({
    ...module,
    lessons: module.lessons.map((lesson, idx) => ({
      ...lesson,
      locked: idx > 0 // Only first lesson in each module is available for preview
    }))
  }))
};

const CourseLearningPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const [isEnrolled, setIsEnrolled] = useState(true); // For demo purposes
  const [notes, setNotes] = useState<string>("");
  const [activeTab, setActiveTab] = useState("content");
  
  // Get the correct course data based on enrollment status
  const courseData = isEnrolled ? courseMockData : notEnrolledCourse;

  // Initialize with first lesson or specified lesson
  const [currentLesson, setCurrentLesson] = useState<Lesson>(
    lessonId 
      ? courseData.modules.flatMap(m => m.lessons).find(l => l.id === lessonId) || courseData.modules[0].lessons[0]
      : courseData.modules[0].lessons[0]
  );

  // Find the current module
  const currentModule = courseData.modules.find(m => 
    m.lessons.some(l => l.id === currentLesson.id)
  );

  // Functions for navigation
  const findAdjacentLesson = (direction: 'prev' | 'next'): Lesson | null => {
    const allLessons = courseData.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    
    if (direction === 'prev' && currentIndex > 0) {
      return allLessons[currentIndex - 1];
    } else if (direction === 'next' && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    
    return null;
  };

  const handleLessonChange = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    // In a real app, you would update the URL with the new lesson ID
  };

  const handleMarkComplete = () => {
    toast({
      title: "Leçon terminée",
      description: "Cette leçon a été marquée comme terminée",
    });
    // In a real app, you would update the lesson status and send to API
  };

  const handleEnroll = () => {
    toast({
      title: "Inscription en cours",
      description: "Vous allez être redirigé vers la page de paiement",
    });
    // In a real app, this would redirect to payment/enrollment flow
    setIsEnrolled(true);
  };

  const handleSaveNotes = () => {
    toast({
      title: "Notes sauvegardées",
      description: "Vos notes ont été enregistrées avec succès",
    });
    // In a real app, you would save notes to an API
  };

  const prevLesson = findAdjacentLesson('prev');
  const nextLesson = findAdjacentLesson('next');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CourseSidebar 
                course={courseData}
                currentLessonId={currentLesson.id}
                onLessonSelect={handleLessonChange}
                isEnrolled={isEnrolled}
              />
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h1 className="text-2xl font-bold">{courseData.title}</h1>
                        <p className="text-gray-600 mt-1">
                          {currentModule?.title} - {currentLesson.title}
                        </p>
                      </div>
                      {!isEnrolled && (
                        <Button onClick={handleEnroll}>S'inscrire maintenant</Button>
                      )}
                    </div>
                    
                    {isEnrolled && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression du cours</span>
                          <span>{courseData.progress}%</span>
                        </div>
                        <Progress value={courseData.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="content">Contenu</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="discussions">Discussions</TabsTrigger>
                      <TabsTrigger value="resources">Ressources</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="mt-4 min-h-[400px]">
                      <LessonContent 
                        lesson={currentLesson} 
                        isEnrolled={isEnrolled}
                        onEnroll={handleEnroll}
                      />
                      
                      {currentLesson.type === "quiz" && isEnrolled && !currentLesson.locked && (
                        <QuizComponent lessonId={currentLesson.id} />
                      )}
                      
                      {(isEnrolled || !currentLesson.locked) && (
                        <div className="mt-8 flex justify-between">
                          <Button 
                            variant="outline"
                            onClick={() => prevLesson && handleLessonChange(prevLesson)}
                            disabled={!prevLesson}
                          >
                            Leçon précédente
                          </Button>
                          
                          {isEnrolled && (
                            currentLesson.complete ? (
                              <Button className="bg-emerald-500 hover:bg-emerald-600">
                                <CheckCircle className="mr-2 h-4 w-4" /> Terminé
                              </Button>
                            ) : (
                              <Button onClick={handleMarkComplete}>
                                Marquer comme terminé
                              </Button>
                            )
                          )}
                          
                          <Button 
                            onClick={() => nextLesson && handleLessonChange(nextLesson)}
                            disabled={!nextLesson || (!isEnrolled && nextLesson.locked)}
                          >
                            Leçon suivante
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="notes" className="mt-4">
                      {isEnrolled ? (
                        <div className="bg-white border border-gray-200 rounded-md p-4">
                          <p className="text-gray-600 mb-4">
                            Prenez des notes pendant votre apprentissage pour vous aider à retenir les informations importantes.
                          </p>
                          <Textarea 
                            placeholder="Écrivez vos notes ici..."
                            className="mt-4 min-h-[300px]"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                          <div className="mt-4 flex justify-end">
                            <Button onClick={handleSaveNotes}>Sauvegarder les notes</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center border rounded-md bg-gray-50">
                          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-medium mb-2">Fonctionnalité réservée aux utilisateurs inscrits</h3>
                          <p className="text-gray-600 mb-6">
                            Inscrivez-vous à ce cours pour pouvoir prendre des notes pendant votre apprentissage.
                          </p>
                          <Button onClick={handleEnroll}>S'inscrire au cours</Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="discussions" className="mt-4">
                      {isEnrolled ? (
                        <div className="bg-white border border-gray-200 rounded-md p-4">
                          <p className="text-gray-600 mb-4">
                            Discutez de cette leçon avec d'autres étudiants et l'instructeur.
                          </p>
                          
                          <div className="space-y-4 mb-6">
                            <div className="bg-white rounded-lg border p-4">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                                  JD
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">Jane Doe</span>
                                    <span className="text-xs text-gray-500">Il y a 2 jours</span>
                                  </div>
                                  <p className="mt-1">
                                    Est-ce que quelqu'un peut m'expliquer comment fonctionne le positionnement en CSS ?
                                  </p>
                                  <div className="mt-2 flex gap-2">
                                    <Button variant="outline" size="sm">Répondre</Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg border p-4 ml-8">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center">
                                  JS
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">John Smith</span>
                                    <Badge variant="outline" className="text-xs">Instructeur</Badge>
                                    <span className="text-xs text-gray-500">Hier</span>
                                  </div>
                                  <p className="mt-1">
                                    Bien sûr ! Le positionnement en CSS permet de définir comment un élément est positionné sur la page. Il existe plusieurs valeurs : static, relative, absolute, fixed et sticky...
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="font-medium mb-2">Ajouter un commentaire</h4>
                            <Textarea 
                              placeholder="Écrivez votre commentaire ici..."
                              className="min-h-[100px]"
                            />
                            <div className="mt-4 flex justify-end">
                              <Button>Publier</Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center border rounded-md bg-gray-50">
                          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-medium mb-2">Discussions réservées aux utilisateurs inscrits</h3>
                          <p className="text-gray-600 mb-6">
                            Inscrivez-vous à ce cours pour participer aux discussions avec les autres étudiants et l'instructeur.
                          </p>
                          <Button onClick={handleEnroll}>S'inscrire au cours</Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="resources" className="mt-4">
                      {isEnrolled ? (
                        <div className="bg-white border border-gray-200 rounded-md p-4">
                          <p className="text-gray-600 mb-6">
                            Ressources supplémentaires pour cette leçon.
                          </p>
                          
                          <div className="space-y-3">
                            <div className="flex items-center p-3 border rounded-md bg-white hover:border-primary transition-colors">
                              <FileText className="h-5 w-5 mr-3 text-primary" />
                              <div>
                                <p className="font-medium">Guide CSS Layout</p>
                                <p className="text-sm text-gray-600">PDF, 1.2 MB</p>
                              </div>
                              <Button variant="outline" size="sm" className="ml-auto">
                                Télécharger
                              </Button>
                            </div>
                            
                            <div className="flex items-center p-3 border rounded-md bg-white hover:border-primary transition-colors">
                              <Play className="h-5 w-5 mr-3 text-primary" />
                              <div>
                                <p className="font-medium">Vidéo supplémentaire sur Flexbox</p>
                                <p className="text-sm text-gray-600">MP4, 15:30 min</p>
                              </div>
                              <Button variant="outline" size="sm" className="ml-auto">
                                Regarder
                              </Button>
                            </div>
                            
                            <div className="flex items-center p-3 border rounded-md bg-white hover:border-primary transition-colors">
                              <BookOpen className="h-5 w-5 mr-3 text-primary" />
                              <div>
                                <p className="font-medium">Article de blog sur CSS Grid</p>
                                <p className="text-sm text-gray-600">Lecture, 10 min</p>
                              </div>
                              <Button variant="outline" size="sm" className="ml-auto">
                                Lire
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center border rounded-md bg-gray-50">
                          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-medium mb-2">Ressources réservées aux utilisateurs inscrits</h3>
                          <p className="text-gray-600 mb-6">
                            Inscrivez-vous à ce cours pour accéder à toutes les ressources supplémentaires.
                          </p>
                          <Button onClick={handleEnroll}>S'inscrire au cours</Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseLearningPage;
