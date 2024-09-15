"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Twitter, Github, Globe } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { SignOutButton } from "@clerk/nextjs";
import EditProfileModal from "./EditProfileModal";
import Image from "next/image";

// Define UserData type
interface UserData {
  userID: string;
  username: string;
  avatar: string;
  bio: string;
  socials: Array<{
    name: string;
    url: string;
    icon: React.ComponentType<any>;
  }> | null; // socials might be null initially
}

// Define props for the ProfileDisplay component
interface ProfileDisplayProps {
  userID: string;
  displayType: "display" | "dashboard" | "thumbnail";
}

// Helper function to strip "user_" prefix from Clerk user ID
const getDatabaseUserID = (clerkUserID: string) => {
  return clerkUserID.replace("user_", "");
};

// Fetch user data from the API
const fetchUserData = async (userID: string): Promise<UserData> => {
  const response = await fetch(`/api/profile/${userID}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  const data = await response.json();
  
  // Ensure socials are parsed correctly
  data.socials = Array.isArray(data.socials) ? data.socials : [];

  return data;
};

function ProfileDisplay({ userID, displayType }: ProfileDisplayProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Strip "user_" prefix from the passed-in userID
        const databaseUserID = getDatabaseUserID(userID);

        // Fetch user data and update state
        const fetchedUserData = await fetchUserData(databaseUserID);
        setUserData(fetchedUserData);
        setLoading(false); // Data is loaded
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [userID]);

  if (loading) {
    return <LoadingProfile />;
  }

  if (!userData) return null;


  return (
    <div className={`max-w-2xl mx-auto p-4 ${userID !== user?.id && displayType === "thumbnail" ? 'rounded-lg border border-gray-500' : 'w-full'}`}>
      <div className="flex items-start space-x-4">
        <Avatar className="w-32 h-32">
        <img src={userData.avatar} alt={userData.username} crossOrigin="anonymous" />
          <AvatarFallback>{userData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-white">{userData.username}</h1>

            {(userID === user?.id && displayType === "dashboard") && (
              <div className="flex flex-col space-y-4">
                <EditProfileModal />
                <div className="text-white float-right text-right">
                  <SignOutButton />
                </div>
              </div>
            )}
            {(userID !== user?.id && displayType === "thumbnail") && (
              <a className="text-white hover:underline" href={`/profile/${userID}`}>
                View
              </a>
            )}
            {(userID !== user?.id && displayType === "display") && (
              // Social interactions or other UI components could be added here
              ''
            )}
          </div>
          <div className="flex space-x-4 mb-4">
            {userData.socials?.map((social) => {
              const colors: { [key: string]: string } = {
                Twitter: "text-blue-500",
                GitHub: "text-gray-600",
                Website: "text-green-500",
              };
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center text-white hover:underline ${colors[social.name] || ""}`}
                >
                  <social.icon className={`inline mr-1 ${colors[social.name] || ""}`} size={20} />
                  {social.name}
                </a>
              );
            })}
          </div>
          <p className="text-gray-600">{userData.bio}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingProfile() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-start space-x-4">
        <Skeleton className="bg-gray-400 opacity-30 w-32 h-32 rounded-full" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="bg-gray-400 opacity-30 h-8 w-32" />
            <Skeleton className="bg-gray-400 opacity-30 h-10 w-24" />
          </div>
          <div className="flex space-x-4 mb-4">
            <Skeleton className="bg-gray-400 opacity-30 h-6 w-20" />
            <Skeleton className="bg-gray-400 opacity-30 h-6 w-20" />
            <Skeleton className="bg-gray-400 opacity-30 h-6 w-20" />
          </div>
          <Skeleton className="bg-gray-400 opacity-30 h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

export default ProfileDisplay;
