import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, FileUp, Save, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/services/courseService";
import { Course, CourseModule, CourseLesson } from "@/types";

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  level: string;
  price: string;
  duration: string;
  requirements: string[];
  objectives: string[];
  tags: string[];
  modules: CourseModule[];
}

type AllowedLessonType = "video" | "reading" | "assignment" | "quiz";

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courseImage, setCourseImage] = useState<string>("");
  const [courseData, setCourseData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
    duration: "",
    requirements: [],
    objectives: [],
    tags: [],
    modules: []
  });
  const [activeTab, setActiveTab] = useState<string>("basicInfo");

  const allowedLessonTypes: AllowedLessonType[] = ["video", "reading", "assignment", "quiz"];

  const handleAddModule = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          id: `module-${Math.random().toString(36).substr(2, 9)}`,
          title: "",
          lessons: [],
          order: prev.modules.length
        }
      ]
    }));
  };

  const handleRemoveModule = (moduleId: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== moduleId)
    }));
  };

  const handleUpdateModuleTitle = (moduleId: string, title: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId ? { ...module, title } : module
      )
    }));
  };

  const handleAddLesson = (moduleId: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: [
              ...module.lessons,
              {
                id: `lesson-${Math.random().toString(36).substr(2, 9)}`,
                title: "",
                content: "",
                duration: 0,
                type: "video",
                resources: [],
                order: module.lessons.length
              }
            ]
          };
        }
        return module;
      })
    }));
  };

  const handleRemoveLesson = (moduleId: string, lessonId: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
          };
        }
        return module;
      })
    }));
  };

  const handleUpdateLesson = (
    moduleId: string,
    lessonId: string,
    field: keyof CourseLesson,
    value: any
  ) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.map(lesson => {
              if (lesson.id === lessonId) {
                return { ...lesson, [field]: value };
              }
              return lesson;
            })
          };
        }
        return module;
      })
    }));
  };

  const handleSaveCourse = async () => {
    if (!user) return;
    
    // Validate required fields
    if (!courseData.title || !courseData.description || !courseData.category || !courseData.level) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (title, description, category, level).",
        variant: "destructive"
      });
      return;
    }
    
    // Validation: at least one module and one lesson per module
    if (
      !courseData.modules.length ||
      courseData.modules.some(module => !module.lessons.length)
    ) {
      toast({
        title: "Error",
        description: "The course must have at least one module and each module must have at least one lesson.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newCourse: Partial<Course> = {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        duration: courseData.duration ? String(courseData.duration) : '20',
        price: Number(courseData.price) || 0,
        rating: 0,
        enrolled: false,
        modules: courseData.modules.map((module, moduleIdx) => ({
          title: module.title,
          order: moduleIdx,
          lessons: module.lessons.map((lesson, lessonIdx) => ({
            title: lesson.title,
            content: lesson.content,
            duration: lesson.duration,
            type: lesson.type,
            order: lessonIdx,
            resources: lesson.resources || []
          }))
        })),
        image: courseImage || "",
        instructor: user.id || user._id,
        status: "published",
        requirements: courseData.requirements,
        objectives: courseData.objectives,
        tags: courseData.tags,
        enrolledStudents: 0,
      };

      // Log the payload being sent to the backend
      console.log('Sending course data:', newCourse);

      await courseService.createCourse(newCourse);
      
      toast({
        title: "Success",
        description: "Your course has been published and is now available for students.",
      });
      
      navigate("/dashboard/courses/manage");
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveDraft = async () => {
    if (!user) return;

    try {
      const draftCourse: Partial<Course> = {
        ...courseData,
        price: Number(courseData.price) || 0,
        image: courseImage || "",
        instructor: user.id || user._id,
        status: "draft",
        enrolledStudents: 0,
        modules: courseData.modules.map((module, moduleIdx) => ({
          ...module,
          order: moduleIdx,
          lessons: module.lessons.map((lesson, lessonIdx) => ({
            ...lesson,
            order: lessonIdx
          }))
        }))
      };

      await courseService.createCourse(draftCourse);
      
      toast({
        title: "Success",
        description: "Course draft saved successfully.",
      });
      
      navigate("/dashboard/courses/manage");
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCourseImage(e.target.result.toString());
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const addResourceToLesson = (moduleId: string, lessonId: string, resource: any) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === lessonId
                  ? { ...lesson, resources: [...(lesson.resources || []), resource] }
                  : lesson
              )
            }
          : module
      )
    }));
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Créer un nouveau cours</h1>
            <p className="text-gray-600 mt-2">Créez et structurez votre nouveau cours</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder comme brouillon
            </Button>
            <Button onClick={handleSaveCourse}>
              <Award className="mr-2 h-4 w-4" />
              Publier le cours
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="basicInfo">Informations de base</TabsTrigger>
            <TabsTrigger value="content">Contenu du cours</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basicInfo">
            <Card>
              <CardHeader>
                <CardTitle>Détails du cours</CardTitle>
                <CardDescription>
                  Complétez les informations de base pour votre cours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="courseTitle">Titre du cours</Label>
                  <Input
                    id="courseTitle"
                    placeholder="Ex: Introduction au développement web"
                    value={courseData.title}
                    onChange={(e) => handleInputChange(e, 'title')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Description complète</Label>
                  <Textarea
                    id="fullDescription"
                    placeholder="Décrivez votre cours en détail, ce que les étudiants vont apprendre..."
                    rows={5}
                    value={courseData.description}
                    onChange={(e) => handleInputChange(e, 'description')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select 
                      value={courseData.category}
                      onValueChange={(value) => handleSelectChange(value, 'category')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Développement</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="photography">Photographie</SelectItem>
                        <SelectItem value="music">Musique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="level">Niveau de difficulté</Label>
                    <Select 
                      value={courseData.level}
                      onValueChange={(value) => handleSelectChange(value, 'level')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coursePrice">Prix (€)</Label>
                  <Input
                    id="coursePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex: 29.99"
                    value={courseData.price}
                    onChange={(e) => handleInputChange(e, 'price')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="courseImage">Image du cours</Label>
                  <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-md bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                    <input
                      id="courseImage"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="courseImage" className="cursor-pointer text-center">
                      {courseImage ? (
                        <div className="space-y-4">
                          <img 
                            src={courseImage}
                            alt="Course preview" 
                            className="max-h-40 rounded mx-auto"
                          />
                          <Button variant="outline" size="sm">Changer l'image</Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <FileUp className="w-10 h-10 text-gray-400 mx-auto" />
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/dashboard/courses/manage')}>
                  Annuler
                </Button>
                <Button onClick={() => setActiveTab('content')}>
                  Continuer vers contenu
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Structure et contenu du cours</CardTitle>
                <CardDescription>
                  Organisez votre cours en modules et leçons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {courseData.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                          <Input
                            value={module.title}
                            onChange={(e) => handleUpdateModuleTitle(module.id, e.target.value)}
                            className="font-medium text-lg"
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveModule(module.id)}
                          disabled={courseData.modules.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="pl-4 space-y-3">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="border rounded p-3 bg-gray-50">
                            <div className="flex flex-wrap gap-3">
                              <div className="flex-1 min-w-[200px]">
                                <Label htmlFor={`lesson-title-${lesson.id}`} className="text-xs">Titre</Label>
                                <Input
                                  id={`lesson-title-${lesson.id}`}
                                  value={lesson.title}
                                  onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'title', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div className="w-32">
                                <Label htmlFor={`lesson-type-${lesson.id}`} className="text-xs">Type</Label>
                                <Select
                                  value={lesson.type}
                                  onValueChange={(value) => handleUpdateLesson(module.id, lesson.id, 'type', value)}
                                >
                                  <SelectTrigger id={`lesson-type-${lesson.id}`} className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="reading">Lecture</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="w-28">
                                <Label htmlFor={`lesson-duration-${lesson.id}`} className="text-xs">Durée</Label>
                                <Input
                                  id={`lesson-duration-${lesson.id}`}
                                  value={lesson.duration}
                                  onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'duration', e.target.value)}
                                  placeholder="10:00"
                                  className="mt-1"
                                />
                              </div>
                              
                              <div className="flex items-end">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleRemoveLesson(module.id, lesson.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <Label htmlFor={`lesson-content-${lesson.id}`} className="text-xs">Contenu</Label>
                              <Textarea
                                id={`lesson-content-${lesson.id}`}
                                value={lesson.content}
                                onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'content', e.target.value)}
                                placeholder="Description ou contenu de la leçon..."
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleAddLesson(module.id)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Ajouter une leçon
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleAddModule}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('basicInfo')}>
                  Retour aux informations
                </Button>
                <Button onClick={() => setActiveTab('settings')}>
                  Continuer vers paramètres
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du cours</CardTitle>
                <CardDescription>
                  Configurez les options de votre cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>What You'll Learn</Label>
                    <ul className="mb-2">
                      {courseData.objectives.map((obj, idx) => (
                        <li key={idx} className="flex items-center gap-2 mb-1">
                          <Input
                            value={obj}
                            onChange={e => {
                              const newObjectives = [...courseData.objectives];
                              newObjectives[idx] = e.target.value;
                              setCourseData(prev => ({ ...prev, objectives: newObjectives }));
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCourseData(prev => ({
                                ...prev,
                                objectives: prev.objectives.filter((_, i) => i !== idx)
                              }));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setCourseData(prev => ({ ...prev, objectives: [...prev.objectives, ""] }))}
                    >
                      Add Objective
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('content')}>
                  Retour au contenu
                </Button>
                <Button onClick={handleSaveCourse}>
                  <Award className="mr-2 h-4 w-4" />
                  Publier le cours
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default CreateCoursePage;
