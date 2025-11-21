"use client";

import Logo from "@/components/logo/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import React from "react";
import Notification from "../notificaton/Notification";
import DashboardMobileHeader from "./DashboardMobileHeader";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { User } from "lucide-react";

const DashboardHeader = () => {
  const router = useRouter();
  const { adminUser, clearAdminUser } = useAdminAuthStore();

  const handleLogout = () => {
    // Clear admin token and user data
    clearAdminUser();
    
    toast.success("Đã đăng xuất thành công!");
    
    // Redirect to login page
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow sticky top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {adminUser && (
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{adminUser.fullName}</span>
            </div>
          )}
          <Notification />
          <Button
            size={"md"}
            variant={"destructive"}
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut />
          </Button>
          <DashboardMobileHeader />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
