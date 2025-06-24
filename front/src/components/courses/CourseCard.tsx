import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Clock, Star, User, Lock } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  level: "beginner" | "intermediate" | "advanced";
  rating: number;
  duration: number;
  enrolledStudents?: number | null;
  image: string;
  category: string;
  price: number;
  isEnrolled?: boolean;
  onPurchase?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  instructor,
  level,
  rating,
  duration,
  enrolledStudents = 0,
  image,
  category,
  price,
  isEnrolled,
  onPurchase
}) => {
  // Format number with fallback for null/undefined
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return "0";
    return num.toLocaleString();
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      {/* Course Image with Link */}
      <Link to={`/course/${id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-4 left-4">
            {category}
          </Badge>
        </div>
      </Link>
      
      {/* Course Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {level}
          </Badge>
          <div className="flex items-center text-sm text-yellow-500">
            <Star className="mr-1 h-4 w-4 fill-current" />
            {rating?.toFixed(1) || "0.0"}
          </div>
        </div>
        
        <Link to={`/course/${id}`} className="group-hover:text-primary">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
            {title}
          </h3>
        </Link>
        
        <p className="mb-4 text-sm text-gray-600">
          by {instructor}
        </p>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {duration} hours
            </div>
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              {formatNumber(enrolledStudents)} students
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">
              ${typeof price === 'number' ? price.toFixed(2) : Number(price || 0).toFixed(2)}
            </div>
            
            {isEnrolled ? (
              <Link to={`/course/${id}/learn`}>
                <Button>
                  Continue Learning
                </Button>
              </Link>
            ) : (
              <Button onClick={onPurchase}>
                Enroll Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
