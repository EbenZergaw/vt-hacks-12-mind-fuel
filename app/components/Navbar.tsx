"use client";
import { useAuth } from "@clerk/nextjs";
import { Search, User } from "lucide-react";
import Link from "next/link";

import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/moving-border";
import PostLinkModal from "./PostLinkModal";

export default function Navbar() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <a href="/" className="text-text font-bold text-orange-400">
            Logo
          </a>
        </div>
        {
            userId ? (
                <PostLinkModal />
            ) : null
        }
      </div>

      <div className="flex-1 max-w-md mx-auto bg-black rounded-full">
        <div className="relative bg-black rounded-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 bg-black w-full rounded-full mx-auto border-gray-500 text-white"
          />
        </div>
      </div>

      <div>
        {userId ? (
          // Link to profile page
          <>
            <Link
              href="/dashboard"
              className="flex items-center space-x-1 text-md font-medium text-white"
            >
              <User className="h-6 w-6" />
              <span>Profile</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/sign-up"
              className="flex items-center space-x-1 text-md font-medium text-white"
            >
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
