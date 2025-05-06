
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const ManageCoursesPage: React.FC = () => {
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Cours</h1>
            <p className="text-gray-600 mt-2">Créez et gérez vos cours</p>
          </div>
          <Button>Créer un Nouveau Cours</Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mes Cours</CardTitle>
            <CardDescription>Liste de vos cours actifs</CardDescription>
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
