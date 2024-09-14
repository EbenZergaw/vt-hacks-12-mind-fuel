import React from 'react'
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

function CreateCollectionModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Collection</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-black border-gray-500">
        <DialogHeader>
          <DialogTitle className="text-white">New Collection</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new collection to organize your links.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="">
            <Label htmlFor="name" className="text-right text-white">
              Collection Name
            </Label>
            <br />
            <Input id="name" placeholder="New collection" className="col-span-3 text-gray-400 border-gray-500" />
          </div>
         
        </div>

        <DialogFooter>
          <Button className='bg-white text-black hover:bg-purple-500 fade' variant="default">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCollectionModal
