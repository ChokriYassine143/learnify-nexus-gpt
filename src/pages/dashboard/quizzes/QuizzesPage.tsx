
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const QuizzesPage: React.FC = () => {
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mes Quiz et Devoirs</h1>
          <p className="text-gray-600 mt-2">Accédez et complétez vos quiz et devoirs</p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quiz à Compléter</CardTitle>
            <CardDescription>Quiz assignés que vous devez compléter</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-gray-500">
              Cette section sera complétée dans le sprint 3
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Devoirs à Soumettre</CardTitle>
            <CardDescription>Devoirs en attente de soumission</CardDescription>
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

export default QuizzesPage;
