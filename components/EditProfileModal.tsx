import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from './ui/textarea';
import { useUser } from "@clerk/nextjs"; // Clerk hook to get the current user
import { useAuth } from "@clerk/nextjs";

function EditProfile() {
  const { user } = useUser(); // Get the current user
  const [name, setName] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [charCount, setCharCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch current user profile data on mount
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setTwitter(user.publicMetadata?.twitter as string || "");
      setGithub(user.publicMetadata?.github as string || "");
      setWebsite(user.publicMetadata?.website as string || "");
      setBio(user.publicMetadata?.bio as string || "");
      setCharCount((user.publicMetadata?.bio as string || "").length);
    }
  }, [user]);

  // Handle bio change with character limit
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const bioText = e.target.value;
    if (bioText.length <= 250) {
      setBio(bioText);
      setCharCount(bioText.length);
    }
  };

  // Handle form submission
  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userID = user?.id.replace("user_", ""); // Ensure the user ID is correctly formatted
      const profileData = {
        name,
        twitter,
        github,
        website,
        bio,
      };

      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userID, ...profileData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Validate the website URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-black border-gray-500">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your profile details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-right text-white">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="col-span-3 text-gray-400 border-gray-500"
            />
          </div>

          {/* Twitter Field */}
          <div>
            <Label htmlFor="twitter" className="text-right text-white">
              Twitter
            </Label>
            <Input
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="Twitter handle"
              className="col-span-3 text-gray-400 border-gray-500"
            />
          </div>

          {/* GitHub Field */}
          <div>
            <Label htmlFor="github" className="text-right text-white">
              GitHub
            </Label>
            <Input
              id="github"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="GitHub username"
              className="col-span-3 text-gray-400 border-gray-500"
            />
          </div>

          {/* Website Field with URL validation */}
          <div>
            <Label htmlFor="website" className="text-right text-white">
              Website
            </Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website URL"
              className={`col-span-3 text-gray-400 border-gray-500 ${website && !isValidUrl(website) ? "border-red-500" : ""}`}
            />
            {website && !isValidUrl(website) && (
              <p className="text-red-500">Invalid URL</p>
            )}
          </div>

          {/* Bio Field */}
          <div>
            <Label htmlFor="bio" className="text-right text-white">
              Bio (max 250 characters)
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={handleBioChange}
              placeholder="Tell us about yourself"
              className="col-span-3 text-gray-400 border-gray-500"
            />
            <p className="text-right text-gray-400">{charCount}/250</p>
          </div>
        </div>

        {/* Error/Success Feedback */}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <DialogFooter>
          <Button
            className="bg-white text-black hover:bg-purple-500 fade"
            variant="default"
            onClick={handleSaveChanges}
            // disabled={loading || (website && !isValidUrl(website))} // Disable if loading or website is invalid
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfile;
