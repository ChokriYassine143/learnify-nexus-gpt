import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag, X, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useForums } from "@/hooks/useForums";

const CATEGORIES = [
  { value: "web-development", label: "Web Development" },
  { value: "data-science", label: "Data Science" },
  { value: "mobile-apps", label: "Mobile Apps" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "career-development", label: "Career Development" },
  { value: "general-discussion", label: "General Discussion" },
];

const CreateForumPost: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { createForumTopic } = useForums();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    category?: string;
  }>({});
  
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    
    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) {
      setTagInput("");
      return;
    }
    
    if (tags.length >= 5) {
      toast({
        title: "Maximum 5 tags",
        description: "Vous ne pouvez pas ajouter plus de 5 tags.",
        variant: "destructive",
      });
      return;
    }
    
    setTags([...tags, trimmedTag]);
    setTagInput("");
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const validate = () => {
    const newErrors: {
      title?: string;
      content?: string;
      category?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (title.trim().length < 10) {
      newErrors.title = "Le titre doit contenir au moins 10 caractères";
    }
    
    if (!content.trim()) {
      newErrors.content = "Le contenu est requis";
    } else if (content.trim().length < 30) {
      newErrors.content = "Le contenu doit contenir au moins 30 caractères";
    }
    
    if (!category) {
      newErrors.category = "La catégorie est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    setIsSubmitting(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const authorId = user._id || storedUser.id;
      
      const newTopic = {
        title,
        content,
        category,
        tags,
        author: authorId,
        likes: [],
        isPinned: false,
        isLocked: false
      };

      const createdTopic = await createForumTopic(newTopic);
      
      toast({
        title: "Discussion créée avec succès",
        description: "Votre discussion a été publiée dans le forum.",
      });
      
      // Navigate to the new topic page
      const topicId = createdTopic.id || createdTopic._id;
      navigate(`/forum/${topicId}`, { replace: true });
    } catch (error: any) {
      console.error("Error creating forum topic:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la discussion. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Header />
      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Créer une nouvelle discussion</h1>
          <p className="text-gray-600 mb-8">
            Posez une question ou partagez vos connaissances avec la communauté
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block font-medium mb-1">
                Titre de la discussion
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Choisissez un titre clair et descriptif"
                className={errors.title ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block font-medium mb-1">
                Catégorie
              </label>
              <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Catégories</SelectLabel>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>
            
            <div>
              <label className="block font-medium mb-1">Tags (optionnel)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-primary/70 hover:text-primary"
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ajoutez des tags (appuyez sur Entrée après chaque tag)"
                  disabled={isSubmitting}
                />
                <Button type="button" variant="outline" onClick={handleAddTag} disabled={isSubmitting}>
                  Ajouter
                </Button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Vous pouvez ajouter jusqu'à 5 tags pour catégoriser votre discussion
              </p>
            </div>
            
            <div>
              <label htmlFor="content" className="block font-medium mb-1">
                Contenu
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Décrivez votre question ou partagez vos connaissances en détail"
                className={`min-h-[300px] ${errors.content ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.content}
                </p>
              )}
            </div>
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/forum")} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publication en cours..." : "Publier la discussion"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CreateForumPost;
