"use client";

import { useState, useEffect } from "react";
import ProfileDisplay from "../components/ProfileDisplay";

interface UserData {
  userID: string;
  username: string;
  avatarUrl: string;
  bio: string;
}

const dummyUsers: UserData[] = [
  {
    userID: "user1",
    username: "johndoe",
    avatarUrl: "/avatar1.png",
    bio: "Frontend developer passionate about UI/UX design.",
  },
  {
    userID: "user2",
    username: "janedoe",
    avatarUrl: "/avatar2.png",
    bio: "Fullstack developer and open-source contributor.",
  },
  {
    userID: "user3",
    username: "charlie",
    avatarUrl: "/avatar3.png",
    bio: "Machine learning enthusiast and Python expert.",
  },
  {
    userID: "user4",
    username: "alice",
    avatarUrl: "/avatar4.png",
    bio: "Blockchain developer focused on decentralized apps.",
  },
];

const ProfilePage = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  // Fetch users (for now, use hardcoded dummy data)
  useEffect(() => {
    setUsers(dummyUsers);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">User Profiles</h1>
      <div className="grid grid-cols-3 gap-4">
        {users.map((user) => (
          <ProfileDisplay
            key={user.userID}
            userID={user.userID}
            displayType="thumbnail"  // Set display type to "thumbnail"
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
