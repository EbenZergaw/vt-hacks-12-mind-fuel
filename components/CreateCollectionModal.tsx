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
  const [success, setSuccess] = useState<string | null>(null); // State to manage success messages
  const [isOpen, setIsOpen] = useState(false); // State to manage modal open state

  // Function to handle form submission
  const handleSaveChanges = async () => {
    if (!collectionName.trim()) {
      setError("Collection name can't be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

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
      setSuccess('Collection created successfully!');
      
      // Close the modal and refresh the page after a short delay
      setTimeout(() => {
        setIsOpen(false);
        // Refresh the page
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      setError(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setCollectionName('');
    setError(null);
    setSuccess(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetModal();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Create New Collection</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-black border-gray-500">
        <DialogHeader>
          <DialogTitle className="text-white">New Collection</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new collection to organize your links.
          </DialogDescription>
        </DialogHeader>

        {!success && !error && (
          <>
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
          </>
        )}

        {(success || error) && (
          <div className="py-4 text-center">
            {success && <p className="text-green-500">{success}</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateCollectionModal;
