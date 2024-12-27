import mongoose from "mongoose";

export default async function ConnectToDb(){
  await mongoose.connect("mongodb+srv://thegangstaguy001:NuLcOmlDKV6UGNoi@cluster0.nh1ewxi.mongodb.net/MaheshsharmaBlogsss?retryWrites=true&w=majority")
  .then(()=>{
    console.log("Connected To Db")
  }).catch((e)=>{
    console.log("Connection To Db failed", e)
  })
}