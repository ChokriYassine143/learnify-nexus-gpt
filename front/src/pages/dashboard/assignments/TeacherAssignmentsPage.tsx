import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Check, X, Clock, Search, Filter, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAssignments } from "@/hooks/useAssignments";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment, AssignmentSubmission } from "@/types";
import { courseService } from "@/services/courseService";
import { userService } from "@/services/userService";

const TeacherAssignmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const { getAllAssignments, gradeSubmission, isLoading } = useAssignments();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allAssignments, allCourses, allStudents] = await Promise.all([
          getAllAssignments(),
          courseService.getAllCourses(),
          userService.getAllUsers()
        ]);

        // Filter assignments for the current teacher's courses
        const teacherCourses = allCourses.filter(course => course.instructor === user?.id);
        const teacherAssignments = allAssignments.filter(assignment => 
          teacherCourses.some(course => course.id === assignment.courseId)
        );

        setAssignments(teacherAssignments);
        setCourses(allCourses);
        setStudents(allStudents);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch assignments data",
          variant: "destructive"
        });
      }
    };

    if (user) {
      fetchData();
    }
  }, [getAllAssignments, user, toast]);

  const handleGradeSubmission = (assignmentId: string, submissionId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    const submission = assignment?.submissions.find(s => s.id === submissionId);
    if (submission) {
      setSelectedSubmission(submission);
      setGrade(submission.grade || "");
      setFeedback(submission.feedback || "");
      setGradeDialogOpen(true);
    }
  };

  const submitGrade = async () => {
    if (!selectedSubmission) return;

    try {
      await gradeSubmission(
        selectedSubmission.assignmentId,
        selectedSubmission.id,
        grade,
        feedback
      );

      // Update local state
      setAssignments(prev => 
        prev.map(assignment => {
          if (assignment.id === selectedSubmission.assignmentId) {
            return {
              ...assignment,
              submissions: assignment.submissions.map(submission =>
                submission.id === selectedSubmission.id
                  ? { ...submission, grade, feedback }
                  : submission
              )
            };
          }
          return assignment;
        })
      );

      toast({
        title: "Grade submitted",
        description: "The grade has been submitted successfully.",
      });

      setGradeDialogOpen(false);
    } catch (error) {
      console.error("Error submitting grade:", error);
      toast({
        title: "Error",
        description: "Failed to submit grade. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    // Filter by tab
    if (activeTab !== "all") {
      const hasSubmissionWithStatus = assignment.submissions.some(
        submission => submission.status === activeTab
      );
      if (!hasSubmissionWithStatus) return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const course = courses.find(c => c.id === assignment.courseId);
      return (
        assignment.title.toLowerCase().includes(query) ||
        course?.title.toLowerCase().includes(query) ||
        assignment.submissions.some(submission => {
          const student = students.find(s => s.id === submission.studentId);
          return (
            student?.name.toLowerCase().includes(query) ||
            student?.email.toLowerCase().includes(query)
          );
        })
      );
    }
    
    return true;
  });

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Assignment Submissions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Review and grade student submissions</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search assignments or students..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-center">
                  <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                </div>
              </div>
            ) : filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => {
                const course = courses.find(c => c.id === assignment.courseId);
                return (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardHeader className={`bg-gray-50 dark:bg-gray-800 ${
                      assignment.submissions.some(s => s.status === "graded") ? "border-l-4 border-green-500" :
                      assignment.submissions.some(s => s.status === "submitted") ? "border-l-4 border-blue-500" : 
                      "border-l-4 border-yellow-500"
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{assignment.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {course?.title} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">
                            {assignment.submissions.length} submissions
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assignment.submissions.map((submission) => {
                          const student = students.find(s => s.id === submission.studentId);
                          return (
                            <div key={submission.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-medium">{student?.name}</h3>
                                  <p className="text-sm text-gray-500">{student?.email}</p>
                                </div>
                                <div className="flex items-center">
                                  {submission.status === "graded" ? (
                                    <span className="flex items-center text-green-600 text-sm font-medium">
                                      <Check className="mr-1 h-4 w-4" /> Graded: {submission.grade}
                                    </span>
                                  ) : submission.status === "submitted" ? (
                                    <span className="flex items-center text-blue-600 text-sm font-medium">
                                      <Check className="mr-1 h-4 w-4" /> Submitted
                                    </span>
                                  ) : (
                                    <span className="flex items-center text-yellow-600 text-sm font-medium">
                                      <Clock className="mr-1 h-4 w-4" /> Pending
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <h4 className="text-sm font-medium mb-2">Submission:</h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {submission.content}
                                </p>
                              </div>
                              
                              {submission.status === "submitted" && (
                                <div className="flex justify-end">
                                  <Button
                                    onClick={() => handleGradeSubmission(assignment.id, submission.id)}
                                    disabled={isLoading}
                                  >
                                    Grade Submission
                                  </Button>
                                </div>
                              )}
                              
                              {submission.status === "graded" && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Feedback:</h4>
                                  <p className="text-gray-700 dark:text-gray-300">
                                    {submission.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No assignments found
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grade Submission</DialogTitle>
              <DialogDescription>
                Provide a grade and feedback for the student's submission
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Grade</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Feedback</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGradeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitGrade} disabled={isLoading}>
                Submit Grade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default TeacherAssignmentsPage;
