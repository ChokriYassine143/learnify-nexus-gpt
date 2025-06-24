
import React from "react";

const stats = [
  {
    value: "200+",
    label: "Courses Available",
  },
  {
    value: "50+",
    label: "Expert Instructors",
  },
  {
    value: "100k+",
    label: "Students Worldwide",
  },
  {
    value: "95%",
    label: "Success Rate",
  },
];

const StatsSection: React.FC = () => {
  return (
    <section className="bg-primary py-16">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="mx-auto max-w-xs">
              <div className="text-4xl font-bold text-white">{stat.value}</div>
              <div className="mt-2 text-sm font-medium text-white opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
