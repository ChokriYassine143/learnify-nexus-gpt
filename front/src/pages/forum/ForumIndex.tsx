import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MessageSquare,
  Plus,
  Search,
  Tag,
  User,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useForums } from "@/hooks/useForums";
import { useAuth } from "@/contexts/AuthContext";
import { forumService } from "@/services/forumService";
import { ForumTopic } from "@/types";
import { useToast } from "@/hooks/use-toast";

const ForumIndex: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<ForumTopic[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getForumTopics } = useForums();
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const loadTopics = useCallback(async () => {
    try {
      setIsLoading(true);
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
        count: Number(count)
      }));

      setCategories(categoryList);
    } catch (error) {
      console.error("Error loading forum topics:", error);
      toast({
        title: "Error",
        description: "Failed to load forum topics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics, location.key]);

  useEffect(() => {
    // Filter topics based on search query
    if (searchQuery.trim() === "") {
      setFilteredTopics(topics);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = topics.filter(topic => 
        topic.title.toLowerCase().includes(query) ||
        topic.content.toLowerCase().includes(query)
      );
      setFilteredTopics(filtered);
    }
  }, [searchQuery, topics]);

  const getPopularTopics = () => {
    return [...topics].sort((a, b) => b.views - a.views);
  };

  const getRecentTopics = () => {
    return [...topics].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getUnansweredTopics = () => {
    return topics.filter(topic => topic.replies.length === 0);
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  return (
    <>
      <Header />
      <main className="container py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Community Forum</h1>
            <p className="mt-2 text-gray-600">
              Join discussions, ask questions, and connect with other learners
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search discussions..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {user && (
              <Button asChild>
                <Link to="/forum/new">
                  <Plus className="mr-2 h-4 w-4" /> New Discussion
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-3">
            <Tabs defaultValue="all" className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All Topics</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              </TabsList>
              
              <TabsContent key="all" value="all" className="mt-6">
                <div className="space-y-4">
                  {filteredTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/forum/${topic.id}`}
                            className="text-lg font-semibold hover:text-primary"
                          >
                            {topic.title}
                          </Link>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            {/* Category badge */}
                            {topic.category && (
                              <Badge variant="secondary" className="font-normal">
                                {topic.category}
                              </Badge>
                            )}
                            {/* Tags badges */}
                            {topic.tags && topic.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs font-normal">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-2 text-gray-500 text-sm">
                            {topic.content.substring(0, 100)}...
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                          {/* Author */}
                          <div className="flex items-center text-gray-500 text-xs">
                            <User className="mr-1 h-3 w-3" />
                            <span>
                              {typeof topic.author === 'object' ? `${topic.author.firstName} ${topic.author.lastName}` : topic.author}
                            </span>
                          </div>
                          {/* Replies and Likes */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center text-gray-500 text-xs">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              <span>{topic.replies?.length || 0} replies</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-xs">
                              <span role="img" aria-label="likes">👍</span>
                              <span className="ml-1">{topic.likes?.length || 0} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredTopics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No topics found matching your search criteria.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent key="popular" value="popular" className="mt-6">
                <div className="space-y-4">
                  {getPopularTopics().map((topic) => (
                    <div
                      key={topic.id}
                      className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/forum/${topic.id}`}
                            className="text-lg font-semibold hover:text-primary"
                          >
                            {topic.title}
                          </Link>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            {/* Category badge */}
                            {topic.category && (
                              <Badge variant="secondary" className="font-normal">
                                {topic.category}
                              </Badge>
                            )}
                            {/* Tags badges */}
                            {topic.tags && topic.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs font-normal">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-2 text-gray-500 text-sm">
                            {topic.content.substring(0, 100)}...
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                          {/* Author */}
                          <div className="flex items-center text-gray-500 text-xs">
                            <User className="mr-1 h-3 w-3" />
                            <span>
                              {typeof topic.author === 'object' ? `${topic.author.firstName} ${topic.author.lastName}` : topic.author}
                            </span>
                          </div>
                          {/* Replies and Likes */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center text-gray-500 text-xs">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              <span>{topic.replies?.length || 0} replies</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-xs">
                              <span role="img" aria-label="likes">👍</span>
                              <span className="ml-1">{topic.likes?.length || 0} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent key="recent" value="recent" className="mt-6">
                <div className="space-y-4">
                  {getRecentTopics().map((topic) => (
                    <div
                      key={topic.id}
                      className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/forum/${topic.id}`}
                            className="text-lg font-semibold hover:text-primary"
                          >
                            {topic.title}
                          </Link>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            {/* Category badge */}
                            {topic.category && (
                              <Badge variant="secondary" className="font-normal">
                                {topic.category}
                              </Badge>
                            )}
                            {/* Tags badges */}
                            {topic.tags && topic.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs font-normal">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-2 text-gray-500 text-sm">
                            {topic.content.substring(0, 100)}...
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                          {/* Author */}
                          <div className="flex items-center text-gray-500 text-xs">
                            <User className="mr-1 h-3 w-3" />
                            <span>
                              {typeof topic.author === 'object' ? `${topic.author.firstName} ${topic.author.lastName}` : topic.author}
                            </span>
                          </div>
                          {/* Replies and Likes */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center text-gray-500 text-xs">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              <span>{topic.replies?.length || 0} replies</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-xs">
                              <span role="img" aria-label="likes">👍</span>
                              <span className="ml-1">{topic.likes?.length || 0} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent key="unanswered" value="unanswered" className="mt-6">
                <div className="space-y-4">
                  {getUnansweredTopics().map((topic) => (
                    <div
                      key={topic.id}
                      className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/forum/${topic.id}`}
                            className="text-lg font-semibold hover:text-primary"
                          >
                            {topic.title}
                          </Link>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            {/* Category badge */}
                            {topic.category && (
                              <Badge variant="secondary" className="font-normal">
                                {topic.category}
                              </Badge>
                            )}
                            {/* Tags badges */}
                            {topic.tags && topic.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs font-normal">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-2 text-gray-500 text-sm">
                            {topic.content.substring(0, 100)}...
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                          {/* Author */}
                          <div className="flex items-center text-gray-500 text-xs">
                            <User className="mr-1 h-3 w-3" />
                            <span>
                              {typeof topic.author === 'object' ? `${topic.author.firstName} ${topic.author.lastName}` : topic.author}
                            </span>
                          </div>
                          {/* Replies and Likes */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center text-gray-500 text-xs">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              <span>{topic.replies?.length || 0} replies</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-xs">
                              <span role="img" aria-label="likes">👍</span>
                              <span className="ml-1">{topic.likes?.length || 0} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link
                      to={`/forum/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center justify-between py-1 hover:text-primary"
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="font-normal">
                        {category.count}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Forum Guidelines</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 rounded-full bg-primary-100 p-0.5 text-primary">
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <span>Be respectful and supportive of other members</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 rounded-full bg-primary-100 p-0.5 text-primary">
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <span>Avoid posting duplicate questions</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 rounded-full bg-primary-100 p-0.5 text-primary">
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <span>Use descriptive titles for your discussions</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 rounded-full bg-primary-100 p-0.5 text-primary">
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <span>Tag your posts appropriately</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 rounded-full bg-primary-100 p-0.5 text-primary">
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <span>Share your knowledge and help others</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForumIndex;
