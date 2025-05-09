import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, MessageSquare, Check, X, Flag, ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Extended sample forum data with more reported posts
const mockCategories = [
  {
    id: "c1",
    name: "Discussions générales",
    description: "Discussions sur divers sujets liés à la plateforme",
    topics: 45,
    posts: 312,
    lastPost: "2023-11-30"
  },
  {
    id: "c2",
    name: "Développement web",
    description: "Discussions sur le HTML, CSS, JavaScript et autres technologies web",
    topics: 38,
    posts: 264,
    lastPost: "2023-11-29"
  },
  {
    id: "c3",
    name: "Data Science",
    description: "Discussions sur la data science, l'analyse de données et le machine learning",
    topics: 22,
    posts: 187,
    lastPost: "2023-11-28"
  }
];

const mockTopics = [
  {
    id: "t1",
    title: "Comment débuter en JavaScript?",
    categoryId: "c2",
    author: "Jean Dupont",
    created: "2023-11-25",
    replies: 12,
    views: 156,
    status: "open"
  },
  {
    id: "t2",
    title: "Problèmes avec CSS Grid",
    categoryId: "c2",
    author: "Marie Lambert",
    created: "2023-11-27",
    replies: 8,
    views: 89,
    status: "open"
  },
  {
    id: "t3",
    title: "Recommandations pour apprendre Python",
    categoryId: "c3",
    author: "Pierre Martin",
    created: "2023-11-28",
    replies: 15,
    views: 203,
    status: "open"
  },
  {
    id: "t4",
    title: "Bienvenue sur la plateforme!",
    categoryId: "c1",
    author: "Admin",
    created: "2023-10-15",
    replies: 45,
    views: 678,
    status: "pinned"
  },
  {
    id: "t5",
    title: "Contenu inapproprié - merci de signaler",
    categoryId: "c1",
    author: "Sophie Dubois",
    created: "2023-11-20",
    replies: 3,
    views: 42,
    status: "reported"
  }
];

// Extended reported posts data
const extendedReportedPosts = [
  {
    id: "p1",
    topicId: "t5",
    content: "Contenu inapproprié qui a été signalé par plusieurs utilisateurs...",
    author: "John Doe",
    created: "2023-11-21",
    reports: 3,
    reportReason: "Contenu inapproprié"
  },
  {
    id: "p2",
    topicId: "t3",
    content: "Message potentiellement spam avec des liens externes...",
    author: "Anonymous123",
    created: "2023-11-28",
    reports: 2,
    reportReason: "Spam"
  },
  {
    id: "p3",
    topicId: "t2",
    content: "Ce message contient une attaque personnelle envers un autre utilisateur du forum...",
    author: "UserX",
    created: "2023-12-01",
    reports: 4,
    reportReason: "Attaque personnelle"
  },
  {
    id: "p4",
    topicId: "t1",
    content: "Ce message contient des informations trompeuses sur le sujet discuté...",
    author: "Dev123",
    created: "2023-12-05",
    reports: 2,
    reportReason: "Désinformation"
  },
  {
    id: "p5",
    topicId: "t4",
    content: "Message hors-sujet qui ne contribue pas à la discussion...",
    author: "RandomUser",
    created: "2023-12-10",
    reports: 1,
    reportReason: "Hors-sujet"
  }
];

const ForumManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("categories");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [categories, setCategories] = useState(mockCategories);
  const [topics, setTopics] = useState(mockTopics);
  const [reportedPosts, setReportedPosts] = useState(extendedReportedPosts);
  const [visibleReportedPosts, setVisibleReportedPosts] = useState(2);
  
  // Dialog states
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: ""
  });
  
  // New category state
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    description: ""
  });
  
  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedItem(category);
      setEditFormData({
        name: category.name,
        description: category.description
      });
      setEditDialogOpen(true);
    }
  };
  
  const handleSaveCategory = () => {
    if (selectedItem) {
      setCategories(categories.map(category => 
        category.id === selectedItem.id 
          ? { ...category, name: editFormData.name, description: editFormData.description } 
          : category
      ));
      
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès.",
      });
      
      setEditDialogOpen(false);
    }
  };
  
  const handleCreateCategory = () => {
    const newCategory = {
      id: `c${Date.now()}`,
      name: newCategoryData.name,
      description: newCategoryData.description,
      topics: 0,
      posts: 0,
      lastPost: new Date().toISOString().split('T')[0]
    };
    
    setCategories([...categories, newCategory]);
    
    toast({
      title: "Catégorie créée",
      description: "La nouvelle catégorie a été créée avec succès.",
    });
    
    setNewCategoryDialogOpen(false);
    setNewCategoryData({ name: "", description: "" });
  };
  
  const handleDeleteCategory = () => {
    if (selectedItem) {
      setCategories(categories.filter(category => category.id !== selectedItem.id));
      
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès.",
      });
      
      setDeleteDialogOpen(false);
    }
  };
  
  const handleDeleteTopic = (topicId: string) => {
    setTopics(topics.filter(topic => topic.id !== topicId));
    
    toast({
      title: "Sujet supprimé",
      description: "Le sujet a été supprimé avec succès.",
    });
  };
  
  const handlePinTopic = (topicId: string) => {
    setTopics(topics.map(topic => 
      topic.id === topicId 
        ? { ...topic, status: topic.status === 'pinned' ? 'open' : 'pinned' } 
        : topic
    ));
    
    const topic = topics.find(t => t.id === topicId);
    const newStatus = topic?.status === 'pinned' ? 'désépinglé' : 'épinglé';
    
    toast({
      title: "Statut du sujet modifié",
      description: `Le sujet a été ${newStatus}.`,
    });
  };
  
  const handleApprovePost = (postId: string) => {
    setReportedPosts(reportedPosts.filter(post => post.id !== postId));
    
    toast({
      title: "Message approuvé",
      description: "Le message a été approuvé et n'est plus signalé.",
    });
  };
  
  const handleRemovePost = (postId: string) => {
    setReportedPosts(reportedPosts.filter(post => post.id !== postId));
    
    toast({
      title: "Message supprimé",
      description: "Le message signalé a été supprimé.",
    });
  };
  
  const handleLoadMoreReportedPosts = () => {
    setVisibleReportedPosts(prev => Math.min(prev + 2, reportedPosts.length));
  };
  
  // Filtering logic
  const filteredCategories = categories.filter(category => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  const filteredTopics = topics.filter(topic => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.author.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  const filteredReportedPosts = reportedPosts.filter(post => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const relatedTopic = topics.find(t => t.id === post.topicId);
      return (
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        relatedTopic?.title.toLowerCase().includes(query) ||
        post.reportReason.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  const visiblePosts = filteredReportedPosts.slice(0, visibleReportedPosts);
  
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gestion du Forum</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez les catégories, sujets et messages du forum
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={() => setNewCategoryDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle catégorie
            </Button>
          </div>
        </div>

        <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="categories">
              Catégories
              <Badge variant="outline" className="ml-2">{categories.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="topics">
              Sujets
              <Badge variant="outline" className="ml-2">{topics.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reported">
              Messages signalés
              <Badge variant="destructive" className="ml-2">{reportedPosts.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Catégories du forum</CardTitle>
                <CardDescription>
                  Gérez les catégories principales de votre forum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium">Nom</th>
                        <th className="text-left p-3 text-sm font-medium">Description</th>
                        <th className="text-left p-3 text-sm font-medium">Sujets</th>
                        <th className="text-left p-3 text-sm font-medium">Messages</th>
                        <th className="text-left p-3 text-sm font-medium">Dernier message</th>
                        <th className="text-left p-3 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <tr key={category.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 animate-fade-in">
                            <td className="p-3 font-medium">{category.name}</td>
                            <td className="p-3 text-gray-600 dark:text-gray-400">
                              {category.description}
                            </td>
                            <td className="p-3">{category.topics}</td>
                            <td className="p-3">{category.posts}</td>
                            <td className="p-3 text-gray-600 dark:text-gray-400">
                              {category.lastPost}
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1"
                                  onClick={() => handleEditCategory(category.id)}
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1"
                                  onClick={() => {
                                    setSelectedItem(category);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">
                            Aucune catégorie trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Topics Tab */}
          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Sujets de discussion</CardTitle>
                <CardDescription>
                  Gérez les sujets de discussion créés par les utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium">Titre</th>
                        <th className="text-left p-3 text-sm font-medium">Auteur</th>
                        <th className="text-left p-3 text-sm font-medium">Catégorie</th>
                        <th className="text-left p-3 text-sm font-medium">Créé le</th>
                        <th className="text-left p-3 text-sm font-medium">Réponses</th>
                        <th className="text-left p-3 text-sm font-medium">Vues</th>
                        <th className="text-left p-3 text-sm font-medium">Statut</th>
                        <th className="text-left p-3 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic) => {
                          const category = categories.find(c => c.id === topic.categoryId);
                          return (
                            <tr key={topic.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 animate-fade-in">
                              <td className="p-3 font-medium">
                                <div className="flex items-center">
                                  {topic.status === 'pinned' && (
                                    <span className="mr-2 text-yellow-500">📌</span>
                                  )}
                                  {topic.status === 'reported' && (
                                    <span className="mr-2 text-red-500">🚩</span>
                                  )}
                                  <Link to={`/forum/${topic.id}`} className="hover:text-primary">
                                    {topic.title}
                                  </Link>
                                </div>
                              </td>
                              <td className="p-3">{topic.author}</td>
                              <td className="p-3">{category?.name}</td>
                              <td className="p-3 text-gray-600 dark:text-gray-400">
                                {topic.created}
                              </td>
                              <td className="p-3">{topic.replies}</td>
                              <td className="p-3">{topic.views}</td>
                              <td className="p-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  topic.status === 'pinned' ? 'bg-yellow-100 text-yellow-800' :
                                  topic.status === 'reported' ? 'bg-red-100 text-red-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {topic.status === 'pinned' ? 'Épinglé' : 
                                   topic.status === 'reported' ? 'Signalé' : 'Ouvert'}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1"
                                    onClick={() => handlePinTopic(topic.id)}
                                    title={topic.status === 'pinned' ? "Désépingler" : "Épingler"}
                                  >
                                    <MessageSquare className={`h-4 w-4 ${
                                      topic.status === 'pinned' ? 'text-yellow-600' : 'text-gray-600'
                                    }`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1"
                                    onClick={() => handleDeleteTopic(topic.id)}
                                    title="Supprimer"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-gray-500">
                            Aucun sujet trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reported Posts Tab */}
          <TabsContent value="reported">
            <Card>
              <CardHeader>
                <CardTitle>Messages signalés</CardTitle>
                <CardDescription>
                  Examinez et modérez les messages signalés par les utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredReportedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {visiblePosts.map((post) => {
                      const relatedTopic = topics.find(t => t.id === post.topicId);
                      return (
                        <Card key={post.id} className="border-l-4 border-red-500 animate-fade-in">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">
                                  Message signalé dans: {relatedTopic?.title}
                                </CardTitle>
                                <CardDescription>
                                  Par {post.author} • {post.created} • {post.reports} signalement(s) • Raison: {post.reportReason}
                                </CardDescription>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleApprovePost(post.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemovePost(post.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="border-l-4 border-gray-200 pl-4 py-2">
                              <p className="text-gray-800 dark:text-gray-200">
                                {post.content}
                              </p>
                            </div>
                            <div className="flex justify-end mt-4 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApprovePost(post.id)}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Approuver
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRemovePost(post.id)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Supprimer
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    {filteredReportedPosts.length > visibleReportedPosts && (
                      <div className="flex justify-center mt-6">
                        <Button 
                          variant="outline" 
                          onClick={handleLoadMoreReportedPosts}
                          className="gap-2"
                        >
                          <span>Afficher plus de messages signalés</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Flag className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Aucun message signalé</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Il n'y a actuellement aucun message signalé nécessitant une modération.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Category Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la catégorie</DialogTitle>
              <DialogDescription>Modifiez les détails de cette catégorie</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveCategory}>
                <Check className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Category Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer la catégorie "{selectedItem?.name}" ? Cette action est irréversible et supprimera également tous les sujets et messages associés.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Category Dialog */}
        <Dialog open={newCategoryDialogOpen} onOpenChange={setNewCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle catégorie</DialogTitle>
              <DialogDescription>Créez une nouvelle catégorie de forum</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="newName" className="text-sm font-medium">
                  Nom
                </label>
                <input
                  id="newName"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData({...newCategoryData, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="newDescription" className="text-sm font-medium">
                  Description
                </label>
                <input
                  id="newDescription"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newCategoryData.description}
                  onChange={(e) => setNewCategoryData({...newCategoryData, description: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCategoryDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateCategory} disabled={!newCategoryData.name}>
                <Plus className="mr-2 h-4 w-4" />
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default ForumManagementPage;
