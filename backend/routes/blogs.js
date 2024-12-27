import express from "express";
import  Blog from "../models/blogs.js";
import slugify from "slugify";
const router = express.Router();
import upload from "../middle/upload.js"
import Ads from "../models/ads.js"
import { Redis } from '@upstash/redis'
import {verifyToken, verifyAdmin} from "../jwt/jwt.js";
router.post("/upload", verifyAdmin, upload.single("cover"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const cover = req.file.path;
  const blog = new Blog({
    Title: req.body.Title,
    slug: slugify(req.body.Title, { lower: true }),
    description: req.body.description,
    cover: cover,
    Sorting: Date.now(),
    createdAt: new Date(), // Store the current date as a Date object
    uploadedBy: "UJJWAL SHARMA",
  });

  try {
    await blog.save();
    res.status(200).send("Blog uploaded");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//normal photo upload
router.post("/UploadImg", verifyAdmin, upload.single("img"), async (req, res)=>{
  if(!req.file) return res.status(400).send("No file Uploaded")
  const img = req.file.path;
  res.json({url: img})
})

router.get("/allBlogs", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Defaults: page 1, 10 blogs per page
  try {
    const parsedLimit = parseInt(limit, 10);

    const allBlogs = await Blog.find()
      .sort({ Sorting: -1 })
 // Sort by Sorting field in descending order
      .skip((page - 1) * parsedLimit)
      .limit(parsedLimit);

    const formattedBlogs = allBlogs.map(({ _doc, createdAt }) => ({
      ..._doc,
      createdAt: new Date(createdAt).toDateString(),
    }));

    return res.status(200).json(formattedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/ads", verifyAdmin, upload.single("img"), async (req, res)=>{
  if(!req.file) return res.status(400).send("No file Provided")

  const newAd = new Ads({
    img: req.file.path,
    url: req.body.url
  })
 newAd.save()
  res.status(200).json({message: "Uploaded"})
})

router.get("/ads", async (req, res)=>{
const ads = await Ads.find()
  res.status(200).json(ads)
})
//Get one blog
router.get("/blog/:id", async (req, res)=>{
  try {
    const slug = req.params.id;
    const BlogData = await Blog.findOne({ slug })
    
const UpdateViews = await Blog.findOneAndUpdate({slug}, {views: BlogData.views + 1}, {new: true })
    if(!Blog) return res.status(404).json({message: "Blog not found"})
    res.json(BlogData)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal Server Error"})
  }
})
//delete blog
router.delete("/delete/:id", verifyAdmin, async(req, res)=>{
  try {
    const BlogData = await Blog.findById(req.params.id)
    if(!BlogData) return res.status(404).json({message: "Blog not Found"})
  // delete the blog
    await Blog.findByIdAndDelete(req.params.id)
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"})
  }
})
export default router