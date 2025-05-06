
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
