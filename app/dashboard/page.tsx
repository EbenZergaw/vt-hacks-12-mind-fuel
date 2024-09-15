"use client";

import { useState, useEffect } from "react";
import { Github, Twitter, Globe } from "lucide-react";
import ProfileDisplay from "../components/ProfileDisplay";
import LinkDisplay from "../components/LinkDisplay";
import { useUser } from "@clerk/nextjs";
import SquigglyUnderline from "../components/SquigglyUnderline";
import { Button } from "../components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import CreateCollectionModal from "../components/CreateCollectionModal";
import { UserProfile } from "@clerk/nextjs";
import PostLinkModal from "../components/PostLinkModal";

// Define valid media types as a union type
type MediaType = "article" | "video" | "podcast" | "image" | "post";

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
  collections: Array<string>;
}

interface LinkData {
  linkID: string;
  userID: string;
  url: string;
  date: Date;
  title: string;
  description: string;
  mediaType: MediaType;
  collection: string;
  tags: string[];
}

// Helper function to strip "user_" prefix from Clerk user ID
const getDatabaseUserID = (clerkUserID: string) => {
  return clerkUserID.replace("user_", "");
};

const fetchUserData = async (userID: string): Promise<UserData> => {
  try {
    const res = await fetch(`/api/profile/${userID}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await res.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

const fetchLinksForUser = async (userID: string): Promise<LinkData[]> => {
  try {
    const res = await fetch(`/api/link?userID=${userID}`); // Adjust if your API has query params for userID
    if (!res.ok) {
      throw new Error("Failed to fetch link data");
    }
    const links = await res.json();
    return links;
  } catch (error) {
    console.error("Error fetching links:", error);
    throw error;
  }
};

function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [linkData, setLinkData] = useState<LinkData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [filterOptions, setFilterOptions] = useState<{
    tags: string[];
    mediaType: string[];
    collection: string;
  }>({
    tags: [],
    mediaType: [],
    collection: 'All',
  });

  // Fetch user and link data on mount if signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const fetchData = async () => {
        try {
          const databaseUserID = getDatabaseUserID(user.id); // Strip "user_" prefix

          // Fetch User Data
          const fetchedUserData = await fetchUserData(databaseUserID);
          setUserData(fetchedUserData);

          // Fetch Link Data
          const fetchedLinks = await fetchLinksForUser(databaseUserID);
          setLinkData(fetchedLinks);
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        }
      };
      fetchData();
    }
  }, [isLoaded, isSignedIn, user]);

  // Apply filtering logic based on filterOptions
  const filteredLinks = linkData.filter((link) => {
    const matchesCollection =
      filterOptions.collection.length === 0 ||
      filterOptions.collection === "All" ||
      filterOptions.collection.includes(link.collection);

    const matchesTags =
      filterOptions.tags.length === 0 ||
      filterOptions.tags.some((tag) => link.tags.includes(tag));

    const matchesMediaType =
      filterOptions.mediaType.length === 0 ||
      filterOptions.mediaType.includes(link.mediaType);

    return matchesCollection && matchesTags && matchesMediaType;
  });

  if (isLoaded && isSignedIn && userData) {
    return (
      <div className="min-h-screen flex flex-col w-full">
        {/* Profile Section */}
        <div id="profile-section" className="bg-black p-4">
          <ProfileDisplay userID={user.id} displayType="dashboard" />
        </div>
        
        {/* Main Content Section */}
        <div className="w-[90%] mx-auto h-full">
          {/* Curated Content Cards */}
          <div className="w-80% mx-auto p-4 overflow-auto">
            {/* Filter Buttons */}
            <div className="flex justify-between mb-3">
              <div className="mb-2 text-lg flex items-stretch">
                {
                  <SquigglyUnderline collections={userData.collections} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
                }
              </div>
              <div className="float-right">
                <CreateCollectionModal />
              </div>
            </div>

            {/* Filtered Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredLinks.map((link) => (
                <LinkDisplay key={link.linkID} linkData={link} />
              ))}
            </div>
            {
                filteredLinks.length === 0 && (
                  <div className="w-full">
                    <div className="mx-auto w-fit text-center text-white">
                      No links found :/
                      <br />
                          
                      <br />
                      <PostLinkModal></PostLinkModal>
                    </div>
                  </div>
                )
              }
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Dashboard;
