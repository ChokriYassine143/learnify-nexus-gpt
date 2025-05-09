
import React, { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings, Sun, Moon } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [layoutType, setLayoutType] = useState("default");
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, this would save to user preferences in the backend
    localStorage.setItem("theme", theme);
    localStorage.setItem("notifications", String(notifications));
    localStorage.setItem("emailUpdates", String(emailUpdates));
    localStorage.setItem("layoutType", layoutType);
    
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour avec succès."
    });
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-gray-600 mt-2">Personnalisez votre expérience</p>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>Gérez l'apparence et le thème</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <RadioGroup 
                  value={theme} 
                  onValueChange={setTheme}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="mr-2 h-4 w-4" /> Clair
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center">
                      <Moon className="mr-2 h-4 w-4" /> Sombre
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="layout">Disposition</Label>
                <RadioGroup 
                  value={layoutType} 
                  onValueChange={setLayoutType}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default">Standard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="compact" />
                    <Label htmlFor="compact">Compact</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expanded" id="expanded" />
                    <Label htmlFor="expanded">Étendu</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications sur site</p>
                  <p className="text-sm text-gray-500">Recevoir des notifications dans l'application</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mises à jour par email</p>
                  <p className="text-sm text-gray-500">Recevoir des mises à jour par email</p>
                </div>
                <Switch 
                  checked={emailUpdates} 
                  onCheckedChange={setEmailUpdates} 
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-learnup-blue1 hover:bg-learnup-blue4">
              <Settings className="mr-2 h-4 w-4" />
              Enregistrer les paramètres
            </Button>
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default SettingsPage;
