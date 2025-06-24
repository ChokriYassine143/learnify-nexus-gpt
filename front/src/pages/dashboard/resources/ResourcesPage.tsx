import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { File, Book, Video, Image, Plus, ChevronDown, Search, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { resourceService } from "@/services/resourceService";
import { useToast } from "@/hooks/use-toast";
import { Resource } from "@/types";

const INITIAL_RESOURCE_TYPES = [
  {
    id: 'documents',
    title: "Documents",
    description: "PDF, DOCX, TXT, etc.",
    icon: <File className="h-8 w-8" />,
    count: 0,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 'videos',
    title: "Vidéos",
    description: "MP4, AVI, MOV, etc.",
    icon: <Video className="h-8 w-8" />,
    count: 0,
    color: "bg-red-100 text-red-600"
  },
  {
    id: 'images',
    title: "Images",
    description: "PNG, JPG, SVG, etc.",
    icon: <Image className="h-8 w-8" />,
    count: 0,
    color: "bg-green-100 text-green-600"
  },
  {
    id: 'links',
    title: "Liens",
    description: "URLs, ressources externes",
    icon: <Book className="h-8 w-8" />,
    count: 0,
    color: "bg-purple-100 text-purple-600"
  }
];

const ResourcesPage: React.FC = () => {
  const { toast } = useToast();
  const [visibleResources, setVisibleResources] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceTypes, setResourceTypes] = useState(INITIAL_RESOURCE_TYPES);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const loadedResources = await resourceService.getAllResources();
      // Normalize resource IDs and ensure type safety
      const normalizedResources = loadedResources.map(resource => {
        const id = resource.id || (resource as any)._id;
        if (!id) {
          console.warn('Resource missing ID:', resource);
          return null;
        }
        return {
          ...resource,
          id
        };
      }).filter((resource): resource is Resource => resource !== null);
      
      setResources(normalizedResources);
      
      // Update resource type counts
      const updatedTypes = INITIAL_RESOURCE_TYPES.map(type => ({
        ...type,
        count: normalizedResources.filter(r => r.type === type.id).length
      }));
      setResourceTypes(updatedTypes);
    } catch (error) {
      console.error("Error loading resources:", error);
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleDeleteResource = async (resourceId: string) => {
    if (!resourceId) return;
    
    setIsDeleting(true);
    try {
      await resourceService.deleteResource(resourceId);
      setResources(prev => prev.filter(r => r.id !== resourceId));
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
      // Reload resources to update counts
      await loadResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter resources based on search and type filter
  const filteredResources = resources.filter(resource => {
    if (!resource.id) return false; // Skip resources without an ID
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? resource.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  // Get subset of resources to display
  const resourcesToShow = filteredResources.slice(0, visibleResources);

  const handleLoadMore = () => {
    setVisibleResources(prev => Math.min(prev + 3, filteredResources.length));
  };

  const handleFilterByType = (type: string) => {
    setSelectedType(type === selectedType ? null : type);
    setVisibleResources(3); // Reset visible resources when filter changes
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Ressources Pédagogiques</h1>
            <p className="text-gray-600 mt-2">Gérez les ressources pour vos cours</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="search"
                placeholder="Rechercher une ressource..."
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Link to="/dashboard/resources/manage" className="flex items-center">
                Gérer les Ressources
              </Link>
            </Button>
            <Button>
              <Link to="/dashboard/resources/manage" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une Ressource
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {resourceTypes.map((type) => (
            <Card 
              key={type.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                selectedType === type.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleFilterByType(type.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-4 rounded-full ${type.color} mb-4`}>
                    {type.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{type.title}</h3>
                  <p className="text-gray-600 mb-3">{type.description}</p>
                  <p className="text-2xl font-semibold">{type.count}</p>
                  <p className="text-gray-500 text-sm">ressources</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ressources récentes</CardTitle>
              <CardDescription>Documents, vidéos et présentations récemment ajoutés</CardDescription>
            </div>
            {selectedType && (
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedType(null)}
              >
                {selectedType} ×
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Chargement des ressources...
              </div>
            ) : (
              <div className="space-y-4">
                {resourcesToShow.length > 0 ? (
                  resourcesToShow.map((resource) => {
                    const ResourceIcon = File;
                    
                    let iconColorClass = "";
                    switch (resource.type) {
                      case "document": iconColorClass = "bg-blue-100 text-blue-600"; break;
                      case "video": iconColorClass = "bg-red-100 text-red-600"; break;
                      case "link": iconColorClass = "bg-purple-100 text-purple-600"; break;
                      case "other": iconColorClass = "bg-green-100 text-green-600"; break;
                    }
                    
                    return (
                      <div key={`resource-${resource.id}`} className="border rounded-md p-4 flex items-start animate-fade-in">
                        <div className={`p-2 rounded-full ${iconColorClass}`}>
                          {ResourceIcon && <ResourceIcon className="h-5 w-5" />}
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span>{resource.type} {resource.size ? `• ${resource.size}` : ''}</span>
                            <span className="mx-2">•</span>
                            <span>Ajouté le {new Date(resource.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteResource(resource.id);
                            }}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div key="no-resources" className="text-center py-8 text-gray-500">
                    Aucune ressource trouvée pour cette recherche
                  </div>
                )}
              </div>
            )}
            
            {!isLoading && filteredResources.length > visibleResources && (
              <div className="mt-6 text-center">
                <Button 
                  onClick={handleLoadMore}
                  variant="outline"
                  className="gap-2"
                >
                  <span>Charger plus de ressources</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Button asChild>
                <Link to="/dashboard/resources/manage">
                  Voir toutes les ressources
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ResourcesPage;
