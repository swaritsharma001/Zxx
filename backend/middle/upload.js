import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


cloudinary.config({
  cloud_name: "dfmpb2aii",
  api_key: "637296684939831",
  api_secret: "FTvJen8maIqkhI9KeUEpNfDjzvE",
});
function generateRandom() {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
// Multer storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    resource_type: "auto",
    public_id: (req, file) => `${generateRandom()}-${file.originalname}`,
  },
});

const upload = multer({ storage: storage });
export default upload;