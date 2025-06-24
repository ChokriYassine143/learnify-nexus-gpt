
import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "LearnifyNexus completely transformed my learning experience. The courses are well-structured, and the instructors are incredibly knowledgeable. I've gained practical skills that I've applied directly in my career.",
    author: "Emily Rodriguez",
    role: "Software Developer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    content:
      "As someone who wanted to switch careers into data science, LearnifyNexus provided all the resources I needed. The combination of theoretical knowledge and practical exercises made learning enjoyable and effective.",
    author: "Michael Chen",
    role: "Data Analyst",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    content:
      "The quality of content on LearnifyNexus is exceptional. I especially appreciate the forum where I can connect with other students and instructors. It's a supportive community that enhances the learning experience.",
    author: "Sarah Johnson",
    role: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            What Our Students Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our community of learners about their experiences with LearnifyNexus
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-8 shadow-sm border border-gray-100"
            >
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              
              <blockquote className="mb-6 text-gray-700">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-4">
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
