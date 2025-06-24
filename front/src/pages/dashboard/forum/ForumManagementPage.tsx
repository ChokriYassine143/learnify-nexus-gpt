import React, { useState, useEffect } from "react";
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
import { useForums } from "@/hooks/useForums";
import { useAuth } from "@/contexts/AuthContext";
import { forumService } from "@/services/forumService";
import { userService } from '@/services/userService';
import { ForumTopic, ForumReply } from "@/types";

const ForumManagementPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { getForumTopics, deleteTopic } = useForums();
  const [activeTab, setActiveTab] = useState("topics");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<ForumTopic[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [reportedPosts, setReportedPosts] = useState<ForumReply[]>([]);
  const [visibleReportedPosts, setVisibleReportedPosts] = useState(2);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [selectedItem, setSelectedItem] = useState<ForumTopic | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch topics
        const allTopics = await forumService.getTopics();
        setTopics(allTopics);
        setFilteredTopics(allTopics);

        // Get categories and their counts
        const categoryCounts = allTopics.reduce((acc, topic) => {
          const category = topic.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        const categoryList = Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          count
        }));

        setCategories(categoryList);

        // Get reported posts (replies with reports)
        const allReportedPosts = allTopics.flatMap(topic => 
          topic.replies.filter(reply => reply.reports && reply.reports.length > 0)
        );
        setReportedPosts(allReportedPosts);
      } catch (error) {
        console.error("Error loading forum data:", error);
        toast({
          title: "Error",
          description: "Failed to load forum data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Filter topics based on search query
    if (searchQuery.trim() === "") {
      setFilteredTopics(topics);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = topics.filter(topic => 
        topic.title.toLowerCase().includes(query) ||
        topic.content.toLowerCase().includes(query) ||
        topic.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredTopics(filtered);
    }
  }, [searchQuery, topics]);

  const handleDeleteTopic = async (topicId: string) => {
    try {
      await forumService.deleteForumTopic(topicId);
      setTopics(topics.filter(t => t.id !== topicId));
      setFilteredTopics(filteredTopics.filter(t => t.id !== topicId));
      toast({
        title: "Success",
        description: "Topic deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive"
      });
    }
    setDeleteDialogOpen(false);
  };

  const handlePinTopic = async (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      const updatedTopic = {
        ...topic,
        isPinned: !topic.isPinned
      };
      try {
        await forumService.updateForumTopic(topicId, updatedTopic);
        setTopics(topics.map(t => t.id === topicId ? updatedTopic : t));
        setFilteredTopics(filteredTopics.map(t => t.id === topicId ? updatedTopic : t));
        toast({
          title: "Success",
          description: `Topic ${updatedTopic.isPinned ? 'pinned' : 'unpinned'} successfully`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update topic",
          variant: "destructive"
        });
      }
    }
  };

  const handleApprovePost = async (replyId: string) => {
    // Find the topic containing this reply
    const topic = topics.find(t => t.replies.some(r => r.id === replyId));
    if (topic) {
      const updatedReplies = topic.replies.map(reply => 
        reply.id === replyId ? { ...reply, reports: [] } : reply
      );
      const updatedTopic = {
        ...topic,
        replies: updatedReplies
      };
      try {
        await forumService.updateForumTopic(topic.id, updatedTopic);
        setTopics(topics.map(t => t.id === topic.id ? updatedTopic : t));
        setFilteredTopics(filteredTopics.map(t => t.id === topic.id ? updatedTopic : t));
        setReportedPosts(reportedPosts.filter(r => r.id !== replyId));
        toast({
          title: "Success",
          description: "Post approved successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to approve post",
          variant: "destructive"
        });
      }
    }
  };

  const handleRemovePost = async (replyId: string) => {
    // Find the topic containing this reply
    const topic = topics.find(t => t.replies.some(r => r.id === replyId));
    if (topic) {
      const updatedReplies = topic.replies.filter(reply => reply.id !== replyId);
      const updatedTopic = {
        ...topic,
        replies: updatedReplies
      };
      try {
        await forumService.updateForumTopic(topic.id, updatedTopic);
        setTopics(topics.map(t => t.id === topic.id ? updatedTopic : t));
        setFilteredTopics(filteredTopics.map(t => t.id === topic.id ? updatedTopic : t));
        setReportedPosts(reportedPosts.filter(r => r.id !== replyId));
        toast({
          title: "Success",
          description: "Post removed successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove post",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleLoadMoreReportedPosts = () => {
    setVisibleReportedPosts(prev => prev + 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

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
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Forum Management</h1>
            <p className="mt-2 text-gray-600">
              Manage forum topics, categories, and reported content
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="search"
                placeholder="Search topics..."
                className="pl-8 w-64 rounded-md border border-gray-300 px-3 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="topics" className="mb-8">
          <TabsList>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="reported">Reported Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="topics" className="mt-6">
            <div className="space-y-4">
              {filteredTopics.map((topic) => {
                const author = userService.getUserById(topic.author);
                return (
                  <Card key={topic.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            to={`/forum/${topic.id}`}
                            className="text-lg font-semibold hover:text-primary"
                          >
                            {topic.title}
                          </Link>
                          
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            <Badge variant="secondary" className="font-normal">
                              {topic.category}
                            </Badge>
                            {topic.isPinned && (
                              <Badge variant="outline" className="text-xs font-normal">
                                Pinned
                              </Badge>
                            )}
                            <div className="flex items-center text-gray-500">
                              <span>Posted by {author?.name || 'Unknown User'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePinTopic(topic.id)}
                          >
                            {topic.isPinned ? 'Unpin' : 'Pin'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(topic);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            <span>{topic.replies.length} replies</span>
                          </div>
                          <div>
                            <span>{topic.views} views</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <span>Last activity {formatDate(topic.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="reported" className="mt-6">
            <div className="space-y-4">
              {reportedPosts.slice(0, visibleReportedPosts).map((post) => {
                const topic = topics.find(t => t.replies.some(r => r.id === post.id));
                const author = userService.getUserById(post.author);
                return (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm text-gray-500">
                            Reply in: {topic?.title}
                          </div>
                          <div className="mt-2 text-sm">
                            {post.content}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            <Badge variant="destructive" className="font-normal">
                              {post.reports?.length || 0} reports
                            </Badge>
                            <div className="flex items-center text-gray-500">
                              <span>Posted by {author?.name || 'Unknown User'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApprovePost(post.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemovePost(post.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {reportedPosts.length > visibleReportedPosts && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleLoadMoreReportedPosts}
                >
                  Load More
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Topic</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this topic? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedItem && handleDeleteTopic(selectedItem.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ForumManagementPage;
