
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Home,
  MessageSquare,
  Play,
  Star,
  User,
  Video,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const COURSES = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    instructor: "Prof. John Smith",
    instructorTitle: "Senior Web Developer & Educator",
    instructorImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    level: "Beginner",
    rating: 4.7,
    reviewCount: 324,
    duration: "10 weeks",
    students: 12543,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Web Development",
    price: 49.99,
    description: "Learn the fundamentals of web development in this comprehensive course. You'll master HTML, CSS, and JavaScript to build responsive websites from scratch. Perfect for beginners looking to start a career in web development.",
    whatYouWillLearn: [
      "Build responsive websites using HTML, CSS, and JavaScript",
      "Understand core web development concepts",
      "Create modern UI/UX designs",
      "Deploy your websites to the internet",
      "Optimize your sites for performance and SEO",
      "Work with popular frameworks and libraries"
    ],
    courseContent: [
      {
        title: "Introduction to Web Development",
        lessons: [
          { title: "Course Overview", duration: "10:15", type: "video" },
          { title: "Setting Up Your Development Environment", duration: "15:30", type: "video" },
          { title: "Understanding the Web", duration: "12:45", type: "video" },
          { title: "Quiz: Web Development Basics", type: "quiz" }
        ]
      },
      {
        title: "HTML Basics",
        lessons: [
          { title: "HTML Document Structure", duration: "14:20", type: "video" },
          { title: "Working with Text and Lists", duration: "18:05", type: "video" },
          { title: "Creating Links and Navigation", duration: "16:40", type: "video" },
          { title: "HTML Exercise", type: "assignment" }
        ]
      },
      {
        title: "CSS Fundamentals",
        lessons: [
          { title: "Intro to CSS", duration: "12:35", type: "video" },
          { title: "Selectors and Properties", duration: "20:15", type: "video" },
          { title: "Layout with CSS", duration: "22:10", type: "video" },
          { title: "CSS Challenge", type: "assignment" }
        ]
      }
    ],
    reviews: [
      {
        id: "r1",
        user: "Alex Thompson",
        rating: 5,
        date: "2023-06-15",
        comment: "This course exceeded my expectations! The content is well-structured and the instructor explains complex concepts in a very understandable way."
      },
      {
        id: "r2",
        user: "Maria Garcia",
        rating: 4,
        date: "2023-05-22",
        comment: "Great course for beginners. I came in with zero knowledge and now feel confident in my web development skills. Would recommend!"
      },
      {
        id: "r3",
        user: "James Wilson",
        rating: 5,
        date: "2023-04-30",
        comment: "Prof. Smith is an excellent teacher. The exercises are practical and helped me apply what I learned immediately."
      }
    ]
  }
];

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find((c) => c.id === id) || COURSES[0]; // Fallback to first course
  const [activeContentSection, setActiveContentSection] = useState<number>(0);
  
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
                      {course.rating} ({course.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Book className="mr-1 h-4 w-4" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Last updated 1 month ago</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <img
                    src={course.instructorImage}
                    alt={course.instructor}
                    className="mr-4 h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-sm text-gray-500">{course.instructorTitle}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="relative mb-4 aspect-video overflow-hidden rounded-md">
                    <img
                      src={course.image}
                      alt={course.title}
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
                      ${course.price}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button className="w-full">Enroll Now</Button>
                    <Button variant="outline" className="w-full">
                      Add to Wishlist
                    </Button>
                  </div>
                  
                  <div className="mt-6 space-y-4 text-sm">
                    <p className="flex items-center">
                      <Video className="mr-2 h-4 w-4 text-gray-500" />
                      42 hours of video content
                    </p>
                    <p className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-gray-500" />
                      85 downloadable resources
                    </p>
                    <p className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4 text-gray-500" />
                      Full access to discussion forum
                    </p>
                    <p className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      Lifetime access
                    </p>
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
          <Tabs defaultValue="content">
            <TabsList className="mb-8 w-full justify-start">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Course Content</h2>
                <p className="text-gray-600">
                  {course.courseContent.length} sections • {
                    course.courseContent.reduce(
                      (total, section) => total + section.lessons.length,
                      0
                    )
                  } lessons
                </p>
              </div>
              
              <div className="space-y-4">
                {course.courseContent.map((section, sectionIndex) => (
                  <div 
                    key={sectionIndex} 
                    className="rounded-lg border border-gray-200"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between bg-gray-50 p-4"
                      onClick={() => setActiveContentSection(
                        activeContentSection === sectionIndex ? -1 : sectionIndex
                      )}
                    >
                      <h3 className="font-semibold">
                        {section.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {section.lessons.length} lessons
                        </span>
                      </div>
                    </div>
                    
                    {activeContentSection === sectionIndex && (
                      <div className="p-4">
                        <ul className="space-y-2">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <li
                              key={lessonIndex}
                              className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                {lesson.type === "video" ? (
                                  <Video className="mr-3 h-4 w-4 text-gray-500" />
                                ) : lesson.type === "quiz" ? (
                                  <FileText className="mr-3 h-4 w-4 text-gray-500" />
                                ) : (
                                  <Book className="mr-3 h-4 w-4 text-gray-500" />
                                )}
                                <span>{lesson.title}</span>
                              </div>
                              {lesson.duration && (
                                <span className="text-sm text-gray-500">
                                  {lesson.duration}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
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
                  <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 mt-1 rounded-full bg-primary-100 p-0.5 text-primary">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
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
            
            <TabsContent value="instructor">
              <div>
                <div className="mb-6 flex items-center">
                  <img
                    src={course.instructorImage}
                    alt={course.instructor}
                    className="mr-6 h-24 w-24 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{course.instructor}</h2>
                    <p className="text-gray-600">{course.instructorTitle}</p>
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
                      <div className="text-4xl font-bold">{course.rating}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.round(course.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Course Rating • {course.reviewCount} Reviews
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      {/* Rating bars would go here */}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">{review.user}</div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <div className="mb-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
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
