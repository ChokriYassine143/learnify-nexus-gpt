import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Check, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useAssignments } from "@/hooks/useAssignments";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment } from "@/types";

const AssignmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();
  const { user } = useAuth();
  const { getAllAssignments, submitAssignment, isLoading } = useAssignments();
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const allAssignments = getAllAssignments();
      // Filter assignments for the current user
      const userAssignments = allAssignments.filter(assignment => {
        const submission = assignment.submissions.find(s => s.studentId === user?.id);
        if (!submission) return true; // Not submitted yet
        return false; // Already submitted
      });
      setAssignments(userAssignments);
    };

    fetchAssignments();
  }, [getAllAssignments, user?.id]);

  const handleSubmitAssignment = async (assignmentId: string) => {
    try {
      await submitAssignment(assignmentId, "Assignment submitted");
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      
      toast({
        title: "Assignment submitted",
        description: "Your assignment has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast({
        title: "Error",
        description: "Failed to submit assignment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === "all") return true;
    return assignment.status === activeTab;
  });

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Assignments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and submit your assigned work</p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
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
              filteredAssignments.map((assignment) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {assignment.courseId} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        {assignment.status === "completed" ? (
                          <span className="flex items-center text-green-600 text-sm font-medium">
                            <Check className="mr-1 h-4 w-4" /> Completed
                          </span>
                        ) : (
                          <span className="flex items-center text-orange-500 text-sm font-medium">
                            <Clock className="mr-1 h-4 w-4" /> 
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Instructions:</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {assignment.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      {assignment.status !== "completed" && (
                        <Button 
                          onClick={() => handleSubmitAssignment(assignment.id)}
                          disabled={isLoading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Submit Assignment
                        </Button>
                      )}
                      
                      {assignment.status === "completed" && (
                        <Button variant="outline" disabled>
                          Already Submitted
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No assignments found. Check back later for new assignments.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default AssignmentsPage;
