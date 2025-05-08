
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, FileText, Video, Download, Trash2, Edit, Book, File, Image, MoreHorizontal } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "document" | "video" | "image" | "link";
  format?: string;
  size?: string;
  url: string;
  courseId?: string;
  tags: string[];
  createdAt: string;
}

const ManageResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    title: "",
    description: "",
    type: "document",
    url: "",
    tags: []
  });
  
  const initialResources: Resource[] = [
    {
      id: "r1",
      title: "Introduction au HTML5",
      description: "Un guide complet sur les bases du HTML5 pour débutants",
      type: "document",
      format: "PDF",
      size: "2.4 MB",
      url: "#",
      courseId: "c1",
      tags: ["html", "web", "débutant"],
      createdAt: "2023-05-15"
    },
    {
      id: "r2",
      title: "CSS Flexbox Tutorial",
      description: "Tutoriel vidéo expliquant le modèle Flexbox en CSS",
      type: "video",
      format: "MP4",
      size: "45 MB",
      url: "#",
      courseId: "c1",
      tags: ["css", "flexbox", "layout"],
      createdAt: "2023-05-20"
    },
    {
      id: "r3",
      title: "Cheat Sheet JavaScript",
      description: "Document de référence rapide pour les fonctions JavaScript courantes",
      type: "document",
      format: "PDF",
      size: "1.2 MB",
      url: "#",
      courseId: "c1",
      tags: ["javascript", "référence"],
      createdAt: "2023-06-01"
    },
    {
      id: "r4",
      title: "Diagramme d'architecture React",
      description: "Schéma illustrant l'architecture et le flux de données dans React",
      type: "image",
      format: "PNG",
      size: "842 KB",
      url: "#",
      courseId: "c3",
      tags: ["react", "architecture"],
      createdAt: "2023-06-10"
    },
    {
      id: "r5",
      title: "Documentation API Python",
      description: "Lien vers la documentation officielle de l'API Python pour le traitement de données",
      type: "link",
      url: "https://docs.python.org/3/",
      courseId: "c2",
      tags: ["python", "api", "documentation"],
      createdAt: "2023-06-15"
    }
  ];
  
  const [resources, setResources] = useState<Resource[]>(initialResources);
  
  const courses = [
    { id: "c1", title: "Web Development Fundamentals" },
    { id: "c2", title: "Data Science and Machine Learning" },
    { id: "c3", title: "Frontend Development with React" }
  ];
  
  const getCourseTitle = (courseId?: string) => {
    if (!courseId) return "Non assigné";
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : "Cours inconnu";
  };
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'image': return <Image className="h-5 w-5" />;
      case 'link': return <Book className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };
  
  const filteredResources = resources
    .filter(resource => {
      if (activeTab === "all") return true;
      return resource.type === activeTab;
    })
    .filter(resource => {
      if (!searchQuery) return true;
      return (
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  
  const handleAddResource = () => {
    const id = `r${resources.length + 1}`;
    const newResourceWithId = {
      ...newResource,
      id,
      tags: newResource.tags || [],
      createdAt: new Date().toISOString().split('T')[0]
    } as Resource;
    
    setResources([...resources, newResourceWithId]);
    setIsAddDialogOpen(false);
    setNewResource({
      title: "",
      description: "",
      type: "document",
      url: "",
      tags: []
    });
    
    toast({
      title: "Ressource ajoutée",
      description: "La ressource a été ajoutée avec succès."
    });
  };
  
  const handleUpdateResource = () => {
    if (!selectedResource) return;
    
    setResources(
      resources.map(resource => 
        resource.id === selectedResource.id ? selectedResource : resource
      )
    );
    
    setSelectedResource(null);
    
    toast({
      title: "Ressource mise à jour",
      description: "La ressource a été mise à jour avec succès."
    });
  };
  
  const handleDeleteResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
    
    toast({
      title: "Ressource supprimée",
      description: "La ressource a été supprimée avec succès."
    });
  };
  
  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
  };
  
  const handleNewResourceChange = (
    field: keyof Resource,
    value: string | string[] | undefined
  ) => {
    setNewResource({
      ...newResource,
      [field]: value
    });
  };
  
  const handleSelectedResourceChange = (
    field: keyof Resource,
    value: string | string[] | undefined
  ) => {
    if (!selectedResource) return;
    
    setSelectedResource({
      ...selectedResource,
      [field]: value
    });
  };
  
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>, isNew: boolean) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      const input = e.currentTarget;
      const tag = input.value.trim().toLowerCase();
      
      if (tag && !tag.includes(',')) {
        if (isNew) {
          setNewResource({
            ...newResource,
            tags: [...(newResource.tags || []), tag]
          });
        } else if (selectedResource) {
          setSelectedResource({
            ...selectedResource,
            tags: [...selectedResource.tags, tag]
          });
        }
        input.value = '';
      }
    }
  };
  
  const removeTag = (tag: string, isNew: boolean) => {
    if (isNew) {
      setNewResource({
        ...newResource,
        tags: (newResource.tags || []).filter(t => t !== tag)
      });
    } else if (selectedResource) {
      setSelectedResource({
        ...selectedResource,
        tags: selectedResource.tags.filter(t => t !== tag)
      });
    }
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Ressources Pédagogiques</h1>
            <p className="text-gray-600 mt-2">Gérez les ressources pour vos cours</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une Ressource
          </Button>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher des ressources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="document">Documents</TabsTrigger>
              <TabsTrigger value="video">Vidéos</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="link">Liens</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Mes Ressources</CardTitle>
            <CardDescription>
              {filteredResources.length} ressource{filteredResources.length !== 1 ? 's' : ''} trouvée{filteredResources.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredResources.length > 0 ? (
              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="flex flex-col md:flex-row border rounded-md p-4 hover:border-primary transition-colors">
                    <div className="flex items-center gap-4 mb-4 md:mb-0 md:flex-1">
                      <div className={`p-3 rounded-full 
                        ${resource.type === 'document' ? 'bg-blue-100 text-blue-600' : ''}
                        ${resource.type === 'video' ? 'bg-red-100 text-red-600' : ''}
                        ${resource.type === 'image' ? 'bg-green-100 text-green-600' : ''}
                        ${resource.type === 'link' ? 'bg-purple-100 text-purple-600' : ''}
                      `}>
                        {getResourceIcon(resource.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{resource.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{resource.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="text-sm text-right">
                        <div>{getCourseTitle(resource.courseId)}</div>
                        {resource.format && resource.size && (
                          <div className="text-gray-500">{resource.format} • {resource.size}</div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 self-end md:self-auto">
                        <Button variant="outline" size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Télécharger
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditResource(resource)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <File className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Aucune ressource trouvée</h3>
                <p className="text-gray-500 mb-6">
                  Aucune ressource ne correspond à vos critères de recherche.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une ressource
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      
        {/* Add Resource Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter une ressource</DialogTitle>
              <DialogDescription>
                Créez une nouvelle ressource pédagogique pour vos étudiants.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Titre
                </Label>
                <Input
                  id="title"
                  placeholder="Titre de la ressource"
                  className="col-span-3"
                  value={newResource.title}
                  onChange={(e) => handleNewResourceChange('title', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brève description de la ressource"
                  className="col-span-3"
                  value={newResource.description}
                  onChange={(e) => handleNewResourceChange('description', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newResource.type}
                  onValueChange={(value) => handleNewResourceChange('type', value)}
                >
                  <SelectTrigger id="type" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="link">Lien</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  placeholder="Lien vers la ressource"
                  className="col-span-3"
                  value={newResource.url}
                  onChange={(e) => handleNewResourceChange('url', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="course" className="text-right">
                  Cours
                </Label>
                <Select
                  value={newResource.courseId}
                  onValueChange={(value) => handleNewResourceChange('courseId', value)}
                >
                  <SelectTrigger id="course" className="col-span-3">
                    <SelectValue placeholder="Associer à un cours" />
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
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="tags" className="text-right pt-2">
                  Tags
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex flex-wrap gap-1 mb-1">
                    {(newResource.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button 
                          onClick={() => removeTag(tag, true)} 
                          className="ml-1 text-xs hover:bg-gray-200 rounded-full w-4 h-4 inline-flex items-center justify-center"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    id="tags"
                    placeholder="Ajouter des tags (Entrée pour valider)"
                    onKeyDown={(e) => handleTagInput(e, true)}
                  />
                  <p className="text-xs text-gray-500">
                    Appuyez sur Entrée ou virgule pour ajouter un tag
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddResource}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Resource Dialog */}
        <Dialog open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Modifier la ressource</DialogTitle>
              <DialogDescription>
                Modifiez les détails de votre ressource pédagogique.
              </DialogDescription>
            </DialogHeader>
            
            {selectedResource && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    Titre
                  </Label>
                  <Input
                    id="edit-title"
                    placeholder="Titre de la ressource"
                    className="col-span-3"
                    value={selectedResource.title}
                    onChange={(e) => handleSelectedResourceChange('title', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Brève description de la ressource"
                    className="col-span-3"
                    value={selectedResource.description}
                    onChange={(e) => handleSelectedResourceChange('description', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={selectedResource.type}
                    onValueChange={(value) => handleSelectedResourceChange('type', value as "document" | "video" | "image" | "link")}
                  >
                    <SelectTrigger id="edit-type" className="col-span-3">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="video">Vidéo</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="link">Lien</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="edit-url"
                    placeholder="Lien vers la ressource"
                    className="col-span-3"
                    value={selectedResource.url}
                    onChange={(e) => handleSelectedResourceChange('url', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-course" className="text-right">
                    Cours
                  </Label>
                  <Select
                    value={selectedResource.courseId}
                    onValueChange={(value) => handleSelectedResourceChange('courseId', value)}
                  >
                    <SelectTrigger id="edit-course" className="col-span-3">
                      <SelectValue placeholder="Associer à un cours" />
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
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-tags" className="text-right pt-2">
                    Tags
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {selectedResource.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button 
                            onClick={() => removeTag(tag, false)} 
                            className="ml-1 text-xs hover:bg-gray-200 rounded-full w-4 h-4 inline-flex items-center justify-center"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      id="edit-tags"
                      placeholder="Ajouter des tags (Entrée pour valider)"
                      onKeyDown={(e) => handleTagInput(e, false)}
                    />
                    <p className="text-xs text-gray-500">
                      Appuyez sur Entrée ou virgule pour ajouter un tag
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedResource(null)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateResource}>
                Enregistrer les modifications
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ManageResourcesPage;
