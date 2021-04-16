import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import moment from "moment";
import useStyles from "./styles";
import axios from "axios";
import { apiUrl } from "../../../apiUrl";

const Post = ({ post }) => {
  const [canLikePost, setCanLikePost] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const likePost = async () => {
    try {
      setLikeLoading(true);
      const likeRes = await axios.patch(`${apiUrl}/posts/like/${post._id}`, {
        payload: canLikePost,
      });
      // console.log(likeRes.data);
      setCanLikePost(!canLikePost);
      setLikeLoading(false);
    } catch (error) {
      setLikeLoading(false);
      console.log(error);
    }
  };

  const classes = useStyles();
  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          // style={{ height: "400px", width: "400px", paddingTop: "56.25%" }}
          image={post.selectedFile}
          title={post.title}
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{post.creator}</Typography>
          <Typography variant="body2">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        <div className={classes.overlay2}>
          <Button style={{ color: "white" }} size="small" onClick={() => {}}>
            <MoreHorizIcon fontSize="default" />
          </Button>
        </div>
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary">
            {post.tags[0]}
          </Typography>
        </div>
        <Typography className={classes.title} variant="h5" gutterBottom>
          {post.title}
        </Typography>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {post.message}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            disabled={likeLoading}
            size="small"
            color="primary"
            onClick={likePost}
          >
            <ThumbUpAltIcon fontSize="small" />
            {canLikePost ? "Like" : "Unlike"} {post.likeCount}
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Post;
