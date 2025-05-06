
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const ManageQuizzesPage: React.FC = () => {
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Quiz et Devoirs</h1>
            <p className="text-gray-600 mt-2">Créez et gérez les évaluations</p>
          </div>
          <div className="flex gap-4">
            <Button>Créer un Quiz</Button>
            <Button variant="outline">Créer un Devoir</Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mes Quiz</CardTitle>
            <CardDescription>Quiz que vous avez créés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-gray-500">
              Cette section sera complétée dans le sprint 3
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mes Devoirs</CardTitle>
            <CardDescription>Devoirs que vous avez assignés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-gray-500">
              Cette section sera complétée dans le sprint 3
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ManageQuizzesPage;
