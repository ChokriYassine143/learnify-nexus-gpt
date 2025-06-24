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
import { Course, CourseProgress, CourseModule, CourseLesson } from "@/types";
import { CheckCircle2, Circle } from "lucide-react";

interface CourseSidebarProps {
  course: Course;
  progress: CourseProgress;
  onModuleSelect: (moduleIndex: number) => void;
  onLessonSelect: (moduleIndex: number, lessonIndex: number) => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  progress,
  onModuleSelect,
  onLessonSelect
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>(
    course.modules.map(m => m._id || m.id || '')
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

  const handleLessonClick = (lesson: CourseLesson) => {
    if (lesson.locked && !course.enrolled) return;
    onLessonSelect(course.modules.findIndex(m => m.lessons.includes(lesson)), course.modules.find(m => m.lessons.includes(lesson))!.lessons.findIndex(l => l._id === lesson._id || l.id === lesson.id));
  };

  return (
    <div className="w-80 border-r h-screen overflow-y-auto p-4">
      <h2 className="text-xl font-bold mb-4">{course.title}</h2>
      <div className="space-y-4">
        {course.modules.map((module, moduleIndex) => (
          <div key={module._id || module.id || moduleIndex}>
            <Button
              variant="ghost"
              className="w-full justify-start font-medium"
              onClick={() => onModuleSelect(moduleIndex)}
            >
              {module.title}
            </Button>
            <div className="ml-4 space-y-1">
              {module.lessons.map((lesson, lessonIndex) => (
                <Button
                  key={`${module._id || module.id || moduleIndex}-${lesson._id || lesson.id || lessonIndex}`}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => onLessonSelect(moduleIndex, lessonIndex)}
                  disabled={lesson.locked && !course.enrolled}
                >
                  {progress.completedLessons.includes(lesson._id || lesson.id || '') ? (
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 mr-2" />
                  )}
                  {lesson.title}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
