
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

const ManageCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Cours</h1>
            <p className="text-gray-600 mt-2">
              {isAdmin ? "Gérez tous les cours sur la plateforme" : "Créez et gérez vos cours"}
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Créer un Nouveau Cours
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mes Cours</CardTitle>
            <CardDescription>
              {isAdmin ? "Liste de tous les cours actifs" : "Liste de vos cours actifs"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-gray-500">
              Cette section sera complétée dans le sprint 2
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ManageCoursesPage;
