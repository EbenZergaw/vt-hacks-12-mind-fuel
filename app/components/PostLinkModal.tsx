import React, { useState } from "react";
import { Button as BorderButton} from "@/app/components/ui/moving-border";
import { Button } from "./ui/button";
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
import { Textarea } from "./ui/textarea";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

function PostLinkModal() {
  const [description, setDescription] = useState("");
  const [descCharCount, setDescCharCount] = useState(0);
  const [tags, setTags] = useState([]);

  const handleDescriptionChange = (e) => {
    const descText = e.target.value;
    if (descText.length <= 150) {
      setDescription(descText);
      setDescCharCount(descText.length);
    }
  };

  const handleTagsChange = (e) => {
    const newTags = e.target.value.split(",").slice(0, 3);
    setTags(newTags);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <BorderButton className="bg-black hover:bg-[#0F021D] fade">
          Post Something
        </BorderButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-black border-gray-500">
        <DialogHeader>
          <DialogTitle className="text-white">Post a Link</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share a link and organize it into your collections.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="url" className="text-right text-white">
              URL
            </Label>
            <Input
              id="url"
              placeholder="https://example.com"
              className="col-span-3 text-gray-400 border-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="title" className="text-right text-white">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Link title"
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
            <Select>
              <SelectTrigger className="w-[180px] text-white">
                <SelectValue placeholder="Select Media Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-black">Media Type</SelectLabel>
                  <SelectItem value="articles">Articles</SelectItem>
                  <SelectItem value="videos">Videos</SelectItem>
                  <SelectItem value="podcasts">Podcasts</SelectItem>
                  <SelectItem value="images">Images</SelectItem>
                  <SelectItem value="posts">Posts</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mediaType" className="text-right text-white">
              Collection
            </Label>
            <Select>
              <SelectTrigger className="w-[180px] text-white">
                <SelectValue placeholder="Select Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-black">Media Type</SelectLabel>
                  <SelectItem value="articles">Articles</SelectItem>
                  <SelectItem value="videos">Videos</SelectItem>
                  <SelectItem value="podcasts">Podcasts</SelectItem>
                  <SelectItem value="images">Images</SelectItem>
                  <SelectItem value="posts">Posts</SelectItem>
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
        </div>

        <DialogFooter>
          <Button
            className="bg-white text-black hover:bg-purple-500 fade"
            variant="default"
          >
            Submit Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PostLinkModal;
