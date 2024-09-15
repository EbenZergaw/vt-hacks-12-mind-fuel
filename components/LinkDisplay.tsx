import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FileText, Video, Headphones, Image, Globe, HelpCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import LinkPreview from "./ui/link-preview"; // Ensure this path is correct

// Update MediaType to match the Prisma schema
type MediaType = "IMAGE" | "VIDEO" | "ARTICLE" | "PODCAST" | "WEBSITE" | "OTHER";

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
  IMAGE: Image,
  VIDEO: Video,
  ARTICLE: FileText,
  PODCAST: Headphones,
  WEBSITE: Globe,
  OTHER: HelpCircle,
};

interface LinkDisplayProps {
  linkData: LinkData;
}

export default function LinkDisplay({ linkData }: LinkDisplayProps) {
  const MediaTypeIcon = mediaTypeIcons[linkData.mediaType];

  return (
    <Card className="w-full max-w-md bg-black border-gray-800 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl hover:border-gray-400 fade">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded">
            <MediaTypeIcon className="h-6 w-6 text-gray-400" />
          </div>
          <span className="text-gray-400 text-sm sm:text-base">
            {linkData.mediaType.charAt(0).toUpperCase() + linkData.mediaType.slice(1).toLowerCase()}
          </span>
        </div>
        <span className="text-gray-400 text-sm sm:text-base">
          {format(new Date(linkData.date), "MM/dd/yyyy")}
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        <a
          target="_blank"
          href={linkData.url}
          className="text-base sm:text-lg md:text-xl font-bold text-white"
        >
          {linkData.title}
        </a>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base">
          {linkData.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
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
        <div className="flex justify-between items-center w-full mt-8">
          <Link
            className="text-gray-400 text-xs sm:text-sm md:text-base hover:text-purple-600"
            href={`/profile/${linkData.userID}`}
          >
            {/* Posted by {linkData.profile.username} */}
          </Link>
          <LinkPreview
            url={linkData.url}
            className="flex items-center text-smrounded cursor-pointer text-pink-500 opacity-40 hover:opacity-100"
          >
            View
            <Eye className="h-6 w-6 ml-2 text-pink-500" />
          </LinkPreview>
        </div>
      </CardFooter>
    </Card>
  );
}
