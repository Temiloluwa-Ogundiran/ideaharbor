"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const router = useRouter();
  const searchParam = useParams()
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${searchParam.id}/posts`);
      const theData = await response.json();
      setPosts(theData);
    };

    if (searchParam.id) {
      fetchPosts();
    }
  }, [searchParam.id, deleted]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
        setDeleted(true);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
