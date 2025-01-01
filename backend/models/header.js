import mongoose from "mongoose";

const headerSchema = new mongoose.Schema({
  Logo: {
    type: String
  },
  Name: {
    type: String
  }
})

const Header = mongoose.model("Header", headerSchema)
export default Header;
