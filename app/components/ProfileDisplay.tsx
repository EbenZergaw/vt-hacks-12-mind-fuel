'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Twitter, Github, Globe } from "lucide-react";
import { useUser } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface UserData {
  userID: string;
  username: string;
  avatarUrl: string;
  bio: string;
  socials: Array<{
    name: string;
    url: string;
    icon: React.ComponentType<any>;
  }>;
}

interface ProfileDisplayProps {
  userID: string;
  displayType: "display" | "dashboard";
}

const placeholderUser: UserData = {
  userID: "user_2m37rv5HAtPkepP7ZCsKtf0viLb",
  username: "johndoe",
  avatarUrl: "/placeholder.svg?height=128&width=128",
  bio: "Frontend developer passionate about creating beautiful and functional user interfaces.",
  socials: [
    {
      name: "Twitter",
      url: "https://twitter.com/johndoe",
      icon: Twitter,
    },
    {
      name: "GitHub",
      url: "https://github.com/johndoe",
      icon: Github,
    },
    {
      name: "Website",
      url: "https://johndoe.com",
      icon: Globe,
    },
  ],
};

function ProfileDisplay({ userID, displayType }: ProfileDisplayProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchUserData(userID: string) {
      // Simulate an API call delay
      return new Promise<UserData>((resolve) => {
        setTimeout(() => {
          resolve(placeholderUser);
        }, 1000); // simulate network delay
      });
    }

    // Fetch user data and update state
    fetchUserData(userID).then((data) => {
      setUserData(data);
      setLoading(false); // Set loading to false when data is fetched
    });
  }, [userID]);

  if (loading) {
    return <LoadingProfile />;
  }

  if (!userData) return null;

  return (
    <div className={`max-w-2xl mx-auto p-4 ${(userID !== user?.id && displayType === "display") ? 'rounded-lg border border-gray-500' : ''}`}>
      <div className="flex items-start space-x-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={userData.avatarUrl} alt={userData.username} />
          <AvatarFallback>
            {userData.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-white">{userData.username}</h1>

            {(userID === user?.id && displayType === "dashboard") && (
              <Button variant="outline">Edit Profile</Button>
            )}
            {(userID !== user?.id && displayType === "display") && (
              <a className="text-white hover:underline" href={`/profile/${userID}`}>View</a>
            )}
          </div>
          <div className="flex space-x-4 mb-4">
            {userData.socials.map((social) => {
              const colors: { [key: string]: string } = {
                Twitter: "text-blue-500",
                GitHub: "text-gray-200",
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
                  <social.icon className="inline mr-1" size={16} />
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
