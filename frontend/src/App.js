import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import {
  Container,
  AppBar,
  Typography,
  Grow,
  Grid,
  Button,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import memories from "./images/memories.png";
import Posts from "./components/Posts/Posts";
import Form from "./components/Form/Form";
import { PostsProvider } from "./Context/PostsContext";
import useStyles from "./styles";

function App() {
  const classes = useStyles();
  //New Post notification State
  const [notification, setNotification] = useState("");

  const scrollTop = () => {
    window.scrollTo(0, 0);
    setNotification("");
  };

  return (
    <Container maxWidth="lg">
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography className={classes.heading} variant="h2" align="center">
          Memories
        </Typography>
        <img
          className={classes.image}
          src={memories}
          alt="memories"
          height="60"
        />
      </AppBar>
      {notification !== "" ? (
        <div className={classes.sticky}>
          <p>{notification}</p>{" "}
          <CloseIcon
            style={{ position: "absolute", top: 5, right: 5 }}
            onClick={() => setNotification("")}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={scrollTop}
          >
            Check
          </Button>
        </div>
      ) : (
        ""
      )}
      <Grow in>
        <Container>
          <PostsProvider>
            <Grid
              className={classes.mainContainer}
              container
              justify="space-between"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12} sm={7}>
                <Posts setNotification={setNotification} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Form />
              </Grid>
            </Grid>
          </PostsProvider>
        </Container>
      </Grow>
    </Container>
  );
}

export default App;
