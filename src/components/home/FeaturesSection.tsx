
import React from "react";
import { Book, Calendar, MessageSquare, User, Video } from "lucide-react";

const features = [
  {
    title: "Expert Instructors",
    description:
      "Learn from industry professionals and academics with years of experience in their fields.",
    icon: User,
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with video lectures, quizzes, projects, and hands-on exercises for effective learning.",
    icon: Video,
  },
  {
    title: "Comprehensive Resources",
    description:
      "Access a wide range of learning materials including textbooks, articles, and case studies.",
    icon: Book,
  },
  {
    title: "Flexible Schedule",
    description:
      "Learn at your own pace with 24/7 access to course content from anywhere.",
    icon: Calendar,
  },
  {
    title: "Community Support",
    description:
      "Join our active community forum to connect with peers and get help when needed.",
    icon: MessageSquare,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Why Choose LearnifyNexus
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Our e-learning platform offers a comprehensive learning experience with features
          designed to help you succeed in your educational journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-primary-300"
          >
            <div className="mb-4 rounded-full bg-primary-100 p-3 text-primary">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
