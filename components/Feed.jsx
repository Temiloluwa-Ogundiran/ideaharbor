"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import { useRouter } from "next/navigation";

const PromptCardList = ({ data, handleTagClick, handleEdit, handleDelete }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={() => handleTagClick(post.tag)}
          handleEdit={() => handleEdit(post)}
          handleDelete={() => handleDelete(post)}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, [deleted]);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);

    if (e.target.value === "") {
      setDeleted(!deleted);
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();

    if (searchText === "") {
      setDeleted(!deleted);
    }

    const theResult = filterPrompts(searchText);
    setPosts(theResult);
  };

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

  const handleTagClick = (tag) => {
    setSearchText(tag);

    const theResult = filterPrompts(tag);
    setPosts(theResult);
  };
  return (
    <section className="feed">
      <form className="relative w-full flex-center" onSubmit={searchSubmit}>
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          className="search_input peer"
        />
      </form>
      <PromptCardList
        data={posts}
        handleTagClick={handleTagClick}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </section>
  );
};

export default Feed;
