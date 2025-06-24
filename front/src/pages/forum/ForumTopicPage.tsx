import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ThumbsUp,
  Flag,
  Share2,
  Clock,
  Tag,
  User as UserIcon,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useForums } from "@/hooks/useForums";
import { useAuth } from "@/contexts/AuthContext";
import { ForumTopic, ForumReply, User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { userService } from '@/services/userService';
import { forumService } from "@/services/forumService";

const enrichReplyAuthor = async (reply) => {
  if (typeof reply.author === 'string') {
    try {
      const userObj = await userService.getUserById(reply.author);
      return { ...reply, author: userObj };
    } catch {
      return reply;
    }
  }
  return reply;
};

const ForumTopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [author, setAuthor] = useState<User | null>(null);
  const { getForumTopicById, addReplyToTopic } = useForums();
  const { user } = useAuth();
  const hasUpdatedViews = useRef(false);
  const initialLoadDone = useRef(false);
  const [optimisticReplies, setOptimisticReplies] = useState([]);

  // Load topic and author data
  useEffect(() => {
    const loadTopic = async () => {
      if (!topicId || initialLoadDone.current) return;
      
      try {
        const topicData = await getForumTopicById(topicId);
        if (topicData) {
          // Defensive: ensure isLocked is present
          let updatedTopic = { ...topicData, isLocked: topicData.isLocked !== undefined ? topicData.isLocked : false };
          
          // Enrich all replies with full author info
          updatedTopic.replies = await Promise.all(
            updatedTopic.replies.map(enrichReplyAuthor)
          );
          setTopic(updatedTopic);
          
          // Only fetch author if it's a string (ID)
          if (typeof updatedTopic.author === 'string') {
            try {
              const authorData = await userService.getUserById(updatedTopic.author);
              setAuthor(authorData);
            } catch (error) {
              console.error("Error loading author:", error);
            }
          } else {
            setAuthor(updatedTopic.author as User);
          }

          initialLoadDone.current = true;
        } else {
          navigate("/forum");
        }
      } catch (error) {
        console.error("Error loading topic:", error);
        navigate("/forum");
      }
    };

    loadTopic();
  }, [topicId, navigate, getForumTopicById, location.key]);

  // Separate effect for view count update
  useEffect(() => {
    const updateViewCount = async () => {
      if (!topicId || !topic || hasUpdatedViews.current || !initialLoadDone.current) return;

      const viewedKey = `viewed_${topicId}`;
      if (!sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, 'true');
        const newViews = (topic.views || 0) + 1;
        
        try {
          await forumService.updateTopic(topicId, { views: newViews });
          hasUpdatedViews.current = true;
          setTopic(prevTopic => prevTopic ? { ...prevTopic, views: newViews } : null);
        } catch (error) {
          console.error("Error updating view count:", error);
        }
      }
    };

    updateViewCount();
  }, [topicId, topic, initialLoadDone.current]);

  const handleSubmitReply = async () => {
    if (!user || !topic || !reply.trim()) {
      toast({
        title: "Error",
        description: "You must be logged in and enter a reply.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const authorId = user.id || storedUser.id;

      // Post the reply and get the created reply from backend
      const newReply = await forumService.addReply(topic.id, {
        content: reply.trim(),
        author: authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Optionally enrich author info for display
      const enrichedReply = await enrichReplyAuthor(newReply);

      // Append the new reply to the topic state
      setTopic(prevTopic => {
        if (!prevTopic) return prevTopic;
        return {
          ...prevTopic,
          replies: [...prevTopic.replies, enrichedReply]
        };
      });

      setReply("");
      setOptimisticReplies([]);
      toast({
        title: "Reply posted!",
        description: "Your reply has been added.",
        duration: 4000
      });
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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

  const handleLikeTopic = async () => {
    if (!user || !topic) return;
    const userId = user._id || user.id;
    try {
      const updatedLikes = await forumService.likeTopic(topic.id, userId);
      setTopic({ ...topic, likes: updatedLikes });
    } catch (error) {
      console.error("Error liking/unliking topic:", error);
    }
  };

  const handleLikeReply = async (replyId: string) => {
    if (!topic || !user || !replyId) {
      console.error('Cannot like reply: missing topic, user, or replyId');
      return;
    }

    const userId = user._id || user.id;
    console.log('Liking reply with userId:', userId, 'replyId:', replyId);
    
    try {
      const updatedReply = await forumService.likeReply(topic.id, replyId, userId);
      console.log('Updated reply after like:', updatedReply);

      // Update the topic with the new reply data
      setTopic(prevTopic => {
        if (!prevTopic) return null;
        return {
          ...prevTopic,
          replies: prevTopic.replies.map(r => 
            r.id === replyId ? { ...r, likes: updatedReply.likes } : r
          )
        };
      });
    } catch (error) {
      console.error("Error liking/unliking reply:", error);
      toast({
        title: "Error",
        description: "Failed to like/unlike reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!topic) {
    return (
      <>
        <Header />
        <main className="container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Before rendering replies
  const backendReplyKeys = new Set(topic.replies?.map(r => `${r.content}|${r.author.id}`));
  const optimisticRepliesNotInBackend = optimisticReplies.filter(
    r => !backendReplyKeys.has(`${r.content}|${r.author.id}`)
  );
  const allReplies = [...(topic.replies || []), ...optimisticRepliesNotInBackend];
  console.log('Replies array before render:', allReplies);

  return (
    <>
      <Header />
      <main className="container py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/forum")}
          >
            ← Back to Forum
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{topic.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {/* You can put a plain text summary here if needed, or leave empty if not used */}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary" className="font-normal">
                      {topic.category}
                    </Badge>
                    {topic.isPinned && (
                      <Badge variant="outline" className="text-xs font-normal ml-2">
                        Pinned
                      </Badge>
                    )}
                    <div className="flex items-center text-gray-500 ml-2">
                      <UserIcon className="mr-1 h-3 w-3" />
                      <span>Posted by {author?.name || (author?.firstName || author?.lastName ? `${author?.firstName || ''}${author?.lastName ? ' ' + author?.lastName : ''}` : (typeof topic.author === 'string' ? topic.author : 'Unknown User'))}</span>
                    </div>
                    <div className="flex items-center text-gray-500 ml-2">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{formatDate(topic.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                {author?.avatar && (
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author?.name?.[0] || author?.firstName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {topic.content}
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLikeTopic}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{topic.likes?.length || 0}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{topic.replies?.length || 0}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Flag className="h-4 w-4" />
                  <span>Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Replies section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Replies</h2>
            
            {allReplies.map((reply) => {
              // Debug log for each reply rendered
              console.log('Rendering reply:', reply);
              const replyId = reply.id || (reply as any)._id;
              if (!replyId) {
                console.error('Reply missing ID:', reply);
                return null;
              }

              return (
                <Card key={replyId} className="mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        {typeof reply.author === 'object' && reply.author && reply.author.avatar ? (
                          <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                        ) : null}
                        <AvatarFallback>
                          {typeof reply.author === 'object' && reply.author && (reply.author.name || `${reply.author.firstName || ''}${reply.author.lastName ? ' ' + reply.author.lastName : ''}`) ?
                            (reply.author.name ? reply.author.name[0] : (reply.author.firstName ? reply.author.firstName[0] : 'U'))
                            : (typeof reply.author === 'string' && reply.author ? reply.author[0] : 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {typeof reply.author === 'object' && reply.author && (reply.author.name || reply.author.firstName || reply.author.lastName) ?
                                (reply.author.name || `${reply.author.firstName || ''}${reply.author.lastName ? ' ' + reply.author.lastName : ''}`)
                                : (reply.author ? reply.author : 'Unknown User')}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeReply(replyId)}
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{reply.likes?.length || 0}</span>
                          </Button>
                        </div>
                        <div className="prose max-w-none">
                          {reply.content}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* Reply form */}
            {user && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <Textarea
                    placeholder="Write your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={handleSubmitReply}
                      disabled={!reply.trim() || isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post Reply"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForumTopicPage;
