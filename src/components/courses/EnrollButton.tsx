
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface EnrollButtonProps {
  courseId: string;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  price?: number | null;
}

const EnrollButton: React.FC<EnrollButtonProps> = ({ 
  courseId, 
  isLoggedIn, 
  isEnrolled,
  price = null 
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleEnroll = () => {
    if (!isLoggedIn) {
      // Redirect to login page with return URL
      navigate(`/login?redirect=/course/${courseId}`);
      return;
    }
    
    // Start enrollment process
    setIsEnrolling(true);
    
    // If the course is free or we're just simulating enrollment
    if (price === null || price === 0) {
      setTimeout(() => {
        setIsEnrolling(false);
        toast({
          title: "Enrolled Successfully!",
          description: "You are now enrolled in this course.",
        });
        // After successful enrollment, update the button state
        // In a real app, this would come from an API call
        window.location.reload();
      }, 1000);
    } else {
      // For paid courses, redirect to checkout
      navigate(`/checkout/course/${courseId}`);
    }
  };
  
  if (isEnrolled) {
    return (
      <Button onClick={() => navigate(`/course/${courseId}/learn`)}>
        Continue Learning
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={handleEnroll} 
      disabled={isEnrolling}
    >
      {isEnrolling ? "Processing..." : price ? `Enroll - $${price}` : "Enroll for Free"}
    </Button>
  );
};

export default EnrollButton;
