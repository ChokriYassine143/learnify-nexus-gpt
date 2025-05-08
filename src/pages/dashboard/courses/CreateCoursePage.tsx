
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

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [courseImage, setCourseImage] = useState<string | null>(null);
  
  const [courseData, setCourseData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    level: "beginner",
    price: "",
    modules: [
      {
        id: "module-1",
        title: "Module 1",
        lessons: [
          {
            id: "lesson-1",
            title: "Introduction",
            type: "video",
            duration: "10:00",
            content: ""
          }
        ]
      }
    ]
  });
  
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
  
  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, {
        id: `module-${prev.modules.length + 1}`,
        title: `Module ${prev.modules.length + 1}`,
        lessons: []
      }]
    }));
  };
  
  const removeModule = (moduleId: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== moduleId)
    }));
  };
  
  const updateModuleTitle = (moduleId: string, title: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module => 
        module.id === moduleId ? { ...module, title } : module
      )
    }));
  };
  
  const addLesson = (moduleId: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: [...module.lessons, {
              id: `lesson-${module.lessons.length + 1}-${moduleId}`,
              title: `Nouvelle leçon`,
              type: "video",
              duration: "00:00",
              content: ""
            }]
          };
        }
        return module;
      })
    }));
  };
  
  const removeLesson = (moduleId: string, lessonId: string) => {
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
  
  const updateLesson = (moduleId: string, lessonId: string, field: string, value: string) => {
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
  
  const handleSaveCourse = () => {
    toast({
      title: "Cours créé avec succès",
      description: "Votre cours a été enregistré et est prêt à être publié.",
    });
    
    // In a real app, this would save the course data to a database
    // For now, we'll just navigate back to the course management page
    navigate('/dashboard/courses/manage');
  };
  
  const handleSaveDraft = () => {
    toast({
      title: "Brouillon enregistré",
      description: "Votre cours a été sauvegardé en tant que brouillon.",
    });
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
                  <Label htmlFor="shortDescription">Description courte</Label>
                  <Input
                    id="shortDescription"
                    placeholder="Une brève description de votre cours (150 caractères max)"
                    value={courseData.shortDescription}
                    onChange={(e) => handleInputChange(e, 'shortDescription')}
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
                          <p className="font-medium">Cliquez pour télécharger une image</p>
                          <p className="text-sm text-gray-500">SVG, PNG, JPG (max. 2MB)</p>
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
                <Button onClick={() => setActiveTab("content")}>
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
                            onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                            className="font-medium text-lg"
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeModule(module.id)}
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
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div className="w-32">
                                <Label htmlFor={`lesson-type-${lesson.id}`} className="text-xs">Type</Label>
                                <Select
                                  value={lesson.type}
                                  onValueChange={(value) => updateLesson(module.id, lesson.id, 'type', value)}
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
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'duration', e.target.value)}
                                  placeholder="10:00"
                                  className="mt-1"
                                />
                              </div>
                              
                              <div className="flex items-end">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeLesson(module.id, lesson.id)}
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
                                onChange={(e) => updateLesson(module.id, lesson.id, 'content', e.target.value)}
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
                          onClick={() => addLesson(module.id)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Ajouter une leçon
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={addModule}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un module
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("basicInfo")}>
                  Retour aux informations
                </Button>
                <Button onClick={() => setActiveTab("settings")}>
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
                  {/* Additional settings would go here in a real app */}
                  <p className="text-center py-8 text-gray-500">
                    Les options supplémentaires seront disponibles dans une version future.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("content")}>
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
