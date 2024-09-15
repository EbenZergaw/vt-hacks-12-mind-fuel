"use client";

import { useState, useEffect } from "react";
import ProfileDisplay from "../../components/ProfileDisplay";

interface UserData {
  userID: string;
  username: string;
  avatarUrl: string;
  bio: string;
}

const ProfilePage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/profiles");

        if (!response.ok) {
            console.log(response.statusText)
          throw new Error("Failed to fetch user profiles");
        }

        const data = await response.json();
        // Map data to the structure used in UserData
        const formattedUsers = data.map((user: any) => ({
          userID: user.id,
          username: user.username,
          avatarUrl: user.avatar || "/default-avatar.png", // Fallback to default avatar
          bio: user.bio || "No bio available",
        }));

        setUsers(formattedUsers);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">User Profiles</h1>
      <div className="grid grid-cols-3 gap-4">
        {users.map((user) => (
          <ProfileDisplay
            key={user.userID}
            userID={user.userID}
            displayType="thumbnail" // Set display type to "thumbnail"
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
