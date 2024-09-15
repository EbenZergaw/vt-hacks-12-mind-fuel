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
    <div className="w-full flex flex-col justify-between max-w-md bg-black border rounded-lg border-gray-800 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl hover:border-gray-400 fade">


      <div className="w-[90%] mx-auto">

        <div className="flex items-center justify-between">
          <div className="flex items-center my-4">
              <MediaTypeIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 ml-2 text-xs sm:text-base">
              {linkData.mediaType.charAt(0).toUpperCase() + linkData.mediaType.slice(1).toLowerCase()}
            </span>
          </div>
          <span className="text-gray-400 text-xs mr-2">
            {format(new Date(linkData.date), "MM/dd/yyyy")}
          </span>
          
        </div>

        <a
          target="_blank"
          href={linkData.url}
          className="text-base sm:text-md font-bold text-white"
        >
          {linkData.title}
        </a>
        <p className="text-gray-400 text-sm mt-4">
          {linkData.description}
        </p>
      </div>

      <CardFooter className="flex items-center justify-between mt-6">
        <div className="">
          {linkData.tags.map((tag, index) => (
            <span
              key={index}
              className="text-gray-200 text-xs sm:text-sm py-1 px-2 mx-1 rounded-full bg-gray-800"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="">
          <LinkPreview
            url={linkData.url}
            className="flex items-center text-smrounded cursor-pointer text-pink-500 opacity-40 hover:opacity-100"
          >
            View
            <Eye className="h-6 w-6 ml-2 text-pink-500" />
          </LinkPreview>
        </div>
      </CardFooter>
    </div>
  );
}
