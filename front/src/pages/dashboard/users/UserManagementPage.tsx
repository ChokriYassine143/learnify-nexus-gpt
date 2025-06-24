import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Plus, Edit, Trash2, Shield, ShieldOff, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api";
import { User } from "@/types";

const UserManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data: loadedUsers } = await userApi.getAllUsers();
        setUsers(loadedUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

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

  const handleSaveUserEdit = async () => {
    if (selectedUser) {
      try {
        const { data: updatedUser } = await userApi.updateUser(selectedUser.id, editedUserData);
        setUsers(users.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
        
        toast({
          title: "Success",
          description: `User ${updatedUser.name} has been updated.`,
        });
        
        setEditDialogOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update user. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await userApi.deleteUser(selectedUser.id);
        setUsers(users.filter(user => user.id !== selectedUser.id));
        
        toast({
          title: "Success",
          description: `${selectedUser.name} has been deleted from the platform.`,
        });
        
        setDeleteDialogOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const { data: updatedUser } = await userApi.updateUser(userId, {
        isDisabled: !user.isDisabled
      });

      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      
      toast({
        title: "Success",
        description: `User ${updatedUser.name} has been ${updatedUser.isDisabled ? 'disabled' : 'enabled'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    // Filter by tab
    if (activeTab !== 'all' && (
      (activeTab === 'active' && user.isDisabled) ||
      (activeTab === 'inactive' && !user.isDisabled) ||
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <div className="flex h-[50vh] items-center justify-center">
            <p>Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage platform user accounts
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6 overflow-x-auto">
            <TabsList className="inline-flex min-w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>User List</CardTitle>
                <CardDescription>
                  {filteredUsers.length} {filteredUsers.length > 1 ? 'users found' : 'user found'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800">
                        <th className="text-left p-3 text-sm font-medium">Name</th>
                        <th className="text-left p-3 text-sm font-medium">Email</th>
                        <th className="text-left p-3 text-sm font-medium">Role</th>
                        <th className="text-left p-3 text-sm font-medium">Status</th>
                        <th className="text-left p-3 text-sm font-medium">Joined</th>
                        <th className="text-left p-3 text-sm font-medium">Last Login</th>
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
                                 user.role === 'teacher' ? 'Teacher' : 'Student'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                !user.isDisabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {!user.isDisabled ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-3 text-gray-600 dark:text-gray-400 text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-gray-600 dark:text-gray-400 text-sm">
                              {new Date(user.updatedAt).toLocaleDateString()}
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
                                  {!user.isDisabled ? (
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
                            No users found
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
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Edit user information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
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
                  Email Address
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
                  Role
                </label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editedUserData.role}
                  onChange={(e) => setEditedUserData({...editedUserData, role: e.target.value})}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUserEdit}>
                <Check className="mr-2 h-4 w-4" />
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete {selectedUser?.name}'s account? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete
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
