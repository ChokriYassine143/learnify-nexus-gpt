import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import { resourceService } from '../services/resourceService';
import { quizService } from '../services/quizService';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Course, CourseModule, CourseLesson, CourseProgress, Resource } from '@/types';

const API_URL = 'http://localhost:3000'; // You can make this configurable

console.log('CourseLearningPage file loaded');

const CourseLearningPage = () => {
  console.log('CourseLearningPage component function executed');
  const { user } = useAuth();
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [resources, setResources] = useState<Resource[]>([]);
  const [quizzes, setQuizzes] = useState([]);
  const [lessonResources, setLessonResources] = useState<Resource[]>([]);
  const [lessonQuizzes, setLessonQuizzes] = useState([]);
  const navigate = useNavigate();

  console.log('CourseLearningPage loaded');

  useEffect(() => {
    console.log('CourseLearningPage useEffect (loadCourse) running');
    const loadCourse = async () => {
      if (!courseId) return;
      
      try {
        const courseData = await courseService.getCourse(courseId);
        setCourse(courseData);

        // Get course progress
        const progressData = await courseService.getCourseProgress(courseId, user?.id || '');
        setProgress(progressData);

        if (progressData) {
          setCurrentModuleIndex(progressData.currentModuleIndex);
          setCurrentLessonIndex(progressData.currentLessonIndex);
        }

        // Check if user is instructor
        const isOwner = courseData.instructor === user?.id;

        // Check if user is enrolled
        const isEnrolled = (user?.enrolledCourses || []).includes(courseId);

        setIsAllowed(isOwner || isEnrolled);

        // Fetch course-level resources and quizzes
        const res = await resourceService.getResourcesByCourse(courseId);
        console.log('res:', res);
        setResources(res);
        const quiz = await quizService.getQuizzesByCourse(courseId);
        setQuizzes(quiz);
      } catch (error) {
        // Only keep this error log for debugging
        // Optionally, you can remove this line if you want zero logs:
        // console.error('Error loading course:', error);
      }
    };

    loadCourse();
  }, [courseId, user]);

  useEffect(() => {
    console.log('CourseLearningPage useEffect (fetchLessonExtras) running');
    const fetchLessonExtras = async () => {
      if (!course || !course.modules[currentModuleIndex] || !course.modules[currentModuleIndex].lessons[currentLessonIndex]) return;
      const lessonId = course.modules[currentModuleIndex].lessons[currentLessonIndex]._id || course.modules[currentModuleIndex].lessons[currentLessonIndex].id;
      const res = await resourceService.getResourcesByLesson(lessonId);
      console.log('lesson resources:', res);
      setLessonResources(res);
      const quiz = await quizService.getQuizzesByLesson(lessonId);
      setLessonQuizzes(quiz);
    };
    fetchLessonExtras();
  }, [course, currentModuleIndex, currentLessonIndex]);

  const renderLessonContent = (lesson: CourseLesson) => {
    console.log('Rendering lesson content:', lesson);
    const mainResource = lessonResources.find(resource => resource.type === lesson.type);
    console.log('mainResource:', mainResource, 'lessonResources:', lessonResources, 'lesson.type:', lesson.type);

    switch (lesson.type) {
      case 'video':
        if (mainResource) {
          console.log('Video URL:', `${API_URL}${mainResource.url}`);
        }
        return mainResource ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video controls className="w-full max-w-lg mt-2">
              <source src={`http://localhost:3000${mainResource.url}`} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">No video resource available</p>
          </div>
        );

      case 'reading':
        return mainResource ? (
          <div className="prose max-w-none">
            <iframe
              src={`${API_URL}${mainResource.url}`}
              className="w-full h-[600px] border-0"
              title={mainResource.title}
            />
          </div>
        ) : (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        );

      case 'quiz':
        const quiz = lessonQuizzes[0]; // Get the first quiz for this lesson
        return quiz ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{quiz.title}</h3>
            <p>{quiz.description}</p>
            <Button onClick={() => navigate(`/quiz/${quiz.id}`)}>
              Start Quiz
            </Button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No quiz available for this lesson
          </div>
        );

      default:
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        );
    }
  };

  if (!isAllowed) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-4">You must be enrolled in this course or be the instructor to access the content.</p>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </div>
    );
  }

  if (!course) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];
  console.log('Current lesson:', currentLesson);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <p className="text-gray-600 mb-8">{course.description}</p>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Course Navigation Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Course Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module._id || module.id} className="space-y-2">
                        <h3 className="font-semibold">{module.title}</h3>
                        <div className="pl-4 space-y-1">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson._id || lesson.id}
                              className={`cursor-pointer p-2 rounded ${
                                moduleIndex === currentModuleIndex && lessonIndex === currentLessonIndex
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => {
                                setCurrentModuleIndex(moduleIndex);
                                setCurrentLessonIndex(lessonIndex);
                              }}
                            >
                              {lesson.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3">
              {currentLesson && (
                <Card>
                  <CardHeader>
                    <CardTitle>{currentLesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderLessonContent(currentLesson)}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lessonResources.length > 0 ? (
              lessonResources.map((resource: Resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{resource.description}</p>
                    <Button className="mt-4" onClick={() => window.open(resource.url, '_blank')}>
                      {resource.type === 'video' ? 'Watch Video' : 'View Resource'}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No resources available for this lesson.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quizzes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessonQuizzes.length > 0 ? (
              lessonQuizzes.map((quiz: any) => (
                <Card key={quiz.id || quiz._id}>
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{quiz.description}</p>
                    <Button onClick={() => navigate(`/quiz/${quiz.id}`)}>Start Quiz</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                No quizzes available for this lesson.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseLearningPage; 