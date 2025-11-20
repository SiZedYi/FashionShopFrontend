"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heart, HelpCircle, ListOrdered, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import Cookies from 'js-cookie';
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";

const AccountPopover = () => {
  const pathname = usePathname();
  const user = useAuthStore(s => s.user);
  const clearUser = useAuthStore(s => s.clearUser);
  const router = useRouter();

  const handleLogout = () => {
    try {
      Cookies.remove('auth_token');
    } catch {}
    clearUser();
    showToast('Logged out', '/images/products/placeholder.png', 'You have been signed out');
    router.replace('/');
  };
  const userLinks = [
    {
      link: "/my-account",
      label: "My Account",
      icon: <User />,
      isActive: pathname.includes("/my-account"),
    },
    {
      link: "/wishlist",
      label: "Wishlist",
      icon: <Heart />,
      isActive: pathname.includes("/wishlist"),
    },
    {
      link: "/my-orders",
      label: "My Orders",
      icon: <ListOrdered />,
      isActive: pathname.includes("/my-orders"),
    },
    {
      link: "/help",
      label: "Help",
      icon: <HelpCircle />,
      isActive: pathname.includes("/help"),
    },
  ];

  return (
    <div className="hidden lg:block">
      <Popover>
        <PopoverTrigger className="flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 duration-200 p-2 rounded-md">
          <User size={25}  />
        </PopoverTrigger>
        <PopoverContent
          className=" rounded-2xl 
      "
        >
          <ul className="space-y-1 text-center ">
            {user ? <UserAvatar {...user} /> : null}
            <Separator className="!my-2" />
            {userLinks.map((link) => (
              <Link
                key={link.link}
                href={link.link}
                className={cn(
                  "flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md",
                  link.isActive && "bg-gray-200  dark:bg-gray-800"
                )}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <Separator className="!my-2" />
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-start justify-start gap-2 p-2 bg-transparent hover:opacity-50 w-full text-left"
              >
                <LogOut />
                Logout
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-start justify-start gap-2 p-2 bg-transparent hover:opacity-50"
              >
                <User /> Sign In
              </Link>
            )}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccountPopover;
