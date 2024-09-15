"use client";

import { useState, useEffect } from "react";
import { Github, Twitter, Globe } from "lucide-react";
import ProfileDisplay from "../../components/ProfileDisplay";
import LinkDisplay from "../../components/LinkDisplay";
import { useUser } from "@clerk/nextjs";
import SquigglyUnderline from "../../components/SquigglyUnderline";
import { Button } from "../../components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import CreateCollectionModal from "../../components/CreateCollectionModal";
import { UserProfile } from "@clerk/nextjs";
import PostLinkModal from "../../components/PostLinkModal";

// Define valid media types as a union type
// make these match the prisma schema capitals

type MediaType = "ARTICLE" | "VIDEO" | "PODCAST" | "IMAGE" | "WEBSITE" | "OTHER";

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
    const res = await fetch(`/api/link/${userID}`); // Pass userID as part of the path
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

  const filteredLinks = linkData.filter((link) => {
    // Collection filtering
    const matchesCollection =
      filterOptions.collection === "All" || // Show all if "All" is selected
      filterOptions.collection.length === 0 || // Show all if no collection is selected
      (link.collection === filterOptions.collection && link.collection !== null && link.collection !== ""); // Exact match for collection and it's not null/empty
  
    // Tags filtering (ensure at least one tag matches if tags are selected)
    const matchesTags =
      filterOptions.tags.length === 0 || // Show all if no tags are selected
      filterOptions.tags.every((selectedTag) =>
        link.tags.includes(selectedTag)
      ); // Ensure each selected tag is in the link's tags
  
    // Media type filtering
    const matchesMediaType =
      filterOptions.mediaType.length === 0 || // Show all if no media type is selected
      filterOptions.mediaType.includes(link.mediaType); // Check for a match with the selected media types
  
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
            <div className="flex items-center justify-between mb-3">
            
              <div className="mb-2 text-lg flex items-stretch">
                {
                  <SquigglyUnderline collections={userData.collections} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
                }
                <div className="ml-16">
                  <CreateCollectionModal />
                </div>
              </div>

              <div>
                <PostLinkModal></PostLinkModal>
              </div>
            </div>
            

            {/* Filtered Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredLinks.map((link) => {
                return <LinkDisplay key={link.linkID} linkData={link} />;
              })} 
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
