
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Flag, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    content: "Cette leçon était très claire, merci ! J'ai une question concernant la partie sur les hooks React, est-ce que vous pourriez expliquer davantage l'utilisation de useCallback ?",
    user: {
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      role: "Étudiant"
    },
    createdAt: "Il y a 2 jours",
    likes: 5,
    replies: [
      {
        id: "c1r1",
        content: "Bonjour Marie, useCallback est utilisé pour mémoriser une fonction entre les rendus. C'est particulièrement utile lorsque vous passez des callbacks à des composants optimisés qui s'appuient sur l'égalité des références pour éviter des rendus inutiles.",
        user: {
          name: "Prof. Jean Martin",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
          role: "Instructeur"
        },
        createdAt: "Il y a 1 jour",
        likes: 3
      }
    ]
  },
  {
    id: "c2",
    content: "J'ai eu quelques difficultés avec les exercices pratiques. Est-ce que quelqu'un pourrait m'aider avec l'exercice 3 ? Je n'arrive pas à comprendre comment implémenter la fonction de tri.",
    user: {
      name: "Thomas Bernard",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      role: "Étudiant"
    },
    createdAt: "Il y a 3 jours",
    likes: 2,
    replies: []
  },
  {
    id: "c3",
    content: "Super cours ! J'ai beaucoup appris et je me sens maintenant plus à l'aise avec React. J'ai hâte de voir la prochaine leçon.",
    user: {
      name: "Sophie Lambert",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      role: "Étudiant"
    },
    createdAt: "Il y a 4 jours",
    likes: 7,
    replies: []
  },
  {
    id: "c4",
    content: "Est-ce qu'il y aura une leçon sur les tests unitaires avec Jest et React Testing Library ?",
    user: {
      name: "Alexandre Dupont",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      role: "Étudiant"
    },
    createdAt: "Il y a 5 jours",
    likes: 4,
    replies: [
      {
        id: "c4r1",
        content: "Oui, nous avons prévu une leçon complète sur les tests dans le module avancé du cours. Elle sera disponible d'ici deux semaines.",
        user: {
          name: "Prof. Jean Martin",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
          role: "Instructeur"
        },
        createdAt: "Il y a 5 jours",
        likes: 2
      }
    ]
  }
];

const CourseDiscussion: React.FC<CourseDiscussionProps> = ({ courseId, lessonId }) => {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [visibleComments, setVisibleComments] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  const handleLikeComment = (commentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        
        if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              return { ...reply, likes: reply.likes + 1 };
            }
            return reply;
          });
          
          return { ...comment, replies: updatedReplies };
        }
        
        return comment;
      })
    );
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: `c${comments.length + 1}`,
        content: newComment,
        user: {
          name: "Vous",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
          role: "Étudiant"
        },
        createdAt: "À l'instant",
        likes: 0,
        replies: []
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment("");
      setIsSubmitting(false);
      
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès.",
      });
    }, 1000);
  };
  
  const handleSubmitReply = (commentId: string) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReply: Comment = {
        id: `c${commentId}r${Date.now()}`,
        content: replyContent,
        user: {
          name: "Vous",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
          role: "Étudiant"
        },
        createdAt: "À l'instant",
        likes: 0
      };
      
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          return comment;
        })
      );
      
      setReplyTo(null);
      setReplyContent("");
      setIsSubmitting(false);
      
      toast({
        title: "Réponse ajoutée",
        description: "Votre réponse a été publiée avec succès.",
      });
    }, 1000);
  };
  
  const handleLoadMore = () => {
    setVisibleComments(comments.length);
  };
  
  const displayedComments = comments.slice(0, visibleComments);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Discussion du cours</h2>
      
      <div className="mb-8">
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
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-6">
        {displayedComments.length > 0 ? (
          displayedComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg border shadow-sm p-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{comment.user.name}</p>
                      <p className="text-sm text-gray-500">{comment.user.role} • {comment.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-gray-700">{comment.content}</div>
                  
                  <div className="mt-3 flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <Heart className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Répondre</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Flag className="h-4 w-4" />
                      <span>Signaler</span>
                    </Button>
                  </div>
                  
                  {replyTo === comment.id && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <Textarea
                        placeholder={`Répondre à ${comment.user.name}...`}
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
                          onClick={() => handleSubmitReply(comment.id)}
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
                        <div key={reply.id} className="pt-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                              <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{reply.user.name}</p>
                                  <p className="text-xs text-gray-500">{reply.user.role} • {reply.createdAt}</p>
                                </div>
                              </div>
                              
                              <div className="mt-1 text-gray-700 text-sm">{reply.content}</div>
                              
                              <div className="mt-2 flex items-center gap-3">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 text-xs gap-1"
                                  onClick={() => handleLikeComment(reply.id)}
                                >
                                  <Heart className="h-3 w-3" />
                                  <span>{reply.likes}</span>
                                </Button>
                              </div>
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
