import React, { useEffect, useState, useContext } from "react";
import Post from "./Post/Post";
import useStyles from "./styles";
import { Grid, CircularProgress } from "@material-ui/core";
import Pusher from "pusher-js";
import axios from "axios";
import { PostsContext } from "../../Context/PostsContext";
import { apiUrl } from "../../apiUrl";

const Posts = ({ setNotification }) => {
  const classes = useStyles();

  const { posts, postsLoading, setPosts } = useContext(PostsContext);

  // pusher events
  useEffect(() => {
    let pusher = new Pusher("cd3b55b312e4d4e122b9", {
      cluster: "eu",
    });

    //new Post added
    //once you get new post id from pusher fetch that post
    //cant send the whole post with pusher due to large size
    let channel = pusher.subscribe("my-channel");
    channel.bind("my-event", async (data) => {
      // console.log(data);
      const postRes = await axios.get(`${apiUrl}/posts/${data.id}`);
      setPosts((currPosts) => {
        return [postRes.data, ...currPosts];
      });
    });

    //like event
    channel.bind("like-event", (data) => {
      setPosts((currPosts) => {
        return currPosts.map((p) => {
          if (p._id === data.id) {
            return { ...p, likeCount: data.likeCount };
          }
          return p;
        });
      });
    });
  }, []);

  //for New Post notifications
  useEffect(() => {
    let pusher2 = new Pusher("cd3b55b312e4d4e122b9", {
      cluster: "eu",
    });
    // retrieve the socket ID once we're connected
    //so that it exculdes this ID when sending from the backend
    pusher2.connection.bind("connected", function () {
      // attach the socket ID to all outgoing Axios requests
      axios.defaults.headers.common["x-socket-id"] =
        pusher2.connection.socket_id;
    });
    let channel2 = pusher2.subscribe("my-channel");
    channel2.bind("notification", (data) => {
      // console.log(data);
      if (window.scrollY !== 0) {
        setNotification("New Post");
      }
    });
  }, []);

  return (
    <div>
      {/* <h1>Posts</h1> */}
      {postsLoading ? (
        <CircularProgress />
      ) : (
        <Grid
          className={classes.mainContainer}
          container
          alignItems="stretch"
          spacing={3}
        >
          {posts.map((p) => {
            return (
              <Grid key={p._id} item xs={12} sm={6}>
                <Post post={p} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

export default Posts;
