const express = require("express");
const User = require("./model/user");
const authRouter = express.Router();
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createConnection } = require("mongoose");
const user = require("./model/user");

authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    var user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ msg: "User created successfully " });
  } catch (e) {
    console.error("Error during signup:", e);
    res.status(500).json({ msg: e.message });
  }
});
authRouter.post("/api/signin",async(req,res)=>{
try{
  const {email,password}=req.body;
  const user=await User.findOne({email});
  if(!user){
    return res.status(400).json({msg:"User doesn't exist."});
  }
 const isMatching= await bcryptjs.compare(password,user.password);
 if(!isMatching){
  return res.status(400).json({msg:'Incorrect Password'})
 }
const token=jwt.sign({
  id:user._id,},"secretKey");
  user.token=token;
  await user.save();
res.json({token,...user._doc});



}catch(error){
res.status(500).json({error:error.message})
}
})

module.exports = authRouter; // Ensure you're exporting the router correctly