import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Flag, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/services/courseService";
import { CourseDiscussion as DiscussionType, DiscussionReply } from "@/types";

type Comment = {
  id: string;
  content: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
  likes: number;
  replies?: Comment[];
};

type CourseDiscussionProps = {
  courseId: string;
  lessonId?: string;
};

const CourseDiscussion: React.FC<CourseDiscussionProps & { canPost?: boolean }> = ({ courseId, lessonId, canPost = true }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<DiscussionType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [visibleComments, setVisibleComments] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Load discussions from API
  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        const allDiscussions = await courseService.getCourseDiscussions(courseId);
        const filteredDiscussions = lessonId 
          ? allDiscussions.filter(d => d.lessonId === lessonId)
          : allDiscussions;
        setComments(filteredDiscussions);
      } catch (error) {
        console.error("Error loading discussions:", error);
        toast({
          title: "Error",
          description: "Failed to load discussions",
          variant: "destructive"
        });
      }
    };
    loadDiscussions();
  }, [courseId, lessonId, toast]);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      const newDiscussion: any = {
        userId: user.id,
        userName: user.name,
        content: newComment,
        createdAt: new Date().toISOString(),
        replies: []
      };
      if (lessonId) newDiscussion.lessonId = lessonId;
      // Post the comment and get the created discussion from backend
      const createdDiscussion = await courseService.addCourseDiscussion(courseId, newDiscussion);

      // Append the new discussion to the comments state
      setComments(prevComments => [createdDiscussion, ...prevComments]);
      setNewComment("");

      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès.",
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitReply = async (discussionId: string) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      const newReply: Omit<DiscussionReply, "id" | "createdAt"> = {
        discussionId,
        courseId,
        userId: user.id,
        userName: user.name,
        content: replyContent
      };

      // Post the reply and get the created reply from backend
      const createdReply = await courseService.addDiscussionReply(courseId, discussionId, newReply);

      // Append the new reply to the correct discussion in state
      setComments(prevComments =>
        prevComments.map(d =>
          d.id === discussionId
            ? { ...d, replies: [...(d.replies || []), { ...createdReply }] }
            : d
        )
      );

      setReplyTo(null);
      setReplyContent("");
      toast({
        title: "Réponse ajoutée",
        description: "Votre réponse a été publiée avec succès.",
      });
    } catch (error: any) {
      console.error("Error submitting reply:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to submit reply",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLoadMore = () => {
    setVisibleComments(comments.length);
  };
  
  const displayedComments = comments.slice(0, visibleComments);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Discussion du cours</h2>
      
      <div className="mb-8">
        {canPost ? (
        <form onSubmit={handleSubmitComment}>
          <Textarea 
            placeholder="Partagez vos questions ou commentaires sur cette leçon..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[120px] mb-4"
            ref={commentRef}
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!newComment.trim() || isSubmitting}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {isSubmitting ? "Publication en cours..." : "Publier un commentaire"}
            </Button>
          </div>
        </form>
        ) : (
          <div className="text-gray-500 italic">You must be enrolled or the instructor to participate in the discussion.</div>
        )}
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-6">
        {displayedComments.length > 0 ? (
          displayedComments.map((comment, idx) => (
            <div key={`comment-${comment.id || idx}`} className="bg-white rounded-lg border shadow-sm p-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{comment.userName}</p>
                      <p className="text-sm text-gray-500">{comment.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-gray-700">{comment.content}</div>
                  
                  <div className="mt-3 flex items-center gap-4">
                 
                    
                    
                  </div>
                  
                  {replyTo === (comment.id || String(idx)) && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <Textarea
                        placeholder={`Répondre à ${comment.userName}...`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[100px] mb-3"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setReplyTo(null)}
                        >
                          Annuler
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleSubmitReply(comment.id || String(idx))}
                          disabled={!replyContent.trim() || isSubmitting}
                        >
                          {isSubmitting ? "Envoi..." : "Envoyer la réponse"}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 space-y-4 border-l-2 border-gray-100">
                      {comment.replies.map((reply) => (
                        <div key={`reply-${reply.id}-${reply.createdAt}`} className="pt-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{reply.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{reply.userName}</p>
                                  <p className="text-xs text-gray-500">{reply.createdAt}</p>
                                </div>
                              </div>
                              
                              <div className="mt-1 text-gray-700 text-sm">{reply.content}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Soyez le premier à commenter cette leçon !
          </div>
        )}
      </div>
      
      {comments.length > visibleComments && (
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleLoadMore}
          >
            <span>Voir plus de commentaires</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseDiscussion;
