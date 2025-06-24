import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { courseService } from "@/services/courseService";
import { Course, CourseProgress, DiscussionReply } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, FileText, MessageSquare, BookOpen, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseSidebar, { Lesson } from "@/components/courses/CourseSidebar";
import LessonContent from "@/components/courses/LessonContent";
import QuizComponent from "@/components/courses/QuizComponent";
import { toast } from "@/hooks/use-toast";
import CourseDiscussion from "@/components/courses/CourseDiscussion";
import type { CourseDiscussion as CourseDiscussionType } from "@/types";
import { useAssignments } from "@/hooks/useAssignments";
import { Assignment, AssignmentSubmission } from '@/types';

console.log('USING src/pages/courses/CourseLearningPage.tsx');

const CourseLearningPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const { toast: useToastToast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<string>("");
  const [discussions, setDiscussions] = useState<CourseDiscussionType[]>([]);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const { getAllAssignments, createAssignment, submitAssignment, isLoading: assignmentsLoading } = useAssignments();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");
  const [assignmentDue, setAssignmentDue] = useState("");
  const [assignmentMaxScore, setAssignmentMaxScore] = useState<number | ''>('');
  const [submissionContent, setSubmissionContent] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [gradeInputs, setGradeInputs] = useState<{ [submissionId: string]: string }>({});
  
  useEffect(() => {
    const loadCourse = async () => {
      if (authLoading) return; // Wait for auth to finish loading!
      if (!user) {
        useToastToast({
          title: "Authentication Required",
          description: "Please sign in to access this course",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }

      try {
        // Load course data first
        const foundCourse = await courseService.getCourse(courseId!);
        if (!foundCourse) {
          useToastToast({
            title: "Error",
            description: "Course not found",
            variant: "destructive"
          });
          navigate("/courses");
          return;
        }
        setCourse(foundCourse);

        // Check if user is enrolled or is the owner
        const isEnrolled = Array.isArray(user.enrolledCourses) && 
          user.enrolledCourses.some(id => {
            const normalizedId = id?.toString();
            const normalizedCourseId = courseId?.toString();
            const normalizedFoundCourseId = foundCourse.id?.toString() || foundCourse._id?.toString();
            return normalizedId === normalizedCourseId || normalizedId === normalizedFoundCourseId;
          });
        const isOwner = foundCourse.instructor?.toString() === user.id?.toString() || 
                       foundCourse.instructor?.toString() === user._id?.toString();

        if (!isEnrolled && !isOwner) {
          // Try to refresh user data one more time before denying access
          await refreshUser();
          // Get the latest user from localStorage or context
          let refreshedUser = user;
          try {
            const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (storedUser && storedUser.id) {
              refreshedUser = { ...user, ...storedUser };
            }
          } catch {}
          const refreshedIsEnrolled = Array.isArray(refreshedUser.enrolledCourses) && 
            refreshedUser.enrolledCourses.some(id => {
              const normalizedId = id?.toString();
              const normalizedCourseId = courseId?.toString();
              const normalizedFoundCourseId = foundCourse.id?.toString() || foundCourse._id?.toString();
              return normalizedId === normalizedCourseId || normalizedId === normalizedFoundCourseId;
            });
          if (!refreshedIsEnrolled && !isOwner) {
            useToastToast({
              title: "Access Denied",
              description: "You are not enrolled in this course",
              variant: "destructive"
            });
            navigate("/courses");
            return;
          }
        }

        // Load progress (for students)
        let courseProgress = await courseService.getCourseProgress(courseId!, user.id);
        if (!courseProgress && (isEnrolled || (user && user.id && isOwner))) {
          // Initialize progress for enrolled students or owner
          courseProgress = {
            courseId: courseId!,
            userId: user.id,
            currentModuleIndex: 0,
            currentLessonIndex: 0,
            completedLessons: [],
            lastAccessedAt: new Date().toISOString(),
            status: "in_progress",
            quizScores: {}
          };
          await courseService.updateCourseProgress(courseId!, courseProgress);
        }
        setProgress(courseProgress || null);
        if (courseProgress) {
          setCurrentModuleIndex(courseProgress.currentModuleIndex);
          setCurrentLessonIndex(courseProgress.currentLessonIndex);
        }

        // Load notes
        const courseNotes = await courseService.getCourseNotes(user.id, courseId!);
        if (courseNotes) {
          setNotes(courseNotes.notes);
        }

        // Load discussions
        const courseDiscussions = await courseService.getCourseDiscussions(courseId!);
        setDiscussions(courseDiscussions);

      } catch (error) {
        console.error("Error loading course:", error);
        useToastToast({
          title: "Error",
          description: "Failed to load course",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, user, authLoading, navigate, useToastToast, refreshUser]);

  useEffect(() => {
    // Reload the course when module or lesson changes
    const reloadCourse = async () => {
      try {
        const foundCourse = await courseService.getCourse(courseId!);
        if (foundCourse) {
          setCourse(foundCourse);
        }
      } catch (error) {
        console.error("Error reloading course:", error);
      }
    };

    reloadCourse();
  }, [currentModuleIndex, currentLessonIndex, courseId]);

  useEffect(() => {
    if (!course) return;
    (async () => {
      const allAssignments = await getAllAssignments();
      setAssignments(allAssignments.filter(a => a.courseId === course.id));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  const handleLessonComplete = async () => {
    if (!user || !course || !progress) return;

    const currentLesson = course.modules[currentModuleIndex].lessons[currentLessonIndex];
    const lessonId = currentLesson.id;

    if (!progress.completedLessons.includes(lessonId)) {
      try {
        const updatedProgress: CourseProgress = {
          ...progress,
          userId: user.id,
          completedLessons: [...progress.completedLessons, lessonId],
          lastAccessedAt: new Date().toISOString(),
          status: progress.status || "in_progress"
        };
        await courseService.updateCourseProgress(courseId!, updatedProgress);
        setProgress(updatedProgress);
      } catch (error) {
        console.error("Error updating lesson progress:", error);
        toast({
          title: "Error",
          description: "Failed to update lesson progress",
          variant: "destructive"
        });
      }
    }
  };

  const handleNextLesson = () => {
    if (!course) return;

    const currentModule = course.modules[currentModuleIndex];
    const nextLessonIndex = currentLessonIndex + 1;

    if (nextLessonIndex < currentModule.lessons.length) {
      setCurrentLessonIndex(nextLessonIndex);
    } else {
      const nextModuleIndex = currentModuleIndex + 1;
      if (nextModuleIndex < course.modules.length) {
        setCurrentModuleIndex(nextModuleIndex);
        setCurrentLessonIndex(0);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      const previousModule = course!.modules[currentModuleIndex - 1];
      setCurrentLessonIndex(previousModule.lessons.length - 1);
    }
  };

  const handleSaveNotes = async () => {
    if (!user || !course) return;

    try {
      const courseNotes = {
        userId: user.id,
        courseId: courseId!,
        lessonId: currentLesson.id,
        notes,
        updatedAt: new Date().toISOString()
      };
      await courseService.updateCourseNotes(courseNotes);
      toast({
        title: "Success",
        description: "Notes saved successfully"
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive"
      });
    }
  };

  const handleAddDiscussion = async () => {
    if (!user || !course || !newDiscussion.trim()) return;

    try {
      const discussion: CourseDiscussionType = {
        id: `discussion-${Date.now()}`,
        courseId: courseId!,
        lessonId: currentLesson.id,
        userId: user.id,
        userName: user.name,
        content: newDiscussion,
        createdAt: new Date().toISOString(),
        replies: []
      };

      const createdDiscussion = await courseService.addCourseDiscussion(discussion);
      
      // Update discussions state with the new discussion
      setDiscussions(prevDiscussions => {
        const updatedDiscussions = [...prevDiscussions];
        // Find the index where to insert the new discussion
        const insertIndex = updatedDiscussions.findIndex(d => 
          new Date(d.createdAt) < new Date(createdDiscussion.createdAt)
        );
        if (insertIndex === -1) {
          updatedDiscussions.push(createdDiscussion);
        } else {
          updatedDiscussions.splice(insertIndex, 0, createdDiscussion);
        }
        return updatedDiscussions;
      });
      
      setNewDiscussion("");
      toast({
        title: "Success",
        description: "Discussion added successfully"
      });
    } catch (error) {
      console.error("Error adding discussion:", error);
      toast({
        title: "Error",
        description: "Failed to add discussion",
        variant: "destructive"
      });
    }
  };

  const handleAddReply = async (discussionId: string, reply: string) => {
    if (!user || !course || !reply.trim()) return;

    try {
      const newReply: DiscussionReply = {
        id: `reply-${Date.now()}`,
        discussionId: discussionId,
        courseId: courseId!,
        userId: user.id,
        userName: user.name,
        content: reply,
        createdAt: new Date().toISOString()
      };

      const updatedDiscussion = await courseService.addDiscussionReply(discussionId, newReply);
      
      // Update discussions state with the new reply
      setDiscussions(prevDiscussions => 
        prevDiscussions.map(d => 
          d.id === discussionId ? {
            ...d,
            replies: [...(d.replies || []), newReply]
          } : d
        )
      );
      
      toast({
        title: "Success",
        description: "Reply added successfully"
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Defensive checks for course, modules, lessons, and indices
  const currentModule = course?.modules?.[currentModuleIndex];
  const currentLesson = currentModule?.lessons?.[currentLessonIndex];

  if (
    !course ||
    !progress ||
    !Array.isArray(course.modules) ||
    !currentModule ||
    !Array.isArray(currentModule.lessons) ||
    !currentLesson
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Course Data Error</h2>
        <p className="mb-6">The course, module, or lesson data is missing or malformed. Please try again or contact support.</p>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
  const completedLessons = progress.completedLessons.length;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CourseSidebar
                course={course}
                progress={progress}
                onModuleSelect={setCurrentModuleIndex}
                onLessonSelect={(moduleIndex, lessonIndex) => {
                  setCurrentModuleIndex(moduleIndex);
                  setCurrentLessonIndex(lessonIndex);
                }}
              />
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h1 className="text-2xl font-bold">{course.title}</h1>
                        <p className="text-gray-600 mt-1">
                          {currentModule?.title} - {currentLesson.title}
                        </p>
                      </div>
                    </div>
                    {/* What You'll Learn */}
                    <div className="mt-4">
                      <h2 className="mb-2 text-lg font-semibold">What You'll Learn</h2>
                      {course.objectives && course.objectives.length > 0 ? (
                        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          {course.objectives.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="mr-2 mt-1 rounded-full bg-primary-100 p-0.5 text-primary">
                                <ChevronRight className="h-4 w-4" />
                              </div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>No data available</div>
                      )}
                    </div>
                  </div>
                  
                  {progress && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression du cours</span>
                        <span>{progressPercentage.toFixed(2)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  )}
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="content">Contenu</TabsTrigger>
                      <TabsTrigger value="discussions">Discussions</TabsTrigger>
                      <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="mt-4 min-h-[400px]">
                      {/* Show the main resource for the lesson as the content, or the quiz if lesson type is quiz */}
                      {currentLesson.type === "quiz" && currentLesson.quizzes && currentLesson.quizzes.length > 0 ? (
                        <QuizComponent quiz={currentLesson.quizzes[0]} />
                      ) : currentLesson.resources && currentLesson.resources.length > 0 ? (
                        (() => {
                          const resource = currentLesson.resources[0];
                          switch (resource.type) {
                            case "video":
                              if (resource) {
                                console.log('Video URL:', `http://localhost:3000${resource.url}`);
                              }
                              return resource ? (
                                <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                                  <video
                                    key={resource.url}
                                    controls
                                    className="w-full rounded-lg shadow-lg bg-black"
                                    style={{ maxHeight: 480 }}
                                  >
                                    <source src={`http://localhost:3000${resource.url}`} type="video/mp4" />
                                    Votre navigateur ne supporte pas la lecture vidéo.
                                  </video>
                                </div>
                              ) : (
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                  <p className="text-gray-500">No video resource available</p>
                                </div>
                              );
                            case "document":
                              return (
                                <Button asChild variant="outline" size="sm">
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">Télécharger le document</a>
                                </Button>
                              );
                            case "link":
                              return (
                                <Button asChild variant="outline" size="sm">
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">Ouvrir le lien</a>
                                </Button>
                              );
                            default:
                              return <div className="text-gray-500 italic">Type de ressource non supporté.</div>;
                          }
                        })()
                      ) : (
                        <div className="text-gray-500 italic">Aucune ressource disponible pour cette leçon.</div>
                      )}
                      <div className="mt-8 flex justify-between">
                        <Button 
                          variant="outline"
                          onClick={handlePreviousLesson}
                          disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Leçon précédente
                        </Button>
                        <Button 
                          onClick={() => {
                            handleLessonComplete();
                            handleNextLesson();
                          }}
                          disabled={
                            currentModuleIndex === course.modules.length - 1 &&
                            currentLessonIndex === currentModule.lessons.length - 1
                          }
                        >
                          Leçon suivante
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="discussions" className="mt-4">
                      <CourseDiscussion courseId={course.id} lessonId={currentLesson.id} />
                    </TabsContent>
                    
                    <TabsContent value="assignments" className="mt-4">
                      {user?.role === "teacher" ? (
                        <div>
                          <h3 className="font-semibold mb-2">Create New Assignment</h3>
                          <input type="text" placeholder="Title" value={assignmentTitle} onChange={e => setAssignmentTitle(e.target.value)} className="border p-2 rounded mb-2 w-full" />
                          <textarea placeholder="Description" value={assignmentDesc} onChange={e => setAssignmentDesc(e.target.value)} className="border p-2 rounded mb-2 w-full" />
                          <input type="date" value={assignmentDue} onChange={e => setAssignmentDue(e.target.value)} className="border p-2 rounded mb-2 w-full" />
                          <input
                            type="number"
                            placeholder="Max Score"
                            value={assignmentMaxScore}
                            onChange={e => setAssignmentMaxScore(e.target.value ? Number(e.target.value) : '')}
                            className="border p-2 rounded mb-2 w-full"
                          />
                          <Button onClick={async () => {
                            if (!assignmentTitle || !assignmentDesc || !assignmentDue || assignmentMaxScore === '') {
                              toast({
                                title: "Error",
                                description: "Please fill in all fields before creating an assignment.",
                                variant: "destructive"
                              });
                              return;
                            }
                            await createAssignment({
                              title: assignmentTitle,
                              description: assignmentDesc,
                              dueDate: assignmentDue,
                              courseId: course.id,
                              maxScore: assignmentMaxScore,
                            });
                            setAssignmentTitle(""); setAssignmentDesc(""); setAssignmentDue(""); setAssignmentMaxScore('');
                            const allAssignments = await getAllAssignments();
                            setAssignments(allAssignments.filter(a => a.courseId === course.id));
                          }}>Create Assignment</Button>
                          <div className="mt-6">
                            <h4 className="font-semibold mb-2">Assignments</h4>
                            {assignments.map(a => (
                              <Card key={a.id || a._id || a.title} className="mb-4">
                                <CardContent>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">{a.title}</div>
                                      <div className="text-sm text-gray-600">Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : ""}</div>
                                    </div>
                                    <Button onClick={() => setSelectedAssignment(a)}>View Submissions</Button>
                                  </div>
                                  {selectedAssignment?.id === a.id && Array.isArray(a.submissions) && (
                                    <div className="mt-4">
                                      <h5 className="font-semibold mb-2">Submissions</h5>
                                      {a.submissions.length === 0 ? <div>No submissions yet.</div> : a.submissions.map((s: AssignmentSubmission) => (
                                        <div key={s.id || s._id || (s.studentId + (s.assignmentId || ''))} className="border p-2 rounded mb-2">
                                          <div>Student: {s.studentId}</div>
                                          <div>Content: {s.content}</div>
                                          <div>Status: {s.status}</div>
                                          <div>Grade: {s.grade || "Not graded"}</div>
                                          <input type="text" placeholder="Grade" value={gradeInputs[s.id] ?? s.grade ?? ""} onChange={e => setGradeInputs(prev => ({ ...prev, [s.id]: e.target.value }))} className="border p-1 rounded mr-2" />
                                          <Button size="sm" onClick={async () => {
                                            // TODO: Implement grade submission logic here
                                            // await gradeSubmission(a.id, s.id, gradeInputs[s.id], "");
                                          }}>Submit Grade</Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold mb-2">Assignments</h4>
                          {assignments.length === 0 ? <div>No assignments for this course.</div> : assignments.map(a => (
                            <Card key={a.id || a._id || a.title} className="mb-4">
                              <CardContent>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">{a.title}</div>
                                    <div className="text-sm text-gray-600">Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : ""}</div>
                                  </div>
                                  <Button onClick={() => setSelectedAssignment(a)}>Submit</Button>
                                </div>
                                {selectedAssignment?.id === (a.id || a._id) && (
                                  <div className="mt-4">
                                    <textarea 
                                      placeholder="Your answer" 
                                      value={submissionContent} 
                                      onChange={e => setSubmissionContent(e.target.value)} 
                                      className="border p-2 rounded mb-2 w-full" 
                                    />
                                    <Button 
                                      onClick={async () => {
                                        if (!submissionContent) {
                                          toast({
                                            title: "Error",
                                            description: "Please enter your answer before submitting.",
                                            variant: "destructive"
                                          });
                                          return;
                                        }
                                        const assignmentId = a.id || a._id;
                                        if (!assignmentId) {
                                          toast({
                                            title: "Error",
                                            description: "Invalid assignment ID. Please try again.",
                                            variant: "destructive"
                                          });
                                          return;
                                        }
                                        try {
                                          console.log('Submitting assignment:', { assignmentId, content: submissionContent });
                                          await submitAssignment(assignmentId, submissionContent);
                                          setSubmissionContent("");
                                          setSelectedAssignment(null);
                                          toast({
                                            title: "Success",
                                            description: "Assignment submitted successfully"
                                          });
                                          // Refresh assignments list
                                          const allAssignments = await getAllAssignments();
                                          setAssignments(allAssignments.filter(assignment => assignment.courseId === course.id));
                                        } catch (error) {
                                          console.error("Error submitting assignment:", error);
                                          toast({
                                            title: "Error",
                                            description: "Failed to submit assignment. Please try again.",
                                            variant: "destructive"
                                          });
                                        }
                                      }}
                                    >
                                      Submit Assignment
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseLearningPage;
