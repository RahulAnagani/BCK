const jwt=require("jsonwebtoken");
const UserModel=require("../models/UserModel");
const logoutModel=require("../models/Logout");
module.exports.validateUser=async(req,res,next)=>{
    const token=req.cookies.token||req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(400).json({success:false,msg:"No token found."});
    }
    else{
        try{
            const loggedOut=await logoutModel.findOne({token});
            if(loggedOut)return res.status(400).json({success:false,msg:"User logged out."});
            else{
                const decoded=jwt.verify(token,process.env.PASS);

                const user=await UserModel.findById(decoded._id);
                if(user){
                    req.user=user;
                    next();
                }
                else{
                    return res.status(400).json({success:false,msg:"User not found"});
                }
            }
        }
        catch(e){
            console.log(e);
            if(e.name==='TokenExpiredError'){
                return res.status(400).json({success:false,msg:"Session Expired"});
            }
           return  res.status(500).json({success:false,msg:"Internal Server Error"});
        }
    }
}