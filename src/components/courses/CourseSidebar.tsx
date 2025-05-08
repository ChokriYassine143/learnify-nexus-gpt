
import React, { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { CheckCircle, Play, FileText, HelpCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz";
  duration: string;
  complete: boolean;
  locked?: boolean;
}

export interface Module {
  id: string;
  title: string;
  complete: boolean;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor?: string;
  modules: Module[];
  progress: number;
  enrolled?: boolean;
}

interface CourseSidebarProps {
  course: Course;
  currentLessonId: string;
  onLessonSelect: (lesson: Lesson) => void;
  isEnrolled?: boolean;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  currentLessonId,
  onLessonSelect,
  isEnrolled = true,
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>(
    course.modules.map(m => m.id)
  );

  const getLessonIcon = (type: string, locked?: boolean) => {
    if (locked) return <Lock className="h-4 w-4 text-gray-400" />;
    
    switch(type) {
      case "video": return <Play className="h-4 w-4 text-primary" />;
      case "reading": return <FileText className="h-4 w-4 text-blue-500" />;
      case "quiz": return <HelpCircle className="h-4 w-4 text-orange-500" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getLessonTypeLabel = (type: string) => {
    switch(type) {
      case "video": return "Vidéo";
      case "reading": return "Lecture";
      case "quiz": return "Quiz";
      default: return type;
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.locked && !isEnrolled) return;
    onLessonSelect(lesson);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Contenu du cours</h3>
        <div className="mt-2 flex items-center gap-2">
          <Progress value={course.progress} className="h-2 flex-1" />
          <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
        </div>
        
        {!isEnrolled && (
          <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200 text-sm text-amber-800">
            Inscrivez-vous pour accéder à tout le contenu du cours
          </div>
        )}
      </div>

      <Accordion 
        type="multiple"
        value={expandedModules}
        onValueChange={setExpandedModules}
        className="px-2"
      >
        {course.modules.map((module) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger className="py-3 px-2 text-sm hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                {module.complete ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                )}
                <span>{module.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="pl-6 space-y-1">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button
                      onClick={() => handleLessonClick(lesson)}
                      disabled={lesson.locked && !isEnrolled}
                      className={cn(
                        "w-full flex items-start p-2 rounded-md text-sm text-left gap-2",
                        currentLessonId === lesson.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100",
                        lesson.locked && !isEnrolled && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      <div className="mt-0.5">
                        {lesson.complete ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          getLessonIcon(lesson.type, lesson.locked && !isEnrolled)
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start">
                          <span className="flex-1">{lesson.title}</span>
                          {lesson.locked && !isEnrolled && <Lock className="h-3 w-3 text-gray-400 flex-shrink-0 ml-1" />}
                        </div>
                        <div className="text-xs text-gray-500 flex gap-2 mt-1">
                          <span>{getLessonTypeLabel(lesson.type)}</span>
                          <span>•</span>
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {!isEnrolled && (
        <div className="p-4 border-t">
          <Button className="w-full">S'inscrire maintenant</Button>
        </div>
      )}
    </div>
  );
};

export default CourseSidebar;
