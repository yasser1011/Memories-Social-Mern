const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const postsRoute = require("./routes/posts");

app.use(cors());
app.use(express.json({ limit: "30MB" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.get("/", (req, res) => {
  res.send("home route");
});

app.use("/posts", postsRoute);

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  () => {
    console.log("connected to db");
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
