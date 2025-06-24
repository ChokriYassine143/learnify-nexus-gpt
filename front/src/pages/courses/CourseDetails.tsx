import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { courseService } from "@/services/courseService";
import { userService } from "@/services/userService";
import { Course, User, CourseDiscussion, CourseProgress, Payment } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  Home,
  MessageSquare,
  Play,
  Star,
  User as UserIcon,
  Video,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EnrollButton from "@/components/courses/EnrollButton";

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, enrollInCourse } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [discussions, setDiscussions] = useState<CourseDiscussion[]>([]);
  const [userReview, setUserReview] = useState<string>("");
  const [instructorUser, setInstructorUser] = useState<User | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvc: '' });
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (user === undefined) return;
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const foundCourse = await courseService.getCourse(id);
        
        if (!foundCourse) {
          toast({
            title: "Error",
            description: "Course not found",
            variant: "destructive"
          });
          setCourse(null);
          setIsLoading(false);
          return;
        }

        setCourse(foundCourse);

        // Fetch instructor user
        try {
          const instructor = await userService.getPublicUserById(foundCourse.instructor);
          setInstructorUser(instructor);
        } catch (err) {
          setInstructorUser(null);
        }

        // Load discussions (reviews)
        // const courseDiscussions = await courseService.getCourseDiscussions(id);
        // setDiscussions(courseDiscussions);

        // Only check enrollment if user and user.id exist
        if (user && user.id) {
          const isUserEnrolled = await courseService.isUserEnrolled(user.id, id);
          setIsEnrolled(isUserEnrolled);
        } else {
          setIsEnrolled(false);
        }
      } catch (error) {
        console.error("Error loading course details:", error);
        toast({
          title: "Error",
          description: "Failed to load course details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user || !course) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in this course",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !course) return;
    
    setIsPaying(true);
    try {
      const payment = {
        userId: user.id,
        courseId: course.id,
        amount: course.price,
        currency: "EUR",
        status: "completed",
        paymentMethod: "card",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('Sending payment object:', payment);
      await courseService.createPayment(payment);
      await enrollInCourse(course.id);
      setIsEnrolled(true);
      setShowPaymentModal(false);
      
      toast({
        title: "Success",
        description: "You have successfully enrolled in this course",
      });
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive"
      });
    } finally {
      setIsPaying(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !course) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newDiscussion: Omit<CourseDiscussion, "id" | "createdAt"> = {
        courseId: course.id,
        lessonId: "", // Not lesson-specific
        userId: user.id,
        userName: user.name,
        content: userReview,
        replies: []
      };
      
      // const createdDiscussion = await courseService.createCourseDiscussion(newDiscussion);
      // setDiscussions(prev => [...prev, createdDiscussion]);
      // setUserReview("");
      //
      // toast({
      //   title: "Success",
      //   description: "Your review has been submitted"
      // });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  // Calculate total hours and document resources
  const totalMinutes = course && course.modules ? course.modules.reduce((sum, module) => {
    return sum + module.lessons.reduce((lSum, lesson) => lSum + (typeof lesson.duration === 'number' ? lesson.duration : 0), 0);
  }, 0) : 0;
  const totalHours = Math.round((totalMinutes / 60) * 100) / 100;
  const totalDocuments = course && course.modules ? course.modules.reduce((sum, module) => {
    return sum + module.lessons.reduce((lSum, lesson) => lSum + (lesson.resources ? lesson.resources.filter(r => r.type === 'document').length : 0), 0);
  }, 0) : 0;

  // Helper to get icon and label for lesson type
  const getLessonTypeIconAndLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return { icon: <Play className="h-4 w-4 text-primary" />, label: 'Vidéo' };
      case 'reading':
        return { icon: <FileText className="h-4 w-4 text-blue-500" />, label: 'Lecture' };
      case 'assignment':
        return { icon: <Book className="h-4 w-4 text-green-500" />, label: 'Exercice' };
      case 'quiz':
        return { icon: <MessageSquare className="h-4 w-4 text-orange-500" />, label: 'Quiz' };
      default:
        return { icon: <Play className="h-4 w-4" />, label: type };
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Course Not Found or Data Error</h2>
        <p className="mb-6">The course you are looking for does not exist, or its data is malformed. Please try again or contact support.</p>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </div>
    );
  }
  
  return (
    <>
      <Header />
      <main>
        {/* Course Hero */}
        <div className="bg-gray-50 pt-8 pb-16">
          <div className="container">
            <div className="mb-4 flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-primary">
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link to="/courses" className="hover:text-primary">
                Courses
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span>{course.category}</span>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <Badge variant="outline" className="mb-4">
                  {course.category}
                </Badge>
                <h1 className="mb-4 text-3xl font-bold">{course.title}</h1>
                
                <p className="mb-6 text-gray-600">
                  {course.description}
                </p>
                
                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {typeof course.rating === 'number' ? course.rating : 'No ratings yet'} ({discussions.length} reviews)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="mr-1 h-4 w-4" />
                    <span>{typeof course.enrolledStudents === 'number' ? course.enrolledStudents.toLocaleString() : '0'} students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{course.duration || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Book className="mr-1 h-4 w-4" />
                    <span>{course.level || 'All Levels'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Last updated 1 month ago</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <img
                    src={instructorUser?.avatar || '/default-avatar.png'}
                    alt={instructorUser?.name || 'Instructor'}
                    className="mr-4 h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {instructorUser?.name ||
                        ((instructorUser?.firstName || instructorUser?.lastName)
                          ? `${instructorUser?.firstName || ''} ${instructorUser?.lastName || ''}`.trim()
                          : 'Instructor Name Unavailable')}
                    </p>
                    <p className="text-sm text-gray-500">{instructorUser?.bio || 'No bio available.'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="relative mb-4 aspect-video overflow-hidden rounded-md">
                    <img
                      src={course.image || '/default-course.png'}
                      alt={course.title || 'Course'}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-16 w-16 rounded-full bg-white/90 hover:bg-white"
                      >
                        <Play className="h-8 w-8 fill-primary text-primary" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-4 text-center">
                    <div className="mb-2 text-3xl font-bold">
                      {typeof course.price === 'number' ? course.price.toLocaleString('fr-FR') : 'N/A'} €
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {isEnrolled ? (
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/course/${course.id}/learn`)}
                      >
                        Continue Learning
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={handleEnroll}
                      >
                        Enroll Now
                      </Button>
                    )}
                    <Button variant="outline" className="w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Ajouter aux favoris
                    </Button>
                  </div>
                  
                  {/* Sum of hours and document resources */}
                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex items-center">
                      <Video className="mr-2 h-4 w-4 text-gray-500" />
                      {totalHours} hours of content
                    </div>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-gray-500" />
                      {totalDocuments} downloadable resources
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      30-Day Money-Back Guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Content */}
        <div className="container py-12">
          <Tabs defaultValue="overview">
            <TabsList className="mb-8 w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-8">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">About This Course</h2>
                  <div className="prose max-w-none">
                    <p>
                      {course.description}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="mb-4 text-2xl font-bold">What You'll Learn</h2>
                  {course.objectives && course.objectives.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {course.objectives.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 mt-1 rounded-full bg-primary-100 p-0.5 text-primary">
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
                
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Requirements</h2>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Basic computer skills</li>
                    <li>No prior programming experience required</li>
                    <li>Computer with internet connection</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum">
              <div className="space-y-4">
                {course.modules && Array.isArray(course.modules) ? course.modules.map((module, moduleIdx) => (
                  <div 
                    key={`module-${module.id || moduleIdx}`} 
                    className="rounded-lg border border-gray-200 mb-4"
                  >
                    <div className="flex items-center justify-between bg-gray-50 p-4">
                      <h3 className="font-semibold text-lg">{module.title || `Module ${moduleIdx + 1}`}</h3>
                      <span className="text-sm text-gray-500">{module.lessons?.length || 0} lessons</span>
                    </div>
                    <div className="divide-y">
                      {module.lessons && module.lessons.length > 0 ? module.lessons.map((lesson, lessonIdx) => (
                        <div key={`lesson-${module.id || moduleIdx}-${lesson.id || lessonIdx}`} className="p-4 flex flex-col gap-2 bg-white">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{lesson.order || lessonIdx + 1}.</span>
                            <span className="font-semibold">{lesson.title}</span>
                            <span className="flex items-center gap-1">
                              {getLessonTypeIconAndLabel(lesson.type).icon}
                              <Badge variant="outline">{getLessonTypeIconAndLabel(lesson.type).label}</Badge>
                            </span>
                            <span className="text-xs text-gray-500">{lesson.duration} min</span>
                          </div>
                          {lesson.content && (
                            <div className="text-gray-700 text-sm pl-7">{lesson.content}</div>
                          )}
                          {/* Resources */}
                          {lesson.resources && lesson.resources.length > 0 && (
                            <div className="pl-7">
                              <div className="font-semibold text-xs mt-2 mb-1">Resources:</div>
                              <ul className="list-disc pl-5 text-xs">
                                {lesson.resources.map((res, rIdx) => (
                                  <li key={`res-${moduleIdx}-${lessonIdx}-${rIdx}`}>
                                    {res.title} <span className="text-gray-500">({res.type})</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {/* Add Quiz Button for Quiz Lessons */}
                          {lesson.type === 'quiz' && (
                            <div className="pl-7 mt-2">
                              <button
                                className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary-700"
                                onClick={() => alert('Add Quiz functionality goes here!')}
                              >
                                Add Quiz
                              </button>
                            </div>
                          )}
                          {/* Quizzes */}
                          {lesson.quizzes && lesson.quizzes.length > 0 && (
                            <div className="pl-7">
                              <div className="font-semibold text-xs mt-2 mb-1">Quizzes:</div>
                              <ul className="list-disc pl-5 text-xs">
                                {lesson.quizzes.map((quiz, qIdx) => (
                                  <li key={`quiz-${moduleIdx}-${lessonIdx}-${qIdx}`}>
                                    <span className="font-medium">{quiz.title}</span>: {quiz.description}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )) : (
                        <div className="p-4 text-gray-400 text-sm">No lessons in this module.</div>
                      )}
                    </div>
                  </div>
                )) : <div>No curriculum data available</div>}
              </div>
            </TabsContent>
            
            <TabsContent value="instructor">
              <div>
                <div className="mb-6 flex items-center">
                  <img
                    src={instructorUser?.avatar || '/default-avatar.png'}
                    alt={instructorUser?.name || 'Instructor'}
                    className="mr-6 h-24 w-24 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {instructorUser?.name ||
                        ((instructorUser?.firstName || instructorUser?.lastName)
                          ? `${instructorUser?.firstName || ''} ${instructorUser?.lastName || ''}`.trim()
                          : 'Instructor Name Unavailable')}
                    </h2>
                    <p className="text-gray-600">{instructorUser?.bio || 'No bio available.'}</p>
                  </div>
                </div>
                
                <div className="mb-6 flex space-x-6 text-sm">
                  <div>
                    <span className="font-medium">4.7</span> Instructor Rating
                  </div>
                  <div>
                    <span className="font-medium">24</span> Courses
                  </div>
                  <div>
                    <span className="font-medium">75,429</span> Students
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p>
                    Prof. John Smith is a senior web developer with over 15 years of industry experience. 
                    He has worked with Fortune 500 companies and startups alike, building scalable web 
                    applications and mentoring junior developers.
                  </p>
                  <p>
                    John is passionate about education and has been teaching web development for the 
                    past 8 years, both online and at several universities. His teaching philosophy 
                    focuses on practical, hands-on learning that prepares students for real-world challenges.
                  </p>
                  <p>
                    He holds a Master's degree in Computer Science and is a frequent speaker at web 
                    development conferences around the world.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div>
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold">Student Reviews</h2>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="text-4xl font-bold">{typeof course.rating === 'number' ? course.rating.toFixed(1) : 'N/A'}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              typeof course.rating === 'number' && i < Math.round(course.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Course Rating • {discussions.length} Reviews
                      </div>
                    </div>
                  </div>
                </div>

                {isEnrolled && (
                  <div className="mb-8 rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium">Your Review</label>
                      <textarea
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        className="w-full rounded-md border p-2"
                        rows={4}
                        placeholder="Share your experience with this course..."
                      />
                    </div>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={!userReview}
                    >
                      Submit Review
                    </Button>
                  </div>
                )}
                
                <div className="space-y-6">
                  {discussions.map((discussion) => (
                    <div key={`review-${discussion.id}-${discussion.createdAt}`} className="border-b border-gray-200 pb-6">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">{discussion.userName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(discussion.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700">{discussion.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Card Number</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={paymentInfo.cardNumber}
                  onChange={e => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  required
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Expiry</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={paymentInfo.expiry}
                    onChange={e => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">CVC</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={paymentInfo.cvc}
                    onChange={e => setPaymentInfo({ ...paymentInfo, cvc: e.target.value })}
                    required
                    maxLength={4}
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowPaymentModal(false)} disabled={isPaying}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPaying}>
                  {isPaying ? 'Processing...' : 'Pay & Enroll'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Helper component for link
const Link = ({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) => {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
};

export default CourseDetails;

