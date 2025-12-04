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
    try { Cookies.remove('auth_token'); } catch {}
    clearUser();
    showToast('Logged out', 'You have been signed out');
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

  // Always declare hooks at the top
  const [open, setOpen] = React.useState(false);
  const closeTimeout = React.useRef<number | undefined>(undefined);

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      window.clearTimeout(closeTimeout.current);
      closeTimeout.current = undefined;
    }
    setOpen(true);
  };
  const handleMouseLeave = () => {
    closeTimeout.current = window.setTimeout(() => setOpen(false), 150);
  };

  // Not logged in: simple link with icon + Login text (no dropdown)
  if (!user) {
    return (
      <div className="hidden lg:block">
        <Link
          href="/sign-in"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 duration-200"
          aria-label="Login"
        >
          <User size={22} />
          <span className="text-sm font-medium">Login</span>
        </Link>
      </div>
    );
  }

  // Logged in: popover with username (open on hover)
  return (
    <div className="hidden lg:block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 duration-200">
          <User size={22} />
          <span className="text-sm font-medium max-w-[160px] truncate" title={user.fullName}>{user.fullName}</span>
        </PopoverTrigger>
        <PopoverContent className="rounded-2xl" sideOffset={8} align="end">
          <ul className="space-y-1 text-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <UserAvatar {...user} />
            <Separator className="!my-2" />
            {userLinks.map(link => (
              <Link
                key={link.link}
                href={link.link}
                className={cn(
                  "flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md",
                  link.isActive && "bg-gray-200 dark:bg-gray-800"
                )}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <Separator className="!my-2" />
            <button
              onClick={handleLogout}
              className="flex items-start justify-start gap-2 p-2 bg-transparent hover:opacity-50 w-full text-left"
            >
              <LogOut />
              Logout
            </button>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccountPopover;
