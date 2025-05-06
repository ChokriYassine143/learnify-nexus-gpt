
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const PaymentsPage: React.FC = () => {
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Paiement des Frais</h1>
          <p className="text-gray-600 mt-2">Gérez vos paiements et abonnements</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Abonnement Basique</CardTitle>
              <CardDescription>Accès limité aux cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">9,99 € / mois</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Accès à 5 cours</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Ressources de base</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Forum d'entraide</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Souscrire</Button>
            </CardFooter>
          </Card>
          
          <Card className="border-primary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Abonnement Premium</CardTitle>
                <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">Populaire</div>
              </div>
              <CardDescription>Accès complet aux cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">19,99 € / mois</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Accès illimité aux cours</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Ressources premium</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Accès prioritaire au forum</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Assistance personnalisée</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Souscrire</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Abonnement Entreprise</CardTitle>
              <CardDescription>Pour les groupes et entreprises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">49,99 € / mois</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Accès pour 5 utilisateurs</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Contenu personnalisé</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Rapports d'analyse</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                  <span>Support 24/7</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Contacter les ventes</Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Historique des Paiements</CardTitle>
            <CardDescription>Vos transactions récentes</CardDescription>
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

export default PaymentsPage;
