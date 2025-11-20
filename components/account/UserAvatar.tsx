import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user";

const UserAvatar = (user: User | null) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>{user?.fullName ? user.fullName.charAt(0) : "CN"}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold text-lg">Welcome,</h2>
        <p className="-mt-1 text-left">{user?.fullName}</p>
      </div>
    </div>
  );
};

export default UserAvatar;
