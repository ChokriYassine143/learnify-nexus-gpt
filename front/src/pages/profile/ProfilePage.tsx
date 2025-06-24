import React, { useState, useEffect } from "react";
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
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsLoading(true);
        // In a real app, this would upload to a server
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageData = event.target?.result as string;
          
          // Update profile with new avatar
          await updateProfile({ avatar: imageData });
          
          toast({
            title: "Profile updated",
            description: "Your profile picture has been updated successfully."
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to update profile picture. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await updateProfile({
        name,
        bio,
        avatar: user?.avatar
      });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile picture card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Choose your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-28 w-28">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user?.name} />
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
                  <div className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Upload Photo</span>
                  </div>
                  <Input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={isLoading}
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
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your profile details</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isLoading}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="mt-1"
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="text-gray-700 mt-1">{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <p className="text-gray-700 mt-1">{user?.email}</p>
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <p className="text-gray-700 mt-1 capitalize">{user?.role}</p>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <textarea 
                      id="bio" 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      className="w-full mt-1 p-2 border rounded-md"
                      rows={4}
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="text-gray-700 mt-1">{bio || "No bio yet"}</p>
                  )}
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
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
