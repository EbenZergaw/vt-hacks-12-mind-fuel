"use client";

import { useState, useEffect } from "react";
import { Github, Twitter, Globe } from "lucide-react";
import ProfileDisplay from "../components/ProfileDisplay";
import LinkDisplay from "../components/LinkDisplay";

import { useUser } from "@clerk/nextjs";

interface UserData {
  username: string;
  avatarUrl: string;
  bio: string;
  socials: Array<{
    name: string;
    url: string;
    icon: React.ComponentType<any>;
  }>;
}

const placeholderUser: UserData = {
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

const links = [
  "id123",
  "id124",
  "id125",
  "id126",
  "id127",
  "id128",
  "id129",
  "id130",
  "id131",
  "id132",
]

function Profile() {
  const [loading, setLoading] = useState(true);
  // const [userData, setUserData] = useState<UserData | null>(null);

  const { isLoaded, isSignedIn, user } = useUser();

  
 const userData = (placeholderUser);

  if (isLoaded && isSignedIn) {
    // return <LoadingProfile />;
    return (
      <>
        <ProfileDisplay userID={user.id} displayType="dashboard" />
        <div className="lg:grid lg:grid-cols-4 md:grid-colrs-3 lg:gap-4">
          {links.map((link) => (
            <LinkDisplay key={link} linkID={link} />
          ))}
        </div>
      </>
    );
  }
}

interface ProfileDisplayProps {
  userData: UserData;
}

export default Profile;
