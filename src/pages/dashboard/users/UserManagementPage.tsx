
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Plus, Edit, Trash2, Shield, ShieldOff, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Example user data
const mockUsers = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    role: "student",
    status: "active",
    joinDate: "2023-05-15",
    lastLogin: "2023-11-28"
  },
  {
    id: "2",
    name: "Marie Lambert",
    email: "marie.lambert@example.com",
    role: "student",
    status: "active",
    joinDate: "2023-04-22",
    lastLogin: "2023-11-29"
  },
  {
    id: "3",
    name: "Pierre Martin",
    email: "pierre.martin@example.com",
    role: "teacher",
    status: "active",
    joinDate: "2022-09-10",
    lastLogin: "2023-11-30"
  },
  {
    id: "4",
    name: "Sophie Dubois",
    email: "sophie.dubois@example.com",
    role: "student",
    status: "inactive",
    joinDate: "2023-02-18",
    lastLogin: "2023-10-15"
  },
  {
    id: "5",
    name: "Thomas Bernard",
    email: "thomas.bernard@example.com",
    role: "teacher",
    status: "active",
    joinDate: "2022-11-05",
    lastLogin: "2023-11-28"
  },
  {
    id: "6",
    name: "Léa Petit",
    email: "lea.petit@example.com",
    role: "admin",
    status: "active",
    joinDate: "2022-06-30",
    lastLogin: "2023-11-30"
  }
];

const UserManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    email: "",
    role: ""
  });

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setEditedUserData({
        name: user.name,
        email: user.email,
        role: user.role
      });
      setEditDialogOpen(true);
    }
  };

  const handleSaveUserEdit = () => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...editedUserData } 
          : user
      ));
      
      toast({
        title: "Utilisateur modifié",
        description: `Les informations de ${editedUserData.name} ont été mises à jour.`,
      });
      
      setEditDialogOpen(false);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      toast({
        title: "Utilisateur supprimé",
        description: `${selectedUser.name} a été supprimé de la plateforme.`,
      });
      
      setDeleteDialogOpen(false);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === 'active' ? 'désactivé' : 'activé';
    
    toast({
      title: "Statut modifié",
      description: `Le compte de ${user?.name} a été ${newStatus}.`,
    });
  };

  const filteredUsers = users.filter(user => {
    // Filter by tab
    if (activeTab !== 'all' && (
      (activeTab === 'active' && user.status !== 'active') ||
      (activeTab === 'inactive' && user.status !== 'inactive') ||
      (activeTab === 'students' && user.role !== 'student') ||
      (activeTab === 'teachers' && user.role !== 'teacher') ||
      (activeTab === 'admins' && user.role !== 'admin')
    )) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez les comptes utilisateur de la plateforme
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Rechercher un utilisateur..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrer</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter</span>
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6 overflow-x-auto">
            <TabsList className="inline-flex min-w-full">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="inactive">Inactifs</TabsTrigger>
              <TabsTrigger value="students">Étudiants</TabsTrigger>
              <TabsTrigger value="teachers">Enseignants</TabsTrigger>
              <TabsTrigger value="admins">Administrateurs</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Liste des utilisateurs</CardTitle>
                <CardDescription>
                  {filteredUsers.length} {filteredUsers.length > 1 ? 'utilisateurs trouvés' : 'utilisateur trouvé'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800">
                        <th className="text-left p-3 text-sm font-medium">Nom</th>
                        <th className="text-left p-3 text-sm font-medium">Email</th>
                        <th className="text-left p-3 text-sm font-medium">Rôle</th>
                        <th className="text-left p-3 text-sm font-medium">Statut</th>
                        <th className="text-left p-3 text-sm font-medium">Inscrit le</th>
                        <th className="text-left p-3 text-sm font-medium">Dernière connexion</th>
                        <th className="text-left p-3 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {user.role === 'admin' ? 'Admin' : 
                                 user.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status === 'active' ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="p-3 text-gray-600 dark:text-gray-400 text-sm">
                              {user.joinDate}
                            </td>
                            <td className="p-3 text-gray-600 dark:text-gray-400 text-sm">
                              {user.lastLogin}
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1"
                                  onClick={() => handleEditUser(user.id)}
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1"
                                  onClick={() => toggleUserStatus(user.id)}
                                >
                                  {user.status === 'active' ? (
                                    <ShieldOff className="h-4 w-4 text-amber-600" />
                                  ) : (
                                    <Shield className="h-4 w-4 text-green-600" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            Aucun utilisateur trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
              <DialogDescription>Modifiez les informations de cet utilisateur</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editedUserData.name}
                  onChange={(e) => setEditedUserData({...editedUserData, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editedUserData.email}
                  onChange={(e) => setEditedUserData({...editedUserData, email: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Rôle
                </label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editedUserData.role}
                  onChange={(e) => setEditedUserData({...editedUserData, role: e.target.value})}
                >
                  <option value="student">Étudiant</option>
                  <option value="teacher">Enseignant</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveUserEdit}>
                <Check className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer définitivement le compte de {selectedUser?.name} ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default UserManagementPage;
