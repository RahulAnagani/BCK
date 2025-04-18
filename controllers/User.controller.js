const { validationResult } = require("express-validator");
const UserModel=require("../models/UserModel");
const mailer=require("../controllers/Mailer")
const crypto = require('crypto');
const bcrypt=require("bcrypt");
const otpModel = require("../models/otp");
const generateOtp = () => {
  const buffer = crypto.randomBytes(2);
  const number = buffer.readUInt16BE(0);
  const otp = number % 10000;
  return otp.toString().padStart(4, '0');
};

module.exports.login=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({success:false,msg:"Not all fields are submitted!",errors:errors.array()});
    }
    else{
        const {username,password}=req.body;
        const usernamee=String(username).toLowerCase();
        try{
            const user=await UserModel.findOne({username:usernamee}).select("+password");
            if(!user){
                res.status(404).json({success:false,msg:"No user found with this username."});
            }
            else{
                if(await user.VerifyPass(password)){
                    const token=user.GenerateToken();
                    res.cookie("token",token);
                    const userObj = user.toObject();
                    delete userObj.password;
                    res.status(200).json({success:true,token:token,user:userObj});
                }
                else{
                    res.status(400).json({success:false,msg:"Wrong Password"})
                }
            }
        }
        catch(e){
            res.status(500).json({success:false,msg:"Internal server error"});
        }
    }
}
module.exports.register=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())res.status(400).json({success:false,msg:"Not all fields are submitted."});
    else{
        const {username,email,password}=req.body;
        const usernameee=String(username).toLowerCase();
        try{
            const user=await UserModel.findOne({email:email});
            const use1=await UserModel.findOne({username:usernameee});
            if(user){
                res.status(400).json({success:false,msg:"User Already Exists."});
            }
            if(use1){
                res.status(400).json({success:false,msg:"Username is already taken."});
            }
            else{
                const pass=await bcrypt.hash(password,10);
                const otp=generateOtp();
                const sent=await mailer.SendOtp(email,usernameee,pass,otp);
                if(sent){
                    res.status(200).json({success:true,msg:"OTP is sent the email."});
                }
            }
        }
        catch(e){
            res.status(500).json({success:false,msg:"Internal Server Error",error:e});
        }
    }
}
module.exports.verifyOtp=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())res.status(400).json({success:false,msg:"All fields are not subitted.",error:errors.array()});
    else{
        try{
            const {otp,email}=req.body; 
            const found=await otpModel.findOne({email:email,otp:otp});
            if(!found){
                res.status(404).json({success:false,msg:"Not found"})
            }
            else{
                const present=new Date(Date.now());
                if(present>found.expiresAt){
                    res.status(400).json({success:false,msg:"OTP expired"});
                }
                else{
                    const {username,email,password}=found;
                    const user= new UserModel({
                        email,username,password
                    });
                    const saveduser=await user.save();
                    const token=saveduser.GenerateToken();
                    if(token)res.status(200).json({success:true,token:token,user:saveduser});
                    else res.status(500).json({success:false,msg:"Internal Server Issue."});
                }
            }
        }
        catch(e){
            res.status(500).json({success:false,msg:"Internal Server Error"});
        }
    }
}

module.exports.getMyProfile=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({success:false,msg:"Not all fields are submitted."});
    try{
         const user=await UserModel.findOne({_id:req.user._id}).populate("books");
            if(!user){
                res.status(404).json({success:false,msg:"User not found!"});
            }
            else{
                res.status(200).json({success:true,user:user});
            }
    }
    catch(e){
        console.log(e);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}
module.exports.ValidateToken=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({success:false,msg:"Not all fields are submitted."});
    try{
         const user=await UserModel.findOne({_id:req.user._id});
            if(!user){
                res.status(404).json({success:false,msg:"User not found!"});
            }
            else{
                res.status(200).json({success:true,user:user});
            }
    }
    catch(e){
        console.log(e);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}

module.exports.logout=async(req,res)=>{

}


module.exports.search = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid username query.", errors: errors.array() });
    }
  
    const { username } = req.query;
  
    try {
      const users = await UserModel.find({
        username: { $regex: username, $options: "i" },
      }).select("_id username");
  
      return res.status(200).json({ success: true, users });
    } catch (e) {
      console.error("Search error:", e);
      return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
  };