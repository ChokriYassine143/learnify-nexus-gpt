import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CourseEnrollmentModal from "./CourseEnrollmentModal";

interface EnrollButtonProps {
  courseId: string;
  courseTitle: string;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  price?: number | null;
}

const EnrollButton: React.FC<EnrollButtonProps> = ({ 
  courseId, 
  courseTitle,
  isLoggedIn, 
  isEnrolled,
  price = null 
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { enrollInCourse } = useAuth();
  
  const handleEnroll = async () => {
    if (!isLoggedIn) {
      // Redirect to login page with return URL
      navigate(`/login?redirect=/course/${courseId}`);
      return;
    }
    
    // For paid courses, show payment modal
    if (price && price > 0) {
      setShowEnrollmentModal(true);
    } else {
      // For free courses, directly enroll
      setIsEnrolling(true);
      
      try {
        await enrollInCourse(courseId);
        toast({
          title: "Inscription réussie !",
          description: `Vous êtes maintenant inscrit au cours : ${courseTitle}`,
        });
        // After successful enrollment, navigate to course
        navigate(`/course/${courseId}/learn`);
      } catch (error) {
        toast({
          title: "Erreur d'inscription",
          description: "Une erreur s'est produite lors de l'inscription au cours.",
          variant: "destructive"
        });
      } finally {
        setIsEnrolling(false);
      }
    }
  };

  const handleEnrollSuccess = () => {
    // After successful enrollment from modal
    navigate(`/course/${courseId}/learn`);
  };
  
  if (isEnrolled) {
    return (
      <Button onClick={() => navigate(`/course/${courseId}/learn`)}>
        Continuer l'apprentissage
      </Button>
    );
  }
  
  return (
    <>
      <Button 
        onClick={handleEnroll} 
        disabled={isEnrolling}
      >
        {isEnrolling ? "Traitement..." : price && price > 0 ? `S'inscrire - ${price.toLocaleString('fr-FR')} €` : "S'inscrire gratuitement"}
      </Button>
      
      {showEnrollmentModal && (
        <CourseEnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          courseId={courseId}
          courseTitle={courseTitle}
          coursePrice={price || 0}
          onEnrollSuccess={handleEnrollSuccess}
        />
      )}
    </>
  );
};

export default EnrollButton;
