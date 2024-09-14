import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  FileText,
  Video,
  Headphones,
  Image,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import LinkPreview from "@/components/ui/link-preview";
import Link from "next/link";
type MediaType = "article" | "video" | "podcast" | "image" | "post";

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

const mediaTypeIcons: Record<MediaType, React.ElementType> = {
  article: FileText,
  video: Video,
  podcast: Headphones,
  image: Image,
  post: MessageSquare,
};

const fetchLinkData = async (linkID: string): Promise<LinkData> => {
  // Simulate data fetching with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        linkID,
        userID: "user123",
        url: "https://www.dimension.dev/",
        date: new Date(),
        title: "Sample Article Title",
        description:
          "This is a sample description for the article. It provides a brief overview of the content.",
        mediaType: "video",
        collection: "My Favorite Reads",
        tags: ["technology", "web", "react",],
      });
    }, 1000); // Simulated delay
  });
};

const fetchUsername = async (userID: string): Promise<string> => {
  // Simulate fetching username with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("JohnDoe");
    }, 500); // Simulated delay
  });
};

interface LinkDisplayProps {
  linkID: string;
}

export default function LinkDisplay({ linkID }: LinkDisplayProps) {
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchLinkData(linkID);
      setLinkData(data);
      const fetchedUsername = await fetchUsername(data.userID);
      setUsername(fetchedUsername);
      setLoading(false); // Stop loading after data is fetched
    }

    loadData();
  }, [linkID]);

  if (loading || !linkData || !username) {
    return (
      <Card className="w-full max-w-md bg-gray-400 opacity-30 border-gray-800 h-[280px]">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-400 p-2 rounded">
              <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-5 w-16" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-1/2" />
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          <div className="flex justify-between items-end mb-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-5 w-full" />
        </CardFooter>
      </Card>
    );
  }

  const MediaTypeIcon = mediaTypeIcons[linkData.mediaType];

  return (
    <Card className="w-full max-w-md bg-black border-gray-800 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded">
            <MediaTypeIcon className="h-6 w-6 text-gray-400" />
          </div>
          <span className="text-gray-400 text-sm sm:text-base">
            {linkData.mediaType.charAt(0).toUpperCase() +
              linkData.mediaType.slice(1)}
          </span>
        </div>
        <span className="text-white text-sm sm:text-base">
          {format(linkData.date, "MM/dd/yyyy")}
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        <LinkPreview
          url={linkData.url}
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
        >
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">
            {linkData.title}
          </h2>
        </LinkPreview>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base">
          {linkData.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-stretch">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2 w-full">
          <div className="space-x-2 mb-2 sm:mb-0">
            {linkData.tags.map((tag, index) => (
              <span
                key={index}
                className="text-gray-200 text-xs sm:text-sm py-1 px-2 rounded-full bg-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-end">
            <div
              className="p-2 rounded mb-1 cursor-pointer"
              onClick={() => window.open(linkData.url, "_blank")}
            >
              <LinkPreview
                url={linkData.url}
                className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
              >
                <ExternalLink className="h-6 w-6 text-gray-400" />
              </LinkPreview>
            </div>
          </div>
        </div>
        <Link
          className="text-purple-500 text-xs sm:text-sm md:text-base float-right"
          href={`/profile/${linkData.userID}`}
        >
          posted by {username}
        </Link>
      </CardFooter>
    </Card>
  );
  
}
