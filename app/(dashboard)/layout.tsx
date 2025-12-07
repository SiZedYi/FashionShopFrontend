"use client";

import DashboardHeader from "@/components/dashboard/header/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/sidebar/DashboardSidebar";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { Toaster } from "sonner";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { decodeAdminToken } from "@/lib/auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrate, setAdminUser } = useAdminAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Hydrate admin user from localStorage
    hydrate();

    // Skip auth check for login page
    if (pathname === "/login") {
      setIsChecking(false);
      return;
    }

    // Check if admin is authenticated
    const adminToken = Cookies.get("admin_token");
    
    if (!adminToken) {
      router.push("/login");
    } else {
      // Decode token to get user info and permissions
      const decoded = decodeAdminToken();
      if (decoded) {
        setAdminUser({
          id: parseInt(decoded.sub),
          fullName: decoded.fullName,
          email: decoded.email,
          roles: decoded.roles || [],
          permissions: decoded.permissions || [],
        });
      }
      setIsChecking(false);
    }
  }, [pathname, router, hydrate, setAdminUser]);

  // If on login page, render without header/sidebar
  if (pathname === "/login") {
    return (
      <>
        <Toaster position="top-center" richColors />
        {children}
      </>
    );
  }

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <DashboardHeader />
      <div className="mx-auto  flex flex-col md:flex-row">
        <DashboardSidebar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
