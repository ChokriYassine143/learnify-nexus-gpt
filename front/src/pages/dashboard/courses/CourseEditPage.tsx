import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, ArrowLeft, Trash2, Plus, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/services/courseService";
import { Course, CourseModule, CourseLesson } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  level: string;
  price: string;
  duration: string;
  requirements: string[];
  objectives: string[];
  tags: string[];
  modules: Array<{
    title: string;
    lessons: Array<{
      title: string;
      content: string;
      order: number;
      duration: number;
      type: "video" | "reading" | "assignment" | "quiz";
      resources: string[];
      quizzes: string[];
    }>;
  }>;
  status: "draft" | "published" | "archived";
}

const CourseEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Form state
  const [courseData, setCourseData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: "0",
    duration: "0",
    requirements: [],
    objectives: [],
    tags: [],
    modules: [],
    status: "draft"
  });
  
  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      
      try {
        const courseData = await courseService.getCourse(id);
        setCourse(courseData);
        setCourseData({
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          price: courseData.price.toString(),
          duration: courseData.duration.toString(),
          requirements: courseData.requirements,
          objectives: courseData.objectives,
          tags: courseData.tags,
          modules: courseData.modules.map(module => ({
            title: module.title,
            lessons: module.lessons.map(lesson => ({
              title: lesson.title,
              content: lesson.content,
              order: lesson.order,
              duration: lesson.duration,
              type: lesson.type,
              resources: lesson.resources || [],
              quizzes: lesson.quizzes || []
            }))
          })),
          status: courseData.status
        });
      } catch (error) {
        console.error("Error loading course:", error);
        toast({
          title: "Error",
          description: "Failed to load course details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [id, toast]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof CourseFormData
  ) => {
    const value = e.target.value;
    
    if (field === "requirements" || field === "objectives") {
      setCourseData(prev => ({
        ...prev,
        [field]: value.split("\n").filter(Boolean)
      }));
    } else if (field === "tags") {
      setCourseData(prev => ({
        ...prev,
        [field]: value.split(",").map(tag => tag.trim()).filter(Boolean)
      }));
    } else {
      setCourseData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async () => {
    if (!course || !user) return;
    
    setIsSaving(true);
    try {
      const updatedCourse: Partial<Course> = {
        ...course,
        ...courseData,
        price: Number(courseData.price) || 0,
        duration: courseData.duration,
        modules: courseData.modules.map((module, moduleIdx) => ({
          title: module.title,
          lessons: module.lessons.map((lesson, lessonIdx) => ({
            title: lesson.title,
            content: lesson.content,
            order: lessonIdx,
            duration: typeof lesson.duration === 'number' ? lesson.duration : Number(lesson.duration) || 0,
            type: lesson.type,
            resources: lesson.resources || [],
            quizzes: lesson.quizzes || []
          }))
        })),
        updatedAt: new Date().toISOString()
      };
      
      await courseService.updateCourse(course.id, updatedCourse);
      
      toast({
        title: "Course updated",
        description: "Your course has been updated successfully.",
      });
      
      navigate("/dashboard/courses/manage");
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteCourse = async () => {
    if (!course) return;
    
    try {
      await courseService.deleteCourse(course.id);
      
      toast({
        title: "Course deleted",
        description: "Your course has been deleted successfully.",
      });
      
      setDeleteDialogOpen(false);
      navigate("/dashboard/courses/manage");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const addModule = () => {
    const newModule = {
      title: "New module",
      lessons: []
    };
    
    setCourseData(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
  };
  
  const updateModule = (moduleIndex: number, field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map((m, idx) => 
        idx === moduleIndex ? { ...m, [field]: value } : m
      )
    }));
  };
  
  const deleteModule = (moduleIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, idx) => idx !== moduleIndex)
    }));
  };
  
  const addLesson = (moduleIndex: number) => {
    const newLesson = {
      title: "New lesson",
      content: "",
      type: "video" as const,
      duration: 0,
      order: courseData.modules[moduleIndex].lessons.length,
      resources: [],
      quizzes: []
    };
    
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map((m, idx) => 
        idx === moduleIndex 
          ? { ...m, lessons: [...m.lessons, newLesson] } 
          : m
      )
    }));
  };
  
  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map((m, mIdx) => 
        mIdx === moduleIndex 
          ? {
              ...m,
              lessons: m.lessons.map((l, lIdx) => 
                lIdx === lessonIndex ? { ...l, [field]: value } : l
              )
            }
          : m
      )
    }));
  };
  
  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map((m, idx) => 
        idx === moduleIndex 
          ? { ...m, lessons: m.lessons.filter((_, lIdx) => lIdx !== lessonIndex) } 
          : m
      )
    }));
  };
  
  if (isLoading) {
    return (
      <>
        <Header />
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-center">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </DashboardLayout>
        <Footer />
      </>
    );
  }
  
  if (!course) {
    return (
      <>
        <Header />
        <DashboardLayout>
          <Alert className="bg-red-50 border-red-200">
            <AlertTitle>Course not found</AlertTitle>
            <AlertDescription>
              The requested course does not exist or you don't have permission to access it.
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/dashboard/courses/manage")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to courses
          </Button>
        </DashboardLayout>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/courses/manage")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Course
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update the basic information about your course.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={courseData.title}
                      onChange={(e) => handleInputChange(e, "title")}
                      placeholder="Enter course title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={courseData.description}
                      onChange={(e) => handleInputChange(e, "description")}
                      placeholder="Enter course description"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={courseData.category}
                        onChange={(e) => handleInputChange(e, "category")}
                        placeholder="Enter category"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select
                        value={courseData.level}
                        onValueChange={(value) => handleSelectChange(value, "level")}
                      >
                        <SelectTrigger id="level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={courseData.price}
                        onChange={(e) => handleInputChange(e, "price")}
                        placeholder="Enter price"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={courseData.duration}
                        onChange={(e) => handleInputChange(e, "duration")}
                        placeholder="Enter duration"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    Organize your course content into modules and lessons.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {courseData.modules.map((module, moduleIndex) => (
                    <div key={`module-${moduleIndex}`} className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <Input
                          value={module.title}
                          onChange={(e) => updateModule(moduleIndex, "title", e.target.value)}
                          className="font-medium text-lg"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteModule(moduleIndex)}
                          disabled={courseData.modules.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="pl-4 space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={`lesson-${moduleIndex}-${lessonIndex}`} className="border rounded p-3 bg-gray-50">
                            <div className="flex flex-wrap gap-3">
                              <div className="flex-1 min-w-[200px]">
                                <Label htmlFor={`lesson-title-${moduleIndex}-${lessonIndex}`} className="text-xs">Title</Label>
                                <Input
                                  id={`lesson-title-${moduleIndex}-${lessonIndex}`}
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, "title", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div className="w-32">
                                <Label htmlFor={`lesson-type-${moduleIndex}-${lessonIndex}`} className="text-xs">Type</Label>
                                <Select
                                  value={lesson.type}
                                  onValueChange={(value) => updateLesson(moduleIndex, lessonIndex, "type", value)}
                                >
                                  <SelectTrigger id={`lesson-type-${moduleIndex}-${lessonIndex}`} className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="reading">Reading</SelectItem>
                                    <SelectItem value="assignment">Assignment</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor={`lesson-duration-${moduleIndex}-${lessonIndex}`}>Duration (minutes)</Label>
                                <Input
                                  id={`lesson-duration-${moduleIndex}-${lessonIndex}`}
                                  type="number"
                                  value={lesson.duration}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, "duration", e.target.value)}
                                  placeholder="Enter duration"
                                />
                              </div>

                              <div>
                                <Label htmlFor={`lesson-content-${moduleIndex}-${lessonIndex}`}>Content</Label>
                                <Textarea
                                  id={`lesson-content-${moduleIndex}-${lessonIndex}`}
                                  value={lesson.content}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, "content", e.target.value)}
                                  placeholder="Enter lesson content"
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => addLesson(moduleIndex)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Lesson
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Course Settings</CardTitle>
                  <CardDescription>
                    Configure additional settings for your course.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={courseData.status}
                      onValueChange={(value) => handleSelectChange(value, "status")}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={courseData.requirements.join("\n")}
                      onChange={(e) => handleInputChange(e, "requirements")}
                      placeholder="Enter course requirements"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objectives">Objectives</Label>
                    <Textarea
                      id="objectives"
                      value={courseData.objectives.join("\n")}
                      onChange={(e) => handleInputChange(e, "objectives")}
                      placeholder="Enter course objectives"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Textarea
                      id="tags"
                      value={courseData.tags.join(", ")}
                      onChange={(e) => handleInputChange(e, "tags")}
                      placeholder="Enter course tags"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default CourseEditPage;