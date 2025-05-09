
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { User, Upload, Save } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Image téléchargée",
        description: "Votre photo de profil a été mise à jour."
      });
    }
  };

  const handleSaveProfile = () => {
    // In a real app, this would save the profile to the backend
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès."
    });
    setIsEditing(false);
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile picture card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
              <CardDescription>Choisissez votre photo de profil</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-28 w-28">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={user?.name} />
                ) : (
                  <>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=random`} />
                    <AvatarFallback>
                      <User className="h-12 w-12 text-gray-400" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              
              <div className="w-full">
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="flex items-center justify-center space-x-2 bg-learnup-blue3 text-learnup-blue1 p-2 rounded-md hover:bg-learnup-blue3/80 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Télécharger une photo</span>
                  </div>
                  <Input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Profile info card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Informations Personnelles</CardTitle>
                  <CardDescription>Vos détails de profil</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-learnup-blue1 text-learnup-blue1 hover:bg-learnup-blue3/20"
                >
                  {isEditing ? "Annuler" : "Modifier"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  {isEditing ? (
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-gray-700 mt-1">{name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <p className="text-gray-700 mt-1">{user?.email}</p>
                </div>
                
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <p className="text-gray-700 mt-1 capitalize">{user?.role}</p>
                </div>
                
                <div>
                  <Label htmlFor="bio">Biographie</Label>
                  {isEditing ? (
                    <textarea 
                      id="bio" 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      className="w-full mt-1 p-2 border rounded-md"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-700 mt-1">{bio || "Aucune biographie"}</p>
                  )}
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-learnup-blue1 hover:bg-learnup-blue4"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ProfilePage;
