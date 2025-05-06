
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Book, Clock, Star, User } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  duration: string;
  students: number;
  image: string;
  category: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  instructor,
  level,
  rating,
  duration,
  students,
  image,
  category,
}) => {
  const getLevelColor = () => {
    switch (level) {
      case "Beginner":
        return "bg-blue-100 text-blue-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Link to={`/course/${id}`} className="course-card block">
      <div className="h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-medium">
            {category}
          </Badge>
          <Badge className={`text-xs font-medium ${getLevelColor()}`}>
            {level}
          </Badge>
        </div>
        
        <h3 className="mt-2 text-lg font-semibold line-clamp-2">{title}</h3>
        
        <p className="mt-1 text-sm text-gray-500">
          by {instructor}
        </p>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{duration}</span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <User className="mr-1 h-4 w-4" />
            <span>{students.toLocaleString()} students</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
