
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Check, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

// Example assignment data - this would come from an API in a real application
const mockAssignments = [
  {
    id: "a1",
    title: "Projet Portfolio",
    courseTitle: "Web Development Fundamentals",
    description: "Créez un portfolio personnel utilisant HTML, CSS et JavaScript. Votre portfolio doit inclure une page d'accueil, une page à propos, et une galerie de projets.",
    dueDate: "2023-12-15",
    status: "pending"
  },
  {
    id: "a2",
    title: "Créer une API REST",
    courseTitle: "Backend Development",
    description: "Développez une API REST simple avec Node.js et Express qui permet de créer, lire, mettre à jour et supprimer des ressources.",
    dueDate: "2023-11-30",
    status: "in-progress"
  },
  {
    id: "a3",
    title: "Analyse de données",
    courseTitle: "Data Science Introduction",
    description: "Utilisez Python pour analyser un ensemble de données et créer des visualisations pertinentes.",
    dueDate: "2023-12-20",
    status: "completed"
  }
];

const AssignmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();
  const [assignments, setAssignments] = useState(mockAssignments);

  const handleSubmitAssignment = (assignmentId: string, file?: File) => {
    // In a real application, this would upload the file to a server
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: "completed" } 
          : assignment
      )
    );
    
    toast({
      title: "Devoir soumis",
      description: "Votre devoir a été soumis avec succès.",
    });
  };

  const handleStartWorking = (assignmentId: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: "in-progress" } 
          : assignment
      )
    );
    
    toast({
      title: "Statut mis à jour",
      description: "Le devoir a été marqué comme 'En cours'.",
    });
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === "all") return true;
    return assignment.status === activeTab;
  });

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mes Devoirs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gérez et soumettez vos devoirs assignés</p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="pending">À faire</TabsTrigger>
              <TabsTrigger value="in-progress">En cours</TabsTrigger>
              <TabsTrigger value="completed">Complétés</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription className="mt-1">{assignment.courseTitle}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        {assignment.status === "completed" ? (
                          <span className="flex items-center text-green-600 text-sm font-medium">
                            <Check className="mr-1 h-4 w-4" /> Complété
                          </span>
                        ) : (
                          <span className="flex items-center text-orange-500 text-sm font-medium">
                            <Clock className="mr-1 h-4 w-4" /> 
                            Date limite: {assignment.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Instructions:</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {assignment.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      {assignment.status === "pending" && (
                        <Button
                          variant="outline"
                          onClick={() => handleStartWorking(assignment.id)}
                        >
                          Commencer à travailler
                        </Button>
                      )}
                      
                      {assignment.status !== "completed" && (
                        <Button onClick={() => handleSubmitAssignment(assignment.id)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Soumettre le devoir
                        </Button>
                      )}
                      
                      {assignment.status === "completed" && (
                        <Button variant="outline" disabled>
                          Déjà soumis
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Aucun devoir trouvé</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Vous n'avez pas de devoirs dans cette catégorie pour le moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default AssignmentsPage;
