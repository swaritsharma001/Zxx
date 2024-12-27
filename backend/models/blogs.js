import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
  },
  uploadedBy: {
    type: String,
      },
  TotalViews: {
    type: Number,
    default: 0
  },
  Sorting: {
    type: Number,
  },
  slug: {
    type: String,
    required: true
  }
})

const Blog = mongoose.model("blogs", blogSchema)

export default Blog