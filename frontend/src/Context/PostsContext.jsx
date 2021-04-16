import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../apiUrl";

export const PostsContext = createContext();

export const PostsProvider = (props) => {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const postsRes = await axios.get(`${apiUrl}/posts`);
      setPosts(postsRes.data);
      setPostsLoading(false);
    } catch (error) {
      setPostsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, postsLoading, setPosts }}>
      {props.children}
    </PostsContext.Provider>
  );
};
