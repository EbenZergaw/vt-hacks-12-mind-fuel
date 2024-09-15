import React, { useState } from 'react';
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
import { useUser } from '@clerk/nextjs'; // Use Clerk's hook for user authentication

function CreateCollectionModal() {
  const { user } = useUser(); // Get the current user
  const [collectionName, setCollectionName] = useState(''); // State to store the new collection name
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to manage error messages

  // Function to handle form submission
  const handleSaveChanges = async () => {
    if (!collectionName.trim()) {
      setError("Collection name can't be empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Ensure user is not null before accessing its properties
      if (!user) {
        throw new Error('User is not authenticated');
      }

      // Strip "user_" prefix from the Clerk user ID
      const databaseUserID = user.id.replace("user_", "");

      // Make an API request to update the user's collections in the database
      const response = await fetch(`/api/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: databaseUserID,  // Use "id" to match backend expectations
          collection: collectionName,  // Sending the new collection name
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to update collections.');
      }

      // Reset the input field after successful submission
      setCollectionName('');
      alert('Collection created successfully!'); // Show success message or handle UI changes

    } catch (error: any) {
      setError(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

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
          <div>
            <Label htmlFor="name" className="text-right text-white">
              Collection Name
            </Label>
            <br />
            <Input
              id="name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)} // Update state when the input changes
              placeholder="New collection"
              className="col-span-3 text-gray-400 border-gray-500"
            />
            {error && <p className="text-red-500">{error}</p>} {/* Show error message if exists */}
          </div>
        </div>

        <DialogFooter>
          <Button
            className="bg-white text-black hover:bg-purple-500 fade"
            variant="default"
            onClick={handleSaveChanges}
            disabled={loading} // Disable button while saving
          >
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCollectionModal;
