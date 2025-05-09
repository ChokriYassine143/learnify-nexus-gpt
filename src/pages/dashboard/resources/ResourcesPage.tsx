
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { File, Book, Video, Image, Plus, ChevronDown, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Extended mock data
const allResources = [
  {
    id: "1",
    title: "Introduction au HTML5",
    description: "Un guide complet sur les bases du HTML5 pour débutants",
    type: "document",
    format: "PDF",
    size: "2.4 MB",
    date: "15 Mai 2023",
    icon: File,
    action: "Télécharger"
  },
  {
    id: "2",
    title: "CSS Flexbox Tutorial",
    description: "Tutoriel vidéo expliquant le modèle Flexbox en CSS",
    type: "video",
    format: "MP4",
    size: "45 MB",
    date: "20 Mai 2023",
    icon: Video,
    action: "Regarder"
  },
  {
    id: "3",
    title: "Diagramme d'architecture React",
    description: "Schéma illustrant l'architecture et le flux de données dans React",
    type: "image",
    format: "PNG",
    size: "842 KB",
    date: "10 Juin 2023",
    icon: Image,
    action: "Afficher"
  },
  {
    id: "4",
    title: "Guide JavaScript Avancé",
    description: "Documentation sur les fonctionnalités avancées de JavaScript ES6+",
    type: "document",
    format: "PDF",
    size: "3.7 MB",
    date: "5 Juillet 2023",
    icon: File,
    action: "Télécharger"
  },
  {
    id: "5",
    title: "Tutoriel GraphQL",
    description: "Une introduction à GraphQL et comment l'utiliser avec React",
    type: "video",
    format: "MP4",
    size: "78 MB",
    date: "12 Juillet 2023",
    icon: Video,
    action: "Regarder"
  },
  {
    id: "6",
    title: "Patrons de conception en React",
    description: "Schémas des patrons de conception courants en React",
    type: "link",
    url: "https://reactpatterns.dev",
    date: "22 Juillet 2023",
    icon: Book,
    action: "Visiter"
  },
  {
    id: "7",
    title: "TypeScript Cheatsheet",
    description: "Référence rapide pour TypeScript",
    type: "document",
    format: "PDF",
    size: "1.2 MB",
    date: "1 Août 2023",
    icon: File,
    action: "Télécharger"
  },
  {
    id: "8",
    title: "Animation CSS Avancée",
    description: "Techniques d'animation CSS pour des interfaces utilisateur dynamiques",
    type: "video",
    format: "MP4",
    size: "62 MB",
    date: "15 Août 2023",
    icon: Video,
    action: "Regarder"
  }
];

const resourceTypes = [
  {
    title: "Documents",
    description: "PDF, DOCX, TXT, etc.",
    icon: <File className="h-8 w-8" />,
    count: 12,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Vidéos",
    description: "MP4, AVI, MOV, etc.",
    icon: <Video className="h-8 w-8" />,
    count: 8,
    color: "bg-red-100 text-red-600"
  },
  {
    title: "Images",
    description: "PNG, JPG, SVG, etc.",
    icon: <Image className="h-8 w-8" />,
    count: 24,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Liens",
    description: "URLs, ressources externes",
    icon: <Book className="h-8 w-8" />,
    count: 15,
    color: "bg-purple-100 text-purple-600"
  }
];

const ResourcesPage: React.FC = () => {
  const [visibleResources, setVisibleResources] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Filter resources based on search and type filter
  const filteredResources = allResources.filter(resource => {
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
          {resourceTypes.map((type, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                selectedType === type.title.toLowerCase() ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleFilterByType(type.title.toLowerCase())}
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
            <div className="space-y-4">
              {resourcesToShow.length > 0 ? (
                resourcesToShow.map((resource) => {
                  const ResourceIcon = resource.icon;
                  
                  let iconColorClass = "";
                  switch (resource.type) {
                    case "document": iconColorClass = "bg-blue-100 text-blue-600"; break;
                    case "video": iconColorClass = "bg-red-100 text-red-600"; break;
                    case "image": iconColorClass = "bg-green-100 text-green-600"; break;
                    case "link": iconColorClass = "bg-purple-100 text-purple-600"; break;
                  }
                  
                  return (
                    <div key={resource.id} className="border rounded-md p-4 flex items-start animate-fade-in">
                      <div className={`p-2 rounded-full ${iconColorClass}`}>
                        <ResourceIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>{resource.format || resource.type} {resource.size ? `• ${resource.size}` : ''}</span>
                          <span className="mx-2">•</span>
                          <span>Ajouté le {resource.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        {resource.action}
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucune ressource trouvée pour cette recherche
                </div>
              )}
            </div>
            
            {filteredResources.length > visibleResources && (
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
