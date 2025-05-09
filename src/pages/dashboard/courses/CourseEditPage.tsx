
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, ArrowLeft, Trash2, Plus, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock course data - in a real application, you would fetch this from an API
const mockCourses = [
  {
    id: "1",
    title: "Introduction à la Programmation",
    description: "Cours de base pour les débutants en programmation",
    longDescription: "Ce cours est conçu pour les débutants absolus en programmation. Vous apprendrez les concepts fondamentaux de la programmation, y compris les variables, les fonctions, les boucles, et les conditions. À la fin du cours, vous serez capable d'écrire des programmes simples et de comprendre la logique derrière le code.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    level: "beginner",
    duration: "12 weeks",
    modules: [
      {
        id: "m1",
        title: "Introduction aux concepts de programmation",
        lessons: [
          { id: "l1", title: "Qu'est-ce que la programmation?", content: "Contenu de la leçon ici..." },
          { id: "l2", title: "Variables et types de données", content: "Contenu de la leçon ici..." }
        ]
      },
      {
        id: "m2",
        title: "Structures de contrôle",
        lessons: [
          { id: "l3", title: "Conditions: if, else, switch", content: "Contenu de la leçon ici..." },
          { id: "l4", title: "Boucles: for, while, do-while", content: "Contenu de la leçon ici..." }
        ]
      }
    ],
    instructors: [
      { id: "i1", name: "Prof. Jean Martin", bio: "Expert en programmation avec 10 ans d'expérience." }
    ]
  },
  {
    id: "2",
    title: "Web Development Fundamentals",
    description: "HTML, CSS, and JavaScript basics",
    longDescription: "Learn the foundations of web development with HTML, CSS, and JavaScript. This course covers everything you need to know to build your first interactive website.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
    level: "beginner",
    duration: "8 weeks",
    modules: [
      {
        id: "m1",
        title: "HTML Basics",
        lessons: [
          { id: "l1", title: "HTML Structure", content: "Contenu de la leçon ici..." },
          { id: "l2", title: "Working with Forms", content: "Contenu de la leçon ici..." }
        ]
      }
    ],
    instructors: [
      { id: "i1", name: "Sarah Johnson", bio: "Web developer with 8 years of experience." }
    ]
  }
];

const CourseEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulating API call to fetch course data
    setIsLoading(true);
    
    setTimeout(() => {
      const foundCourse = mockCourses.find(c => c.id === id);
      
      if (foundCourse) {
        setCourse(foundCourse);
        setTitle(foundCourse.title);
        setDescription(foundCourse.description);
        setLongDescription(foundCourse.longDescription);
        setPrice(foundCourse.price.toString());
        setLevel(foundCourse.level);
        setDuration(foundCourse.duration);
        setModules(foundCourse.modules);
      }
      
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulating API call to update course
    setTimeout(() => {
      toast({
        title: "Modifications enregistrées",
        description: "Les modifications du cours ont été enregistrées avec succès.",
      });
      
      setIsSaving(false);
    }, 800);
  };
  
  const handleDeleteCourse = () => {
    // Simulating API call to delete course
    setTimeout(() => {
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });
      
      setDeleteDialogOpen(false);
      navigate("/dashboard/courses/manage");
    }, 500);
  };
  
  const addModule = () => {
    const newModule = {
      id: `m${Date.now()}`,
      title: "Nouveau module",
      lessons: []
    };
    
    setModules([...modules, newModule]);
  };
  
  const updateModule = (moduleId: string, field: string, value: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, [field]: value } : m
    ));
  };
  
  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };
  
  const addLesson = (moduleId: string) => {
    const newLesson = {
      id: `l${Date.now()}`,
      title: "Nouvelle leçon",
      content: ""
    };
    
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, lessons: [...m.lessons, newLesson] } 
        : m
    ));
  };
  
  const updateLesson = (moduleId: string, lessonId: string, field: string, value: string) => {
    setModules(modules.map(m => 
      m.id === moduleId 
        ? {
            ...m,
            lessons: m.lessons.map((l: any) => 
              l.id === lessonId ? { ...l, [field]: value } : l
            )
          }
        : m
    ));
  };
  
  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, lessons: m.lessons.filter((l: any) => l.id !== lessonId) } 
        : m
    ));
  };
  
  if (isLoading) {
    return (
      <>
        <Header />
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-center">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </DashboardLayout>
        <Footer />
      </>
    );
  }
  
  if (!course) {
    return (
      <>
        <Header />
        <DashboardLayout>
          <Alert className="bg-red-50 border-red-200">
            <AlertTitle>Cours introuvable</AlertTitle>
            <AlertDescription>
              Le cours demandé n'existe pas ou vous n'avez pas l'autorisation d'y accéder.
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/dashboard/courses/manage")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste des cours
          </Button>
        </DashboardLayout>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="p-1 -ml-1" 
                onClick={() => navigate("/dashboard/courses/manage")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold">Modifier le cours</h1>
            </div>
            <p className="text-gray-600 mt-2">{title}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(true)}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-learnup-blue1 hover:bg-learnup-blue2"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Informations de base</TabsTrigger>
            <TabsTrigger value="content">Contenu du cours</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
                <CardDescription>Informations générales sur le cours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du cours</Label>
                    <Input 
                      id="title" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description courte</Label>
                    <Input 
                      id="description" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longDescription">Description détaillée</Label>
                    <Textarea 
                      id="longDescription" 
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      rows={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du cours</CardTitle>
                <CardDescription>Caractéristiques et prix du cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input 
                      id="price" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="level">Niveau</Label>
                    <select
                      id="level"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full h-10 px-3 py-2 border rounded-md"
                    >
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="advanced">Avancé</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée</Label>
                    <Input 
                      id="duration" 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Ex: 8 weeks"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Modules & Leçons</h2>
              <Button onClick={addModule}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un module
              </Button>
            </div>
            
            {modules.length > 0 ? (
              <div className="space-y-6">
                {modules.map((module) => (
                  <Card key={module.id} className="border-l-4 border-learnup-blue1">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="w-full pr-8">
                          <Input 
                            value={module.title}
                            onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                            className="font-medium text-lg"
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1"
                          onClick={() => deleteModule(module.id)}
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {module.lessons.map((lesson: any) => (
                          <div key={lesson.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="w-full pr-8">
                                <Input 
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                  className="text-sm font-medium"
                                />
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1 -mt-1"
                                onClick={() => deleteLesson(module.id, lesson.id)}
                              >
                                <X className="h-4 w-4 text-gray-500" />
                              </Button>
                            </div>
                            <Textarea 
                              value={lesson.content || ""}
                              onChange={(e) => updateLesson(module.id, lesson.id, 'content', e.target.value)}
                              placeholder="Contenu de la leçon ici..."
                              className="text-sm mt-2"
                              rows={3}
                            />
                          </div>
                        ))}
                        
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => addLesson(module.id)}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Ajouter une leçon
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-dashed p-6">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Ce cours n'a pas encore de modules</p>
                  <Button onClick={addModule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter votre premier module
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de visibilité</CardTitle>
                <CardDescription>Contrôlez qui peut voir et accéder à ce cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isPublic" className="h-4 w-4 rounded" />
                    <Label htmlFor="isPublic">Cours public</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isFeatured" className="h-4 w-4 rounded" />
                    <Label htmlFor="isFeatured">Cours mis en avant</Label>
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="publishDate">Date de publication</Label>
                    <Input 
                      id="publishDate"
                      type="date" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Options avancées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="border-red-300 text-red-600 hover:bg-red-50 w-full justify-center"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer le cours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible et supprimera définitivement ce cours de la plateforme.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteCourse}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default CourseEditPage;
