"use client";

import { useState, useEffect } from "react";
import { Github, Twitter, Globe } from "lucide-react";
import ProfileDisplay from "../../components/ProfileDisplay";
import LinkDisplay from "../../components/LinkDisplay";
import { useUser } from "@clerk/nextjs";
import SquigglyUnderline from "../../components/SquigglyUnderline";
import { SignOutButton } from "@clerk/nextjs";
import CreateCollectionModal from "../../components/CreateCollectionModal";
import { useParams, useRouter } from 'next/navigation';

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

const placeholderUser: UserData = {
  userID: "johndoe",
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
  collections: ["Tech", "Design", "Philosophy", "Combat Sports"],
};

const links = ["id123", "id124", "id125", "123"];

// Write a function that generates a random collection string according to what's in placeholderUser.collections
const generateRandomCollection = (): string => {
  const randomIndex = Math.floor(Math.random() * placeholderUser.collections.length);
  return placeholderUser.collections[randomIndex];
};

const fetchLinkData = async (linkID: string): Promise<LinkData> => {
  // Simulate fetching data with a correct mediaType
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        linkID,
        userID: "user123",
        url: "https://www.dimension.dev/",
        date: new Date(),
        title: "Sample Article Title",
        description: "This is a sample description for the article.",
        // Ensure mediaType is one of the valid values
        mediaType: "video", // Explicitly use a value from MediaType
        collection: generateRandomCollection(),
        tags: ["technology", "web", "react"],
      });
    }, 1000);
  });
};

function ProfilePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { isLoaded, isSignedIn, user } = useUser(); // Get the current authenticated user
  const router = useRouter();
  const [linkData, setLinkData] = useState<LinkData[]>([]);
  const [userData, setUserData] = useState<UserData>(placeholderUser);
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

  // Fetch all link data on mount
  useEffect(() => {
    const fetchData = async () => {
      const allLinkData = await Promise.all(links.map(fetchLinkData));
      setLinkData(allLinkData);
    };
    fetchData();
  }, []);

  // Apply filtering logic based on filterOptions
  const filteredLinks = linkData.filter((link) => {
    const matchesCollection =
      filterOptions.collection.length === 0 ||
      filterOptions.collection.includes(link.collection) ||
      filterOptions.collection == ("All");

    const matchesTags =
      filterOptions.tags.length === 0 ||
      filterOptions.tags.some((tag) => link.tags.includes(tag));

    const matchesMediaType =
      filterOptions.mediaType.length === 0 ||
      filterOptions.mediaType.includes(link.mediaType);

    return matchesCollection && matchesTags && matchesMediaType;
  });

  if (isLoaded && isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Profile Section */}
        <div id="profile-section" className="bg-black p-4">
          <ProfileDisplay userID={id || ''} displayType="display" />
        </div>

        {/* Main Content Section */}
        <div className="flex w-full h-full">
          <div className="w-3/4 w-full p-4 overflow-auto">
            {/* Filter Buttons */}
            <div className="flex justify-between mb-3">
              <div className="mb-2 text-lg flex justify-evenly">
                <SquigglyUnderline collections={placeholderUser.collections} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
              </div>

              {/* Hide the "Create Collection" button when viewing another user's profile */}
              {user.id === id ? (
                <div className="float-right">
                  <CreateCollectionModal />
                </div>
              ) : null}
            </div>

            {/* Filtered Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredLinks.map((link) => (
                <LinkDisplay key={link.linkID} linkData={link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default ProfilePage;
