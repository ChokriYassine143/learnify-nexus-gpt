
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, FileText, HelpCircle } from "lucide-react";

interface LessonContentProps {
  lesson: {
    id: string;
    title: string;
    type: string;
  }
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  // This would typically load content from an API based on the lesson ID
  
  // For demo purposes, we'll render different content based on lesson type
  const renderContent = () => {
    switch (lesson.type) {
      case "video":
        return (
          <div className="space-y-6">
            <div className="aspect-video bg-gray-900 rounded-md flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-white/50 mx-auto" />
                <p className="text-white/70 mt-4">Vidéo de démonstration</p>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h2>Introduction</h2>
              <p>
                Dans cette vidéo, vous apprendrez les concepts fondamentaux de cette leçon.
                Les points clés à retenir sont :
              </p>
              <ul>
                <li>Comment structurer correctement votre code</li>
                <li>Les bonnes pratiques à suivre</li>
                <li>Comment appliquer ces concepts à des cas réels</li>
              </ul>
              <p>
                N'hésitez pas à prendre des notes et à pauser la vidéo pour pratiquer 
                les concepts présentés.
              </p>
              
              <h2>Transcription</h2>
              <p>
                Bonjour à tous ! Dans cette leçon, nous allons explorer les concepts 
                fondamentaux de ce sujet. Commençons par comprendre pourquoi c'est important...
              </p>
              <p>
                [Transcription complète serait disponible ici...]
              </p>
            </div>
          </div>
        );
        
      case "reading":
        return (
          <div className="prose max-w-none">
            <h1>CSS Layouts et Design Responsive</h1>
            
            <p>
              Le design responsive est une approche de conception web qui rend les pages web 
              bien rendues sur une variété d'appareils et de tailles de fenêtre ou d'écran.
            </p>
            
            <h2>Les principes fondamentaux</h2>
            
            <p>
              Pour créer un design responsive efficace, nous devons comprendre ces concepts clés :
            </p>
            
            <ul>
              <li>
                <strong>Viewport</strong> - L'aire visible d'une page web pour l'utilisateur.
              </li>
              <li>
                <strong>Media Queries</strong> - Permettent d'appliquer différents styles selon les 
                caractéristiques de l'appareil.
              </li>
              <li>
                <strong>Unités relatives</strong> - Comme em, rem, %, vh, vw qui s'adaptent au contexte.
              </li>
              <li>
                <strong>Images flexibles</strong> - Images qui s'adaptent à la taille de leur conteneur.
              </li>
            </ul>
            
            <h2>Layouts CSS modernes</h2>
            
            <p>
              Les layouts modernes en CSS utilisent principalement Flexbox et Grid :
            </p>
            
            <h3>Flexbox</h3>
            
            <p>
              Flexbox est idéal pour les layouts unidimensionnels, comme des barres de navigation
              ou des éléments alignés en ligne ou en colonne.
            </p>
            
            <pre><code>{`.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`}</code></pre>
            
            <h3>CSS Grid</h3>
            
            <p>
              CSS Grid est parfait pour les layouts bidimensionnels, comme des galeries d'images
              ou des mises en page complexes.
            </p>
            
            <pre><code>{`.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}`}</code></pre>
            
            <h2>Media Queries</h2>
            
            <p>
              Les media queries nous permettent de modifier notre layout selon la taille de l'écran :
            </p>
            
            <pre><code>{`/* Mobile first */
.container {
  flex-direction: column;
}

/* Pour les écrans plus larges */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}`}</code></pre>
            
            <h2>Conclusion</h2>
            
            <p>
              En combinant ces techniques, vous pouvez créer des interfaces web qui s'adaptent
              parfaitement à tous les appareils, de mobile aux grands écrans.
            </p>
          </div>
        );
        
      case "quiz":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Quiz sur les layouts CSS</h2>
            <p className="mb-6 text-gray-600">
              Complétez ce quiz pour tester vos connaissances sur cette leçon.
              Vous devez obtenir au moins 80% de bonnes réponses pour valider.
            </p>
            
            {/* Quiz component would be rendered here */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
              <HelpCircle className="h-12 w-12 mx-auto text-primary opacity-50" />
              <p className="mt-4">Le composant de quiz sera chargé ici</p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-10">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">
              Le contenu de cette leçon n'est pas disponible actuellement.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default LessonContent;
