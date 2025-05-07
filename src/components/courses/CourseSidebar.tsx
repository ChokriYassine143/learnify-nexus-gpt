
import React, { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { CheckCircle, Play, FileText, HelpCircle } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz";
  duration: string;
  complete: boolean;
}

interface Module {
  id: string;
  title: string;
  complete: boolean;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
  progress: number;
}

interface CourseSidebarProps {
  course: Course;
  currentLessonId: string;
  onLessonSelect: (lesson: Lesson) => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  currentLessonId,
  onLessonSelect,
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>(
    course.modules.map(m => m.id)
  );

  const getLessonIcon = (type: string) => {
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

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Contenu du cours</h3>
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">{course.progress}% terminé</span>
        </div>
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
                      onClick={() => onLessonSelect(lesson)}
                      className={`w-full flex items-start p-2 rounded-md text-sm text-left gap-2 ${
                        currentLessonId === lesson.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="mt-0.5">
                        {lesson.complete ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          getLessonIcon(lesson.type)
                        )}
                      </div>
                      
                      <div>
                        <div>{lesson.title}</div>
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
    </div>
  );
};

export default CourseSidebar;
