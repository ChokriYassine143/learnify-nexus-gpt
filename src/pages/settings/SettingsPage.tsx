
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
import { useTheme } from "@/contexts/ThemeContext";

const SettingsPage: React.FC = () => {
  const { theme, setTheme, layoutType, setLayoutType } = useTheme();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("notifications") === "true";
  });
  const [emailUpdates, setEmailUpdates] = useState(() => {
    return localStorage.getItem("emailUpdates") === "true";
  });
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // Save all settings to localStorage
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
          <p className="text-gray-600 dark:text-gray-400 mt-2">Personnalisez votre expérience</p>
        </div>
        
        <div className="space-y-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>Gérez l'apparence et le thème</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <RadioGroup 
                  value={theme} 
                  onValueChange={(value) => setTheme(value as "light" | "dark")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="mr-2 h-4 w-4" /> Clair
                    </Label>
                  </div>
                
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="layout">Disposition</Label>
                <RadioGroup 
                  value={layoutType} 
                  onValueChange={(value) => setLayoutType(value as "default" | "compact" | "expanded")}
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

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications sur site</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des notifications dans l'application</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mises à jour par email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des mises à jour par email</p>
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
