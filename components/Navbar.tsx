"use client";
import { useAuth } from "@clerk/nextjs";
import { Search, User, UserRoundSearch } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { MovingBorderButton } from "@/components/ui/moving-border";
import PostLinkModal from "./PostLinkModal";

export default function Navbar() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b border-gray-700">
      <div className="mx-auto w-[80%] flex items-center justify-between">
        {/* LOGO */}
        <Link href="/profile" className="w-10 h-10 rounded-full flex items-center justify-center text-white">
          People
        </Link>

        {userId ? (
          <PostLinkModal />
        ) : (
          <Link href="/sign-up">
            <MovingBorderButton className="bg-gradient-to-t from-violet-600 to-indigo-600 hover:bg-[#0F021D] fade">
              Post Something
            </MovingBorderButton>
          </Link>
        )}

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
      </div>
    </nav>
  );
}
