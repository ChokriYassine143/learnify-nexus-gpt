import React from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCourses from "@/components/courses/FeaturedCourses";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const Index: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  return (
    <>
      <Header />
      <main>
       
        <HeroSection />
        <FeaturedCourses />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
