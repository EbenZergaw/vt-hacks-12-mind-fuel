"use client";

import { useState, useEffect } from "react";
import ProfileDisplay from "../../../components/ProfileDisplay";
import LinkDisplay from "../../../components/LinkDisplay";
import { useUser } from "@clerk/nextjs";
import SquigglyUnderline from "../../../components/SquigglyUnderline";
import CreateCollectionModal from "../../../components/CreateCollectionModal";
import { useParams, useRouter } from 'next/navigation';

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

function ProfilePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { isLoaded, isSignedIn, user } = useUser(); // Get the current authenticated user
  const router = useRouter();
  const [linkData, setLinkData] = useState<LinkData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingLinks, setLoadingLinks] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<{
    tags: string[];
    mediaType: string[];
    collection: string;
  }>({
    tags: [],
    mediaType: [],
    collection: 'All',
  });

  // Redirect to the dashboard if the user ID from URL matches the authenticated user's ID
  useEffect(() => {
    if (isLoaded && user && id === user.id) {
      router.push('/dashboard');
    }
  }, [isLoaded, user, id, router]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/profile/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData({
          userID: data.id,
          username: data.username,
          avatarUrl: data.avatar || "/default-avatar.png",
          bio: data.bio || "No bio available",
          socials: data.socials || [],
          collections: data.collections || [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  // Fetch link data for the user
  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const response = await fetch(`/api/link/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch link data');
        }
        const data = await response.json();
        setLinkData(data);
      } catch (error) {
        console.error("Error fetching link data:", error);
      } finally {
        setLoadingLinks(false); // Stop loading once data is fetched
      }
    };

    if (id) {
      fetchLinkData();
    }
  }, [id]);

  // Apply filtering logic based on filterOptions
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

  if (!isLoaded || !userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Profile Section */}
      <div id="profile-section" className="bg-black p-4">
        <ProfileDisplay userID={id || ''} displayType="display" />
      </div>

      {/* Main Content Section */}
      <div className="w-[90%] mx-auto h-full">
        <div className="w-80% mx-auto p-4 overflow-auto">
          {/* Filter Buttons */}
          <div className="flex justify-between mb-3">
            <div className="mb-2 text-lg flex items-center justify-between items-stretch space-x-3">
              <SquigglyUnderline collections={userData.collections} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
            </div>
          </div>

          {/* Filtered Links */}
          {loadingLinks ? (
            <div>Loading links...</div>
          ) : filteredLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredLinks.map((link) => (
                <LinkDisplay key={link.linkID} linkData={link} />
              ))}
            </div>
          ) : (
            <div>No links found for this user.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
