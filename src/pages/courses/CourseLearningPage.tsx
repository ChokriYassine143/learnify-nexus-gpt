
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
import CourseSidebar from "@/components/courses/CourseSidebar";
import LessonContent from "@/components/courses/LessonContent";
import QuizComponent from "@/components/courses/QuizComponent";

// Mock data with proper type annotations for lessons
const courseMockData = {
  id: "1",
  title: "Web Development Fundamentals",
  description: "Learn the basics of web development with HTML, CSS, and JavaScript.",
  instructor: "Prof. John Smith",
  progress: 42,
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
        { id: "l12", title: "JavaScript Quiz", type: "quiz" as const, duration: "25 min", complete: false }
      ]
    }
  ]
};

const CourseLearningPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [currentLesson, setCurrentLesson] = useState(
    courseMockData.modules[1].lessons[2]
  );
  const [activeTab, setActiveTab] = useState("content");

  // Find the current module from the mock data
  const currentModule = courseMockData.modules.find(m => 
    m.lessons.some(l => l.id === currentLesson.id)
  );

  const handleLessonChange = (lesson: any) => {
    setCurrentLesson(lesson);
    // In a real app, you would update progress and send to API
  };

  const handleMarkComplete = () => {
    // In a real app, you would update the lesson status and send to API
    alert("Leçon marquée comme terminée !");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CourseSidebar 
                course={courseMockData}
                currentLessonId={currentLesson.id}
                onLessonSelect={handleLessonChange}
              />
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold">{courseMockData.title}</h1>
                    <p className="text-gray-600 mt-1">
                      {currentModule?.title} - {currentLesson.title}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression du cours</span>
                      <span>{courseMockData.progress}%</span>
                    </div>
                    <Progress value={courseMockData.progress} className="h-2" />
                  </div>
                  
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="content">Contenu</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="discussions">Discussions</TabsTrigger>
                      <TabsTrigger value="resources">Ressources</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="mt-4 min-h-[400px]">
                      <LessonContent lesson={currentLesson} />
                      
                      {currentLesson.type === "quiz" && (
                        <QuizComponent lessonId={currentLesson.id} />
                      )}
                      
                      <div className="mt-8 flex justify-between">
                        <Button variant="outline">Leçon précédente</Button>
                        {currentLesson.complete ? (
                          <Button className="bg-emerald-500 hover:bg-emerald-600">
                            <CheckCircle className="mr-2 h-4 w-4" /> Terminé
                          </Button>
                        ) : (
                          <Button onClick={handleMarkComplete}>
                            Marquer comme terminé
                          </Button>
                        )}
                        <Button>Leçon suivante</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notes" className="mt-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <p className="text-gray-600">
                          Prenez des notes pendant votre apprentissage pour vous aider à retenir les informations importantes.
                        </p>
                        <Textarea 
                          placeholder="Écrivez vos notes ici..."
                          className="mt-4 min-h-[300px]"
                        />
                        <div className="mt-4 flex justify-end">
                          <Button>Sauvegarder les notes</Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="discussions" className="mt-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
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
                    </TabsContent>
                    
                    <TabsContent value="resources" className="mt-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
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
