"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Import user data from Clerk
import { MovingBorderButton } from "./ui/moving-border";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { useRouter } from "next/navigation";

function PostLinkModal() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [descCharCount, setDescCharCount] = useState(0);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadataFetched, setMetadataFetched] = useState(false); // Track if metadata is fetched
  const [collections, setCollections] = useState<string[]>([]); // Store user collections
  const [selectedCollection, setSelectedCollection] = useState(""); // Collection selected by the user
  const [isOpen, setIsOpen] = useState(false); // Flag to control modal visibility

  const { user } = useUser(); // Fetch the user data
  const router = useRouter();

  // Fetch user's collections on load
  useEffect(() => {
    const fetchCollections = async () => {
      if (!user) return;
      const userID = user.id.replace("user_", "");

      try {
        const response = await fetch("/api/profile/collections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userID }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data = await response.json();
        console.log(data);
        setCollections(data.collections);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError("Failed to load collections");
      }
    };

    fetchCollections();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const userID = user.id.replace("user_", "");

    const linkData = {
      userID,
      url,
      title,
      description,
      mediaType,
      collection: selectedCollection,
      tags,
    };

    try {
      const response = await fetch("/api/link/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(linkData),
      });

      if (!response.ok) {
        throw new Error("Failed to post link");
      }

      const result = await response.json();
      // Reset form fields and close modal if successful
      setIsOpen(false);
      setUrl("");
      setTitle("");
      setDescription("");
      setMediaType("ARTICLE");
      setSelectedCollection("");
      setTags([]);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error posting link:", error);
      setError("An unexpected error occurred");
    }
  };

  // Function to handle URL input and fetch metadata
  const handleUrlChange = async (e: any) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);

    if (inputUrl.trim() !== "") {
      try {
        setLoading(true);
        setError(null);
        setMetadataFetched(false); // Reset form visibility

        const response = await fetch("/api/fetch-metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: inputUrl }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }

        const data = await response.json();

        // Truncate description to 150 characters if it exceeds the limit
        const truncatedDescription = data.description
          ? data.description.slice(0, 150)
          : "";

        // Autofill the fields with the fetched metadata
        setTitle(data.title || "");
        setDescription(truncatedDescription); // Set truncated description
        setMediaType(data.mediaType || ""); // Default to empty if not found
        setDescCharCount(truncatedDescription.length); // Update character count
        setMetadataFetched(true); // Show the rest of the form
      } catch (err: any) {
        setError("Could not fetch metadata. Please enter details manually.");
        setMetadataFetched(true); // Show the form even if metadata fails
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDescriptionChange = (e: any) => {
    const descText = e.target.value;
    if (descText.length <= 150) {
      setDescription(descText);
      setDescCharCount(descText.length);
    }
  };

  const handleTagsChange = (e: any) => {
    const newTags = e.target.value.split(",").slice(0, 3);
    setTags(newTags);
  };

  // Function to validate the URL format
  const isValidUrl = (urlString: string) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };

  // Enable the submit button only if the required fields are filled and the URL is valid
  const canSubmit =
    isValidUrl(url) && title.trim() !== "" && mediaType.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <MovingBorderButton className="bg-gradient-to-t from-violet-600 to-indigo-600 hover:bg-[#0F021D] fade">
          Post Something
        </MovingBorderButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-black border-gray-500">
        <DialogHeader>
          <DialogTitle className="text-white">Post a Link</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share a link and organize it into your collections.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* URL Input (Always visible) */}
            <div>
              <Label htmlFor="url" className="text-right text-white">
                URL
              </Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={handleUrlChange}
                className="col-span-3 text-gray-400 border-gray-500"
              />
            </div>

            {/* Show the skeleton loader and message when loading */}
            {loading && (
              <div className="flex flex-col items-center">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <p className="text-gray-400">Fetching metadata...</p>
              </div>
            )}

            {/* Show the form only when metadata is fetched */}
            {!loading && metadataFetched && (
              <>
                <div>
                  <Label htmlFor="title" className="text-right text-white">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Link title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="col-span-3 text-gray-400 border-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-right text-white">
                    Description (max 150 characters)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the link"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="col-span-3 text-gray-400 border-gray-500"
                  />
                  <p className="text-right text-gray-400">{descCharCount}/150</p>
                </div>

                <div>
                  <Label htmlFor="mediaType" className="text-right text-white">
                    Media Type
                  </Label>
                  <Select
                    value={mediaType} // Autofilled media type
                    onValueChange={setMediaType}
                  >
                    <SelectTrigger className="w-[180px] text-white">
                      <SelectValue placeholder="Select Media Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-black">Media Type</SelectLabel>
                        <SelectItem value="ARTICLE">Article</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="PODCAST">Podcast</SelectItem>
                        <SelectItem value="IMAGE">Image</SelectItem>
                        <SelectItem value="WEBSITE">Website</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="collection" className="text-right text-white">
                    Collection
                  </Label>
                  <Select
                    value={selectedCollection} // Autofilled user collections
                    onValueChange={setSelectedCollection}
                  >
                    <SelectTrigger className="w-[180px] text-white">
                      <SelectValue placeholder="Select Collection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-black">Collection</SelectLabel>
                        {collections.map((collection) => (
                          <SelectItem key={collection} value={collection}>
                            {collection}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-right text-white">
                    Tags (max 3, comma-separated)
                  </Label>
                  <Input
                    id="tags"
                    placeholder="e.g. technology, education, design"
                    value={tags.join(",")}
                    onChange={handleTagsChange}
                    className="col-span-3 text-gray-400 border-gray-500"
                  />
                  <p className="text-right text-gray-400">{tags.length}/3</p>
                </div>

                {error && <p className="text-red-500">{error}</p>}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              className="bg-white text-black hover:bg-purple-500 fade"
              variant="default"
              disabled={!canSubmit} // Disable button if the required fields are not filled
              type="submit"
            >
              Submit Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PostLinkModal;
