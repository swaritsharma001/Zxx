import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  img: {
    type: String
  },
  url: {
    type: String
  }
}, { timestamps: true });

const Ad = mongoose.model("Ad", adSchema);

export default Ad;