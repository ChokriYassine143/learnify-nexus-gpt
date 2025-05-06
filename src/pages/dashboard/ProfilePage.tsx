
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>Vos détails de profil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Nom</p>
                <p className="text-gray-600">{user?.name}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <div>
                <p className="font-medium">Rôle</p>
                <p className="text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ProfilePage;
