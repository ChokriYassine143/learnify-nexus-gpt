
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section relative">
      <div className="container relative z-10 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Learn Without Limits
          </h1>
          <p className="mt-6 text-lg leading-8">
            Start, switch, or advance your career with thousands of courses from expert instructors.
            Expand your knowledge and build valuable skills for the future.
          </p>
          
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="text-base">
              <Link to="/courses">Explore Courses</Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="secondary"
              className="text-base"
            >
              <Link to="/register">Join For Free</Link>
            </Button>
          </div>
          
          <div className="mt-12">
            <div className="relative mx-auto max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="search"
                className="block w-full rounded-md border border-white/20 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="What do you want to learn today?"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave pattern at bottom of hero */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          fill="white"
          preserveAspectRatio="none"
          className="h-12 w-full"
        >
          <path d="M0,0L40,6.7C80,13,160,27,240,33.3C320,40,400,40,480,33.3C560,27,640,13,720,13.3C800,13,880,27,960,40C1040,53,1120,67,1200,66.7C1280,67,1360,53,1400,46.7L1440,40V100H1400C1360,100,1280,100,1200,100C1120,100,1040,100,960,100C880,100,800,100,720,100C640,100,560,100,480,100C400,100,320,100,240,100C160,100,80,100,40,100H0V0Z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
