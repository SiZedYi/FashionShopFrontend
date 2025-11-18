import DashboardHeader from "@/components/dashboard/header/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/sidebar/DashboardSidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardHeader />
      <div className="mx-auto  flex flex-col md:flex-row">
        <DashboardSidebar />
        {children}
      </div>
    </div>
  );
};

export default layout;
