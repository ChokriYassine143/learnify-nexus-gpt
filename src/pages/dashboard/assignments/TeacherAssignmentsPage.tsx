
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Check, X, Clock, Search, Filter, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Example student assignment data
const mockStudentAssignments = [
  {
    id: "sa1",
    title: "Projet Portfolio",
    courseTitle: "Web Development Fundamentals",
    studentName: "Jean Dupont",
    studentEmail: "jean.dupont@example.com",
    submissionDate: "2023-12-10",
    dueDate: "2023-12-15",
    status: "submitted",
    grade: null
  },
  {
    id: "sa2",
    title: "Projet Portfolio",
    courseTitle: "Web Development Fundamentals",
    studentName: "Marie Lambert",
    studentEmail: "marie.lambert@example.com",
    submissionDate: null,
    dueDate: "2023-12-15",
    status: "pending",
    grade: null
  },
  {
    id: "sa3",
    title: "Créer une API REST",
    courseTitle: "Backend Development",
    studentName: "Pierre Martin",
    studentEmail: "pierre.martin@example.com",
    submissionDate: "2023-11-28",
    dueDate: "2023-11-30",
    status: "graded",
    grade: "A"
  },
  {
    id: "sa4",
    title: "Créer une API REST",
    courseTitle: "Backend Development",
    studentName: "Sophie Dubois",
    studentEmail: "sophie.dubois@example.com",
    submissionDate: "2023-11-29",
    dueDate: "2023-11-30",
    status: "submitted",
    grade: null
  }
];

const TeacherAssignmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const [studentAssignments, setStudentAssignments] = useState(mockStudentAssignments);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [grade, setGrade] = useState("");

  const handleGradeAssignment = (assignmentId: string) => {
    const assignment = studentAssignments.find(a => a.id === assignmentId);
    setSelectedAssignment(assignment);
    setGrade(assignment?.grade || "");
    setGradeDialogOpen(true);
  };

  const submitGrade = () => {
    if (selectedAssignment) {
      setStudentAssignments(prev => 
        prev.map(assignment => 
          assignment.id === selectedAssignment.id 
            ? { ...assignment, status: "graded", grade } 
            : assignment
        )
      );
      
      toast({
        title: "Note attribuée",
        description: `La note a été attribuée à ${selectedAssignment.studentName}.`,
      });
      
      setGradeDialogOpen(false);
    }
  };

  const filteredAssignments = studentAssignments.filter(assignment => {
    // Filter by tab
    if (activeTab !== "all" && assignment.status !== activeTab) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        assignment.title.toLowerCase().includes(query) ||
        assignment.courseTitle.toLowerCase().includes(query) ||
        assignment.studentName.toLowerCase().includes(query) ||
        assignment.studentEmail.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Devoirs des Étudiants</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gérez et notez les devoirs soumis par les étudiants</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrer</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="pending">À faire</TabsTrigger>
              <TabsTrigger value="submitted">Soumis</TabsTrigger>
              <TabsTrigger value="graded">Notés</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className={`bg-gray-50 dark:bg-gray-800 ${
                    assignment.status === "graded" ? "border-l-4 border-green-500" :
                    assignment.status === "submitted" ? "border-l-4 border-blue-500" : 
                    "border-l-4 border-yellow-500"
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription className="mt-1">{assignment.courseTitle}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        {assignment.status === "graded" ? (
                          <span className="flex items-center text-green-600 text-sm font-medium">
                            <Check className="mr-1 h-4 w-4" /> Noté: {assignment.grade}
                          </span>
                        ) : assignment.status === "submitted" ? (
                          <span className="flex items-center text-blue-600 text-sm font-medium">
                            <Check className="mr-1 h-4 w-4" /> Soumis
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-600 text-sm font-medium">
                            <Clock className="mr-1 h-4 w-4" /> En attente
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Étudiant:</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {assignment.studentName} ({assignment.studentEmail})
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <h3 className="text-sm font-medium mb-1">Dates:</h3>
                        <div className="text-gray-700 dark:text-gray-300">
                          <p>À rendre: {assignment.dueDate}</p>
                          {assignment.submissionDate && (
                            <p>Soumis: {assignment.submissionDate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Téléchargement",
                            description: "Téléchargement du travail en cours...",
                          });
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger le travail
                      </Button>
                      
                      {assignment.status !== "graded" && assignment.status !== "pending" && (
                        <Button onClick={() => handleGradeAssignment(assignment.id)}>
                          Noter le devoir
                        </Button>
                      )}
                      
                      {assignment.status === "graded" && (
                        <Button
                          variant="outline"
                          onClick={() => handleGradeAssignment(assignment.id)}
                        >
                          Modifier la note
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
                    Il n'y a pas de devoirs dans cette catégorie pour le moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Grade Assignment Dialog */}
        <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Attribuer une note</DialogTitle>
              <DialogDescription>
                Attribuez une note au devoir de {selectedAssignment?.studentName}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="grade" className="text-sm font-medium">
                  Note
                </label>
                <input
                  id="grade"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Ex: A, B, C ou 18/20"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGradeDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={submitGrade}>Enregistrer la note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default TeacherAssignmentsPage;
