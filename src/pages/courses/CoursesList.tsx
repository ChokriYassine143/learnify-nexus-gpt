
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const COURSES = [
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
  {
    id: "7",
    title: "Python for Data Analysis",
    instructor: "Robert Johnson",
    level: "Intermediate" as const,
    rating: 4.8,
    duration: "8 weeks",
    students: 7821,
    image: "https://images.unsplash.com/photo-1610018556010-6a11691bc905?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Data Science",
  },
  {
    id: "8",
    title: "iOS App Development with Swift",
    instructor: "Jennifer Lee",
    level: "Intermediate" as const,
    rating: 4.6,
    duration: "10 weeks",
    students: 3452,
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Mobile Apps",
  },
  {
    id: "9",
    title: "Frontend Development with React",
    instructor: "Thomas Brown",
    level: "Intermediate" as const,
    rating: 4.9,
    duration: "8 weeks",
    students: 9632,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Web Development",
  },
];

const CoursesList: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  return (
    <>
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold">Browse All Courses</h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover our comprehensive catalog of courses to advance your skills and knowledge
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 lg:block ${filterOpen ? 'block' : 'hidden'}`}>
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Filters</h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Categories</h4>
                  <div className="space-y-2">
                    {["Web Development", "Data Science", "Mobile Apps", "Graphic Design"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category.replace(/\s+/g, "-").toLowerCase()} />
                        <Label htmlFor={category.replace(/\s+/g, "-").toLowerCase()} className="font-normal">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Level</h4>
                  <div className="space-y-2">
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox id={level.toLowerCase()} />
                        <Label htmlFor={level.toLowerCase()} className="font-normal">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Duration</h4>
                  <div className="space-y-2">
                    {["Under 4 weeks", "4-8 weeks", "8-12 weeks", "Over 12 weeks"].map((duration) => (
                      <div key={duration} className="flex items-center space-x-2">
                        <Checkbox id={duration.replace(/\s+/g, "-").toLowerCase()} />
                        <Label htmlFor={duration.replace(/\s+/g, "-").toLowerCase()} className="font-normal">
                          {duration}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Rating</h4>
                  <div className="space-y-2">
                    {["4.5 & up", "4.0 & up", "3.5 & up", "3.0 & up"].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={rating.replace(/\s+/g, "-").toLowerCase()} />
                        <Label htmlFor={rating.replace(/\s+/g, "-").toLowerCase()} className="font-normal">
                          {rating}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </aside>
          
          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 lg:hidden"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {filterOpen ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              <div className="flex flex-1 items-center gap-2 sm:max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Sort by:</span>
                <Select defaultValue="popularity">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Popularity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating-high">Rating (High-Low)</SelectItem>
                    <SelectItem value="rating-low">Rating (Low-High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {COURSES.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <Button variant="outline">Load More Courses</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CoursesList;
