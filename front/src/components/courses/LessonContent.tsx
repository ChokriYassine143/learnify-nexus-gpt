import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, FileText, HelpCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseLesson } from "@/types";

interface LessonContentProps {
  lesson: CourseLesson;
  isEnrolled?: boolean;
  onEnroll?: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, isEnrolled = true, onEnroll }) => {
  // This would typically load content from an API based on the lesson ID
  
  // For locked content when not enrolled
  if (lesson.locked && !isEnrolled) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-5">
          <Lock className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Contenu verrouillé</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Inscrivez-vous à ce cours pour accéder à cette leçon et à tout le contenu du cours.
        </p>
        <Button onClick={onEnroll} size="lg">
          S'inscrire à ce cours
        </Button>
      </div>
    );
  }
  
  // Find video resource if any
  const videoResource = lesson.resources?.find(res => res.type === "video");
  // Other resources (not video)
  const otherResources = lesson.resources?.filter(res => res.type !== "video") || [];

  return (
    <div className="space-y-6">
      {/* Video */}
      {videoResource && (
        <div className="aspect-video bg-black rounded-md overflow-hidden">
          <video controls className="w-full h-full object-cover" src={`http://localhost:3000${videoResource.url}`} poster={videoResource.title || undefined} />
        </div>
      )}
      {/* Reading/Text Content */}
      {lesson.content && (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      )}
      {/* Resources */}
      {otherResources.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Ressources</h3>
          <ul className="list-disc pl-5 text-sm">
            {otherResources.map((res, idx) => (
              <li key={res.id || idx}>
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {res.title}
                </a> <span className="text-gray-500">({res.type})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Quizzes */}
      {lesson.quizzes && lesson.quizzes.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Quiz</h3>
          <ul className="list-disc pl-5 text-sm">
            {lesson.quizzes.map((quiz, idx) => (
              <li key={quiz.id || idx}>
                <span className="font-medium">{quiz.title}</span>: {quiz.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* If no content at all */}
      {!videoResource && !lesson.content && otherResources.length === 0 && (!lesson.quizzes || lesson.quizzes.length === 0) && (
        <div className="text-center py-10">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">
            Le contenu de cette leçon n'est pas disponible actuellement.
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonContent;
