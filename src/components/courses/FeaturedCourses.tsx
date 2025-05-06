
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CourseCard from "./CourseCard";

const FEATURED_COURSES = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    instructor: "Prof. John Smith",
    level: "Beginner" as const,
    rating: 4.7,
    duration: "10 weeks",
    students: 12543,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Web Development",
  },
  {
    id: "2",
    title: "Data Science and Machine Learning",
    instructor: "Dr. Sarah Johnson",
    level: "Intermediate" as const,
    rating: 4.9,
    duration: "12 weeks",
    students: 8976,
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Data Science",
  },
  {
    id: "3",
    title: "Mobile App Development with React Native",
    instructor: "Michael Chen",
    level: "Intermediate" as const,
    rating: 4.6,
    duration: "8 weeks",
    students: 7432,
    image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Mobile Apps",
  },
  {
    id: "4",
    title: "Graphic Design Masterclass",
    instructor: "Emma Rodriguez",
    level: "Beginner" as const,
    rating: 4.8,
    duration: "6 weeks",
    students: 6257,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Graphic Design",
  },
  {
    id: "5",
    title: "Advanced JavaScript Patterns",
    instructor: "David Wilson",
    level: "Advanced" as const,
    rating: 4.9,
    duration: "8 weeks",
    students: 4328,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Web Development",
  },
  {
    id: "6",
    title: "UX/UI Design Principles",
    instructor: "Lisa Parker",
    level: "Beginner" as const,
    rating: 4.7,
    duration: "5 weeks",
    students: 5942,
    image: "https://images.unsplash.com/photo-1617042375876-a13e36732a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Graphic Design",
  },
];

const FeaturedCourses: React.FC = () => {
  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Featured Courses</h2>
          <p className="mt-2 text-gray-600">
            Explore our most popular and highly-rated courses
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/courses">View All Courses</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_COURSES.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCourses;
