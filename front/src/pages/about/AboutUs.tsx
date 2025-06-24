
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Users, BookOpen, GraduationCap } from "lucide-react";

const AboutUs: React.FC = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-learnup-blue1 via-learnup-blue2 to-learnup-blue3 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">About LearnUp</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Empowering learners worldwide with accessible, high-quality education
                that transforms lives and builds brighter futures.
              </p>
            </div>
          </div>
          
          {/* Wave SVG */}
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
        
        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                <div className="w-24 h-1 bg-learnup-blue1 mx-auto"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <img 
                    src="/lovable-uploads/b14b8995-4cec-4fca-af8c-857f1e9e3699.png" 
                    alt="LearnUp Story" 
                    className="w-full h-auto rounded-lg shadow-xl"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-learnup-blue5 mb-4">From Vision to Reality</h3>
                  <p className="text-gray-600 mb-6">
                    LearnUp was founded in 2020 with a simple yet powerful mission: to make quality education accessible to everyone. 
                    Our founders, a team of passionate educators and technologists, recognized the barriers that prevent many from accessing quality learning experiences.
                  </p>
                  <p className="text-gray-600">
                    What began as a small collection of online courses has grown into a comprehensive learning platform serving thousands of students worldwide. 
                    Today, LearnUp offers courses across dozens of disciplines, from programming to arts, business to science, all taught by industry experts and educators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <div className="w-24 h-1 bg-learnup-blue1 mx-auto"></div>
                <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
                  We believe education is a fundamental right that should be available to everyone, 
                  regardless of geographic location or economic circumstance.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-learnup-blue3 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <BookOpen className="h-8 w-8 text-learnup-blue1" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-4">Accessible Learning</h3>
                  <p className="text-gray-600 text-center">
                    Creating educational content that's accessible to learners of all backgrounds and abilities.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-learnup-blue3 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Users className="h-8 w-8 text-learnup-blue1" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-4">Community Building</h3>
                  <p className="text-gray-600 text-center">
                    Fostering a supportive community where learners can connect, collaborate, and grow together.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-learnup-blue3 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <GraduationCap className="h-8 w-8 text-learnup-blue1" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-4">Quality Education</h3>
                  <p className="text-gray-600 text-center">
                    Delivering high-quality educational content that prepares learners for real-world success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Leadership Team</h2>
                <div className="w-24 h-1 bg-learnup-blue1 mx-auto"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: "Sarah Johnson", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300" },
                  { name: "Michael Chen", role: "Chief Technology Officer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300" },
                  { name: "Elena Rodriguez", role: "Chief Learning Officer", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300" },
                ].map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full border-4 border-learnup-blue3">
                      <img 
                        src={member.img} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-learnup-blue1">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-br from-learnup-blue1 via-learnup-blue2 to-learnup-blue3 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Join Our Learning Community</h2>
              <p className="text-white/90 text-lg mb-8">
                Be part of our growing community of learners and educators. 
                Start your learning journey today.
              </p>
              <Button size="lg" className="bg-white text-learnup-blue1 hover:bg-gray-100 hover:scale-105 transform transition-all duration-300" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
