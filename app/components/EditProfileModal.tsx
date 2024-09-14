import React, { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from './ui/textarea'

function EditProfile() {
  const [bio, setBio] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleBioChange = (e:any) => {
    const bioText = e.target.value;
    if (bioText.length <= 250) {
      setBio(bioText);
      setCharCount(bioText.length);
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
          <div>
            <Label htmlFor="name" className="text-right text-white">
              Name
            </Label>
            <Input id="name" placeholder="Your name" className="col-span-3 text-gray-400 border-gray-500" />
          </div>

          <div>
            <Label htmlFor="twitter" className="text-right text-white">
              Twitter
            </Label>
            <Input id="twitter" placeholder="Twitter handle" className="col-span-3 text-gray-400 border-gray-500" />
          </div>

          <div>
            <Label htmlFor="github" className="text-right text-white">
              GitHub
            </Label>
            <Input id="github" placeholder="GitHub username" className="col-span-3 text-gray-400 border-gray-500" />
          </div>

          <div>
            <Label htmlFor="website" className="text-right text-white">
              Website
            </Label>
            <Input id="website" placeholder="Website URL" className="col-span-3 text-gray-400 border-gray-500" />
          </div>

          <div>
            <Label htmlFor="bio" className="text-right text-white">
              Bio (max 250 characters)
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={handleBioChange}
              className="col-span-3 text-gray-400 border-gray-500"
            />
            <p className="text-right text-gray-400">{charCount}/250</p>
          </div>
        </div>

        <DialogFooter>
          <Button className='bg-white text-black hover:bg-purple-500 fade' variant="default">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfile;
