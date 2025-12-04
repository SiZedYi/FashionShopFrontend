'use client'
import Link from "next/link";
import React from "react";
import {
  Home,
  ClipboardList,
  Box,
  Layers,
  Users,
  Images,
  ShieldAlert,
  Hand,
  Fingerprint,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import {
  MANAGE_ORDERS,
  READ_ORDERS,
  MANAGE_PRODUCTS,
  READ_PRODUCTS,
  MANAGE_CATEGORIES,
  READ_CATEGORIES,
  MANAGE_SLIDERS,
  READ_SLIDERS,
  MANAGE_CUSTOMERS,
  READ_CUSTOMERS,
  MANAGE_ROLES,
  READ_ROLES,
  MANAGE_PERMISSIONS,
  READ_PERMISSIONS,
  MANAGE_USERS,
  READ_USERS,
} from "@/const/permissions";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { hasAnyPermission } = useAdminAuthStore();

  const dashboardLinks = [
    {
      link: "/dashboard",
      label: "Home",
      icon: <Home size={20} />,
      isActive: pathname === "/dashboard",
      permissions: [], // Always visible
    },
    {
      link: "/dashboard/orders",
      label: "Orders",
      icon: <ClipboardList size={20} />,
      isActive: pathname.includes("dashboard/orders"),
      permissions: [MANAGE_ORDERS, READ_ORDERS],
    },
    {
      link: "/dashboard/products",
      label: "Products",
      icon: <Box size={20} />,
      isActive: pathname.includes("dashboard/products"),
      permissions: [MANAGE_PRODUCTS, READ_PRODUCTS],
    },
    {
      link: "/dashboard/categories",
      label: "Categories",
      icon: <Layers size={20} />,
      isActive: pathname.includes("dashboard/categories"),
      permissions: [MANAGE_CATEGORIES, READ_CATEGORIES],
    },
    {
      link: "/dashboard/sliders",
      label: "Sliders",
      icon: <Images size={20} />,
      isActive: pathname.includes("dashboard/sliders"),
      permissions: [MANAGE_SLIDERS, READ_SLIDERS],
    },
    {
      link: "/dashboard/customers",
      label: "Customers",
      icon: <Users size={20} />,
      isActive: pathname.includes("dashboard/customers"),
      permissions: [MANAGE_CUSTOMERS, READ_CUSTOMERS],
    },
    {
      link: "/dashboard/roles",
      label: "Roles",
      icon: <ShieldAlert size={20} />,
      isActive: pathname.includes("dashboard/roles"),
      permissions: [MANAGE_ROLES, READ_ROLES],
    },
    {
      link: "/dashboard/permissions",
      label: "Permissions",
      icon: <Hand size={20} />,
      isActive: pathname.includes("dashboard/permissions"),
      permissions: [MANAGE_PERMISSIONS, READ_PERMISSIONS],
    },
    {
      link: "/dashboard/users",
      label: "Users",
      icon: <Fingerprint size={20} />,
      isActive: pathname.includes("dashboard/users"),
      permissions: [MANAGE_USERS, READ_USERS],
    },
  ];

  // Filter links based on permissions
  const visibleLinks = dashboardLinks.filter(link => {
    // Always show Home
    if (link.permissions.length === 0) return true;
    // Check if user has any of the required permissions
    return hasAnyPermission(link.permissions);
  });

  return (
    <nav className="w-64 min-h-[88vh] px-2 py-4 border-r-2 hidden lg:block">
      {/* Sidebar Links */}
      <div>
        <ul className="flex flex-col gap-2 items-start justify-center">
          {visibleLinks.map((link) => (
            <li key={link.label} className="w-full">
              <Link
                href={link.link}
                className={cn("flex items-center text-lg w-full gap-2  p-2 rounded-md transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-800", link.isActive && 'bg-slate-300  dark:bg-slate-700')}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default DashboardSidebar;
