require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const verifyToken = require("./middlewares/verifyToken");

const postsRoutes = require("./routes/posts.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use("/", authRoutes);

app.use(verifyToken);

app.use("/posts", postsRoutes);

const port = process.env.APP_PORT;

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main().catch((err) => console.log(err));
