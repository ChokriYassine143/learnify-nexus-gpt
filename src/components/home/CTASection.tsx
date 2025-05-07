
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-learnup-blue1 via-learnup-blue2 to-learnup-blue3 py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl text-white drop-shadow-lg">
            Start Your Learning Journey Today
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-xl mx-auto">
            Join thousands of students already learning on LearnUp.
            Get unlimited access to our diverse catalog of expert-led courses.
          </p>
          <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 justify-center">
            <Button size="lg" variant="default" className="bg-white text-learnup-blue1 hover:bg-gray-100 shadow-lg transform hover:-translate-y-1 transition-all font-semibold px-8" asChild>
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 shadow-lg transform hover:-translate-y-1 transition-all font-semibold px-8" asChild>
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-sm">Expert-led courses</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="text-3xl font-bold mb-2">10k+</div>
              <div className="text-sm">Active students</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white shadow-lg transform hover:-translate-y-1 transition-all">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm">Support for learners</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
