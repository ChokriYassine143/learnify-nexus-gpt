
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
    <section className="bg-accent py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Start Your Learning Journey Today
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Join thousands of students already learning on LearnifyNexus.
            Get unlimited access to our diverse catalog of expert-led courses.
          </p>
          <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Button size="lg" variant="default" className="bg-white text-accent hover:bg-gray-100" asChild>
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
