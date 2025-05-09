
import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageSquare,
  Heart,
  Share2,
  Flag,
  ThumbsUp,
  Tag,
  User,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

// Mock data for the forum topic
const mockTopic = {
  id: "1",
  title: "How to implement responsive design in React?",
  content: `
  I'm having trouble making my React app fully responsive across all devices. I've tried using media queries and some responsive libraries, but I'm still facing issues with certain components.
  
  Specifically, my navigation menu doesn't collapse properly on mobile devices, and some of my grids don't resize as expected.
  
  Here's a snippet of my current approach:
  
  \`\`\`jsx
  const NavMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <nav className="navbar">
        <div className="logo">MyApp</div>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          Menu
        </button>
        <ul className={isOpen ? "nav-items open" : "nav-items"}>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    );
  };
  \`\`\`
  
  Has anyone faced similar issues? What's the best approach for handling responsive layouts in React?
  `,
  user: {
    name: "Emma Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    role: "Student",
    joinDate: "Member since June 2023",
  },
  category: "Web Development",
  tags: ["React", "CSS", "Responsive"],
  createdAt: "2 days ago",
  views: 346,
  likes: 23,
  replies: [
    {
      id: "r1",
      content: `
      I would recommend using a CSS framework like Tailwind CSS or a component library like Material-UI that already handles responsiveness well.
      
      For your specific navigation issue, here's how I would approach it with Tailwind:
      
      \`\`\`jsx
      import { useState } from 'react';
      import { MenuIcon, XIcon } from '@heroicons/react/outline';
      
      const NavMenu = () => {
        const [isOpen, setIsOpen] = useState(false);
        
        return (
          <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold">MyApp</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center">
                  <a href="/" className="px-3 py-2 rounded-md text-sm font-medium">Home</a>
                  <a href="/about" className="px-3 py-2 rounded-md text-sm font-medium">About</a>
                  <a href="/contact" className="px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md"
                  >
                    {isOpen ? (
                      <XIcon className="block h-6 w-6" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className={isOpen ? 'block md:hidden' : 'hidden'}>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="/" className="block px-3 py-2 rounded-md text-base font-medium">Home</a>
                <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium">About</a>
                <a href="/contact" className="block px-3 py-2 rounded-md text-base font-medium">Contact</a>
              </div>
            </div>
          </nav>
        );
      };
      \`\`\`
      
      Notice how I'm using the \`hidden md:flex\` and \`block md:hidden\` classes to toggle visibility based on screen size. This is much more reliable than trying to handle it all with JavaScript.
      `,
      user: {
        name: "Alex Turner",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
        role: "Web Developer",
      },
      createdAt: "1 day ago",
      likes: 15,
    },
    {
      id: "r2",
      content: "I agree with Alex. Using a framework like Tailwind CSS can save you a lot of time. Also, consider using the React Responsive package which provides hooks for detecting screen size and adjusting your components accordingly.",
      user: {
        name: "Sarah Parker",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
        role: "Student",
      },
      createdAt: "1 day ago",
      likes: 7,
    },
    {
      id: "r3",
      content: `
      Another approach is to use CSS Grid or Flexbox directly. Here's a simple example using Flexbox:
      
      \`\`\`css
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
      }
      
      .menu-toggle {
        display: none;
      }
      
      .nav-items {
        display: flex;
        gap: 1rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      
      @media (max-width: 768px) {
        .nav-items {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          padding: 1rem;
        }
        
        .nav-items.open {
          display: flex;
        }
        
        .menu-toggle {
          display: block;
        }
      }
      \`\`\`
      
      This gives you more control over the exact behavior, but requires more manual work than using a framework.
      `,
      user: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
        role: "Frontend Developer",
      },
      createdAt: "12 hours ago",
      likes: 9,
    },
  ],
};

const ForumTopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [replyContent, setReplyContent] = useState("");
  const [likes, setLikes] = useState(mockTopic.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [replies, setReplies] = useState(mockTopic.replies);
  const [visibleReplies, setVisibleReplies] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };
  
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const newReply = {
        id: `r${replies.length + 1}`,
        content: replyContent,
        user: {
          name: "Vous",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
          role: "Étudiant",
        },
        createdAt: "à l'instant",
        likes: 0,
      };
      
      setReplies([...replies, newReply]);
      setVisibleReplies(replies.length + 1); // Show all replies including the new one
      setReplyContent("");
      setIsSubmitting(false);
      
      toast({
        title: "Réponse publiée",
        description: "Votre réponse a été publiée avec succès.",
      });
      
      // Scroll to the new reply
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 1000);
  };
  
  const handleLoadMore = () => {
    setVisibleReplies(replies.length);
  };
  
  const handleReplyToComment = (replyId: string) => {
    // Scroll to reply form and focus on textarea
    replyRef.current?.focus();
    
    // Add a mention to the selected comment's author
    const targetReply = replies.find(reply => reply.id === replyId);
    if (targetReply) {
      setReplyContent(`@${targetReply.user.name}: `);
    }
  };
  
  const displayedReplies = replies.slice(0, visibleReplies);
  
  return (
    <>
      <Header />
      <main className="container py-12">
        <Link 
          to="/forum" 
          className="inline-flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au forum
        </Link>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
              <h1 className="text-2xl font-bold mb-4">{mockTopic.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="font-normal">
                  {mockTopic.category}
                </Badge>
                {mockTopic.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-800"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </div>
                ))}
              </div>
              
              <div className="prose max-w-none mb-6">
                {mockTopic.content.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1 ${hasLiked ? "text-primary" : ""}`}
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 ${hasLiked ? "fill-primary" : ""}`} />
                    <span>{likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Partager</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Flag className="h-4 w-4" />
                    <span>Signaler</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Publié {mockTopic.createdAt}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">Réponses</span>
                <Badge variant="outline" className="text-xs font-normal">
                  {replies.length}
                </Badge>
              </h2>
              
              <div className="space-y-6">
                {displayedReplies.map((reply) => (
                  <div key={reply.id} className="bg-white rounded-lg border shadow-sm p-6 animate-fade-in">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        
                        <div>
                          <div className="font-semibold">{reply.user.name}</div>
                          <div className="text-sm text-gray-500">{reply.user.role}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {reply.createdAt}
                      </div>
                    </div>
                    
                    <div className="prose max-w-none mb-4">
                      {typeof reply.content === 'string' ? (
                        reply.content.split("\n\n").map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{reply.likes}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleReplyToComment(reply.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Répondre</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {replies.length > visibleReplies && (
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMore} 
                    className="gap-2"
                  >
                    <span>Voir plus de réponses</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {replies.length > 5 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Votre réponse</h2>
              
              <form onSubmit={handleReplySubmit}>
                <Textarea
                  placeholder="Partagez votre réponse ou vos connaissances..."
                  className="min-h-[200px] mb-4"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  ref={replyRef}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={!replyContent.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">Publication en cours...</span>
                      </>
                    ) : (
                      "Publier la réponse"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6 sticky top-4">
              <div className="flex flex-col items-center text-center">
                <img
                  src={mockTopic.user.avatar}
                  alt={mockTopic.user.name}
                  className="h-16 w-16 rounded-full object-cover mb-3"
                />
                
                <h3 className="font-semibold">{mockTopic.user.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{mockTopic.user.role}</p>
                <p className="text-xs text-gray-500">{mockTopic.user.joinDate}</p>
                
                <div className="w-full border-t my-4"></div>
                
                <div className="grid grid-cols-2 w-full text-center gap-4">
                  <div>
                    <div className="text-xl font-semibold">42</div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">156</div>
                    <div className="text-xs text-gray-500">Réponses</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="font-semibold mb-4">Statistiques</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vues</span>
                  <span className="font-medium">{mockTopic.views}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Réponses</span>
                  <span className="font-medium">{replies.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">J'aime</span>
                  <span className="font-medium">{likes}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Créé</span>
                  <span className="font-medium">{mockTopic.createdAt}</span>
                </div>
              </div>
              
              <div className="w-full border-t my-4"></div>
              
              <h3 className="font-semibold mb-3">Discussions similaires</h3>
              
              <div className="space-y-2">
                <Link to="#" className="block text-sm hover:text-primary">
                  CSS Flexbox vs Grid : quand utiliser l'un ou l'autre ?
                </Link>
                <Link to="#" className="block text-sm hover:text-primary">
                  Optimisation des performances React pour les applications mobiles
                </Link>
                <Link to="#" className="block text-sm hover:text-primary">
                  Comment gérer l'accessibilité dans les applications React ?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForumTopicPage;
