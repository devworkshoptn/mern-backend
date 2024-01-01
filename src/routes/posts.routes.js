const express = require("express");
const Post = require("../models/post.model");

const router = express.Router();

router.get("/", async (request, response) => {
  const userId = request.user.id;
  const posts = await Post.find({ user: userId }).populate(
    "user",
    "email _id createdAt"
  );
  return response.json(posts);
});

router.get("/:id", async (request, response) => {
  const id = request.params.id;
  const post = await Post.findById(id);
  if (!post) {
    return response.status(404).json({
      message: `Post with id ${id} not found`,
    });
  }
  return response.json(post);
});

router.post("/", async (request, response) => {
  const { title, content } = request.body;
  const userId = request.user.id;
  const post = await Post.create({ title, content, user: userId });
  return response.json(post);
});

router.post("/:id/comment", async (request, response) => {
  const id = request.params.id;
  const { content } = request.body;
  const post = await Post.findByIdAndUpdate(
    id,
    { $push: { comments: { content } } },
    { new: true }
  );
  if (!post) {
    return response.status(404).json({
      message: `Post with id ${id} not found`,
    });
  }
  return response.json(post);
});

router.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { title, content } = request.body;
  const post = await Post.findByIdAndUpdate(
    id,
    { $set: { title, content } },
    { new: true }
  );
  if (!post) {
    return response.status(404).json({
      message: `Post with id ${id} not found`,
    });
  }
  return response.json(post);
});

router.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const post = await Post.findByIdAndDelete(id);
  return response.json(post);
});

module.exports = router;
