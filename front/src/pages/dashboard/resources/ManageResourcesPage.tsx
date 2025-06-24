import React, { useState, useEffect } from "react";
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
import { resourceService } from "@/services/resourceService";
import { courseService } from "@/services/courseService";
import { useAuth } from "@/contexts/AuthContext";
import { Resource as GlobalResource } from "@/types";

type Resource = GlobalResource;

function formatBytes(bytes?: number) {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

const ManageResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  
  const [newResource, setNewResource] = useState<Partial<Resource> & { moduleId?: string; lessonId?: string }>({
    title: "",
    description: "",
    type: "document",
    url: "",
    courseId: undefined,
    moduleId: undefined,
    lessonId: undefined,
  });
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [courses, setCourses] = useState([]);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedResources, loadedCourses] = await Promise.all([
          resourceService.getAllResources(),
          courseService.getAllCourses()
        ]);
        setResources(loadedResources);
        setCourses(loadedCourses);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load resources and courses",
          variant: "destructive"
        });
      }
    };
    loadData();
  }, []);
  
  const getCourseTitle = (courseId?: string) => {
    if (!courseId) return "Non assigné";
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : "Cours inconnu";
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
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  
  const handleAddResource = async () => {
    if (!newResource.url) {
      toast({
        title: "Error",
        description: "Please upload a file before adding the resource.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const newResourceWithId: Partial<Resource> = {
        ...newResource,
        courseId: newResource.courseId!,
        moduleId: newResource.moduleId!,
        uploadedBy: user?.id || "system",
        downloads: 0,
        size: typeof newResource.size === 'number' ? newResource.size : undefined,
        type: newResource.type as Resource["type"],
        url: newResource.url || "",
        description: newResource.description || "",
        title: newResource.title || "",
      };
      console.log('Creating resource:', newResourceWithId);
      const createdResource = await resourceService.createResource(newResourceWithId);
      setResources([...resources, createdResource]);
      setIsAddDialogOpen(false);
      setNewResource({
        title: "",
        description: "",
        type: "document",
        url: "",
        courseId: undefined,
        moduleId: undefined,
        lessonId: undefined,
      });
      toast({
        title: "Ressource ajoutée",
        description: "La ressource a été ajoutée avec succès."
      });
    } catch (error) {
      console.error("Error adding resource:", error);
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateResource = async () => {
    if (!selectedResource) return;
    setIsLoading(true);
    try {
      const updatedResource = await resourceService.updateResource(selectedResource.id, selectedResource);
      setResources(
        resources.map(resource =>
          resource.id === selectedResource.id ? updatedResource : resource
        )
      );
      setSelectedResource(null);
      toast({
        title: "Ressource mise à jour",
        description: "La ressource a été mise à jour avec succès."
      });
    } catch (error) {
      console.error("Error updating resource:", error);
      toast({
        title: "Error",
        description: "Failed to update resource. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteResource = async (id: string) => {
    setIsLoading(true);
    try {
      await resourceService.deleteResource(id);
      setResources(resources.filter(resource => resource.id !== id));
      toast({
        title: "Ressource supprimée",
        description: "La ressource a été supprimée avec succès."
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  const selectedCourse = courses.find(c => c.id === newResource.courseId);
  const selectedModule = selectedCourse?.modules.find(m => m.id === newResource.moduleId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Uploading file', file);

    // Validate file size (500MB limit)
    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size exceeds 500MB limit",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/api/resources/upload', true);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          console.log('Upload response:', data);
          let type: Resource["type"] = newResource.type || "document";
          
          if (file.type.startsWith("video/")) {
            type = "video";
          } else if (file.type === "application/pdf") {
            type = "document";
          }

          setNewResource({
            ...newResource,
            url: data.url,
            type,
            size: file.size,
          });

          toast({
            title: "Success",
            description: "File uploaded successfully",
          });
        } else {
          console.error('Upload failed:', xhr.responseText);
          toast({
            title: "Error",
            description: xhr.responseText || 'Upload failed',
            variant: "destructive"
          });
        }
      };

      xhr.onerror = () => {
        console.error('Network error occurred during upload');
        toast({
          title: "Error",
          description: 'Network error occurred during upload',
          variant: "destructive"
        });
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
                {filteredResources.map((resource, idx) => (
                  <div key={resource.id || idx} className="flex flex-col md:flex-row border rounded-md p-4 hover:border-primary transition-colors">
                    <div className="flex items-center gap-4 mb-4 md:mb-0 md:flex-1">
                      <div className={`p-3 rounded-full 
                        ${resource.type === 'document' ? 'bg-blue-100 text-blue-600' : ''}
                        ${resource.type === 'video' ? 'bg-red-100 text-red-600' : ''}
                        ${resource.type === 'link' ? 'bg-purple-100 text-purple-600' : ''}
                      `}>
                        {resource.type === 'document' && <FileText className="h-5 w-5" />}
                        {resource.type === 'video' && <Video className="h-5 w-5" />}
                        {resource.type === 'link' && <Book className="h-5 w-5" />}
                        {resource.type === 'other' && <File className="h-5 w-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{resource.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{resource.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="text-sm text-right">
                        <div>{getCourseTitle(resource.courseId)}</div>
                        {resource.size && (
                          <div className="text-gray-500">{formatBytes(resource.size)}</div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 self-end md:self-auto">
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
                    <SelectItem value="link">Lien</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {["document", "video"].includes(newResource.type || "") ? (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    Fichier
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="file"
                      type="file"
                      accept={
                        newResource.type === "video"
                          ? "video/mp4,video/webm,video/ogg"
                          : ".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                      }
                      className="mb-2"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Uploading: {uploadProgress}%
                      </p>
                    )}
                  </div>
                </div>
              ) : (
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
              )}
              
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
              
              {selectedCourse && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="module" className="text-right">Module</Label>
                  <Select
                    value={newResource.moduleId}
                    onValueChange={value => setNewResource(prev => ({ ...prev, moduleId: value, lessonId: undefined }))}
                  >
                    <SelectTrigger id="module" className="col-span-3">
                      <SelectValue placeholder="Associer à un module" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCourse.modules.map(module => (
                        <SelectItem key={module.id} value={module.id}>{module.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {selectedModule && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lesson" className="text-right">Leçon</Label>
                  <Select
                    value={newResource.lessonId}
                    onValueChange={value => setNewResource(prev => ({ ...prev, lessonId: value }))}
                  >
                    <SelectTrigger id="lesson" className="col-span-3">
                      <SelectValue placeholder="Associer à une leçon" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedModule.lessons.map(lesson => (
                        <SelectItem key={lesson.id} value={lesson.id}>{lesson.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                  <Label htmlFor="edit-title" className="text-right">Titre</Label>
                  <Input
                    id="edit-title"
                    placeholder="Titre de la ressource"
                    className="col-span-3"
                    value={selectedResource.title}
                    onChange={(e) => handleSelectedResourceChange('title', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">Description</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Brève description de la ressource"
                    className="col-span-3"
                    value={selectedResource.description}
                    onChange={(e) => handleSelectedResourceChange('description', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">Type</Label>
                  <Select
                    value={selectedResource.type}
                    onValueChange={(value) => handleSelectedResourceChange('type', value as "document" | "video" | "link" | "other")}
                  >
                    <SelectTrigger id="edit-type" className="col-span-3">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="video">Vidéo</SelectItem>
                      <SelectItem value="link">Lien</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {['document', 'video'].includes(selectedResource.type || '') ? (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-file" className="text-right">Fichier</Label>
                    <div className="col-span-3">
                      <Input
                        id="edit-file"
                        type="file"
                        accept={
                          selectedResource.type === "video"
                            ? "video/mp4,video/webm,video/ogg"
                            : ".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                        }
                        className="mb-2"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 500 * 1024 * 1024) {
                            toast({
                              title: "Error",
                              description: "File size exceeds 500MB limit",
                              variant: "destructive"
                            });
                            return;
                          }
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            setIsUploading(true);
                            setUploadProgress(0);
                            const xhr = new XMLHttpRequest();
                            xhr.open('POST', 'http://localhost:3000/api/resources/upload', true);
                            xhr.upload.onprogress = (event) => {
                              if (event.lengthComputable) {
                                const progress = Math.round((event.loaded * 100) / event.total);
                                setUploadProgress(progress);
                              }
                            };
                            xhr.onload = async () => {
                              if (xhr.status === 200) {
                                const data = JSON.parse(xhr.responseText);
                                let type: Resource["type"] = selectedResource.type || "document";
                                if (file.type.startsWith("video/")) type = "video";
                                else if (file.type === "application/pdf") type = "document";
                                setSelectedResource({
                                  ...selectedResource,
                                  url: data.url,
                                  type,
                                  size: file.size,
                                });
                                toast({
                                  title: "Success",
                                  description: "File uploaded successfully",
                                });
                              } else {
                                toast({
                                  title: "Error",
                                  description: xhr.responseText || 'Upload failed',
                                  variant: "destructive"
                                });
                              }
                            };
                            xhr.onerror = () => {
                              toast({
                                title: "Error",
                                description: 'Network error occurred during upload',
                                variant: "destructive"
                              });
                            };
                            xhr.send(formData);
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: error instanceof Error ? error.message : "Failed to upload file. Please try again.",
                              variant: "destructive"
                            });
                          } finally {
                            setIsUploading(false);
                            setUploadProgress(0);
                          }
                        }}
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Uploading: {uploadProgress}%
                        </p>
                      )}
                      {selectedResource.url && (
                        <div className="text-xs text-gray-500 mt-1">Fichier actuel: {selectedResource.url}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-url" className="text-right">URL</Label>
                    <Input
                      id="edit-url"
                      placeholder="Lien vers la ressource"
                      className="col-span-3"
                      value={selectedResource.url}
                      onChange={(e) => handleSelectedResourceChange('url', e.target.value)}
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-course" className="text-right">Cours</Label>
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
                {/* Module and lesson selectors for edit dialog */}
                {selectedResource.courseId && courses.find(c => c.id === selectedResource.courseId) && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-module" className="text-right">Module</Label>
                    <Select
                      value={selectedResource.moduleId}
                      onValueChange={value => setSelectedResource(prev => prev ? { ...prev, moduleId: value, lessonId: undefined } : prev)}
                    >
                      <SelectTrigger id="edit-module" className="col-span-3">
                        <SelectValue placeholder="Associer à un module" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.find(c => c.id === selectedResource.courseId)?.modules.map(module => (
                          <SelectItem key={module.id} value={module.id}>{module.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {selectedResource.courseId && selectedResource.moduleId && courses.find(c => c.id === selectedResource.courseId) && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-lesson" className="text-right">Leçon</Label>
                    <Select
                      value={selectedResource.lessonId}
                      onValueChange={value => setSelectedResource(prev => prev ? { ...prev, lessonId: value } : prev)}
                    >
                      <SelectTrigger id="edit-lesson" className="col-span-3">
                        <SelectValue placeholder="Associer à une leçon" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.find(c => c.id === selectedResource.courseId)?.modules.find(m => m.id === selectedResource.moduleId)?.lessons.map(lesson => (
                          <SelectItem key={lesson.id} value={lesson.id}>{lesson.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
