
import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const DISCUSSION_TOPICS = [
  {
    id: "1",
    title: "How to implement responsive design in React?",
    user: {
      name: "Emma Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    },
    category: "Web Development",
    tags: ["React", "CSS", "Responsive"],
    replies: 23,
    views: 346,
    lastActivity: "2 hours ago",
    isNew: true,
    isPinned: true,
  },
  {
    id: "2",
    title: "Best practices for Python data visualization?",
    user: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    },
    category: "Data Science",
    tags: ["Python", "Matplotlib", "Data Visualization"],
    replies: 18,
    views: 275,
    lastActivity: "5 hours ago",
    isNew: true,
    isPinned: false,
  },
  {
    id: "3",
    title: "State management in React Native applications",
    user: {
      name: "Alex Turner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    },
    category: "Mobile Apps",
    tags: ["React Native", "Redux", "State Management"],
    replies: 32,
    views: 419,
    lastActivity: "Yesterday",
    isNew: false,
    isPinned: false,
  },
  {
    id: "4",
    title: "Tips for creating effective logo designs?",
    user: {
      name: "Sarah Parker",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    },
    category: "Graphic Design",
    tags: ["Logo Design", "Branding", "Adobe Illustrator"],
    replies: 15,
    views: 231,
    lastActivity: "2 days ago",
    isNew: false,
    isPinned: false,
  },
  {
    id: "5",
    title: "Understanding machine learning algorithms for beginners",
    user: {
      name: "David Wilson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    },
    category: "Data Science",
    tags: ["Machine Learning", "AI", "Algorithms"],
    replies: 27,
    views: 380,
    lastActivity: "3 days ago",
    isNew: false,
    isPinned: false,
  },
  {
    id: "6",
    title: "How to optimize website performance and loading speed?",
    user: {
      name: "Jennifer Lee",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    },
    category: "Web Development",
    tags: ["Performance", "Web Optimization", "Speed"],
    replies: 21,
    views: 297,
    lastActivity: "4 days ago",
    isNew: false,
    isPinned: false,
  },
];

const CATEGORIES = [
  { name: "Web Development", count: 253 },
  { name: "Data Science", count: 187 },
  { name: "Mobile Apps", count: 135 },
  { name: "Graphic Design", count: 98 },
  { name: "Career Development", count: 76 },
  { name: "General Discussion", count: 124 },
];

const ForumIndex: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
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
            
            <Button asChild>
              <Link to="/forum/new">
                <Plus className="mr-2 h-4 w-4" /> New Discussion
              </Link>
            </Button>
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
              
              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {DISCUSSION_TOPICS.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-primary-200"
                    >
                      <div className="mb-2 flex items-start justify-between">
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
                            {topic.isNew && (
                              <Badge className="bg-primary-600 text-white text-xs font-normal">
                                New
                              </Badge>
                            )}
                            <div className="flex items-center text-gray-500">
                              <User className="mr-1 h-3 w-3" />
                              <span>Started by {topic.user.name}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <img
                            src={topic.user.avatar}
                            alt={topic.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {topic.tags.map((tag) => (
                          <div
                            key={tag}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                          >
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            <span>{topic.replies} replies</span>
                          </div>
                          <div>
                            <span>{topic.views} views</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>Last activity {topic.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button variant="outline">Load More Topics</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="popular">
                <div className="flex items-center justify-center p-12 text-center">
                  <div>
                    <p className="text-gray-500">
                      Popular discussions content will go here
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="flex items-center justify-center p-12 text-center">
                  <div>
                    <p className="text-gray-500">
                      Recent discussions content will go here
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="unanswered">
                <div className="flex items-center justify-center p-12 text-center">
                  <div>
                    <p className="text-gray-500">
                      Unanswered discussions content will go here
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Categories</h3>
              <ul className="space-y-2">
                {CATEGORIES.map((category) => (
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
            
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
