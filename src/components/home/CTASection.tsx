
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-learnup-blue1 via-learnup-blue2 to-learnup-blue3 py-20 relative overflow-hidden">
      {/* Decorative circles background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white"></div>
        <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-white"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-white"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl text-white drop-shadow-lg">
            Start Your Learning Journey Today
          </h2>
          <p className="mt-6 text-lg text-white/90 max-w-xl mx-auto">
            Join thousands of students already learning on LearnUp.
            Get unlimited access to our diverse catalog of expert-led courses.
          </p>
          
          <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-learnup-blue1 hover:bg-gray-100 hover:scale-105 shadow-lg transform transition-transform duration-300 ease-in-out font-semibold px-8 hover:shadow-xl" 
              asChild
            >
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button 
              size="lg" 
         
              className="bg-white text-learnup-blue1 hover:bg-gray-100 hover:scale-105 shadow-lg transform transition-transform duration-300 ease-in-out font-semibold px-8 hover:shadow-xl" 
              asChild
            >
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 text-white shadow-lg transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="bg-white/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">100+</span>
                </div>
                <div className="text-lg font-medium mb-2">Expert-led courses</div>
                <div className="text-sm text-white/80 text-center">Crafted by industry professionals</div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 text-white shadow-lg transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="bg-white/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">10k+</span>
                </div>
                <div className="text-lg font-medium mb-2">Active students</div>
                <div className="text-sm text-white/80 text-center">Learning and growing together</div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 text-white shadow-lg transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="bg-white/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">24/7</span>
                </div>
                <div className="text-lg font-medium mb-2">Support for learners</div>
                <div className="text-sm text-white/80 text-center">Always here to help you succeed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
