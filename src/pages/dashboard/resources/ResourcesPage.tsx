
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Book, Video, Image, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const ResourcesPage: React.FC = () => {
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
            <Button variant="outline" asChild>
              <Link to="/dashboard/resources/manage">
                Gérer les Ressources
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/resources/manage">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une Ressource
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {resourceTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
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
          <CardHeader>
            <CardTitle>Ressources récentes</CardTitle>
            <CardDescription>Documents, vidéos et présentations récemment ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4 flex items-start">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <File className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium">Introduction au HTML5</h4>
                  <p className="text-sm text-gray-600">Un guide complet sur les bases du HTML5 pour débutants</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>PDF • 2.4 MB</span>
                    <span className="mx-2">•</span>
                    <span>Ajouté le 15 Mai 2023</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  Télécharger
                </Button>
              </div>

              <div className="border rounded-md p-4 flex items-start">
                <div className="p-2 rounded-full bg-red-100 text-red-600">
                  <Video className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium">CSS Flexbox Tutorial</h4>
                  <p className="text-sm text-gray-600">Tutoriel vidéo expliquant le modèle Flexbox en CSS</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>MP4 • 45 MB</span>
                    <span className="mx-2">•</span>
                    <span>Ajouté le 20 Mai 2023</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  Regarder
                </Button>
              </div>

              <div className="border rounded-md p-4 flex items-start">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <Image className="h-5 w-5" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium">Diagramme d'architecture React</h4>
                  <p className="text-sm text-gray-600">Schéma illustrant l'architecture et le flux de données dans React</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>PNG • 842 KB</span>
                    <span className="mx-2">•</span>
                    <span>Ajouté le 10 Juin 2023</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  Afficher
                </Button>
              </div>
            </div>
            
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
