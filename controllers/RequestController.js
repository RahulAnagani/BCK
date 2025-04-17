const { validationResult } = require("express-validator");
const bookModel=require("../models/Book");
const userModel=require("../models/UserModel");
const reqModel=require("../models/Requests")
module.exports.makeRequest=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({success:false,msg:"Not all fields are recieved."});
    else{
        try{

            const koneVaadu=req.user._id;
            const {toBook}=req.body;
            const book=await bookModel.findById(toBook);
            if (!book) return res.status(404).json({ success: false, msg: "Book not found." });
            const ammeVaadu=await userModel.findById(book.owner);
            if(!ammeVaadu){
                return res.status(404).json({success:false,msg:"Seller not found"});
            }
            else{
                const alreadyRequested = await reqModel.findOne({
                    fromUser: koneVaadu,
                    toUser: ammeVaadu._id,
                    toBook,
                    status: "pending",
                    type: "Buy"
                  });
                  if (alreadyRequested) {
                    return res.status(400).json({ success: false, msg: "Request already sent." });
                  }
                const request=new reqModel({
                    fromUser:koneVaadu,
                    toUser:ammeVaadu._id,
                    toBook:toBook,
                    status:"pending",
                    type:"Buy"
                });
                const savedreq=await request.save();
                if(savedreq){
                    return res.status(200).json({success:true,req:savedreq});
                }
                else{
                    return res.status(500).json({success:false,msg:"Internal Server Error"});
                }
            }
        }
        catch(e){
            console.log(e);
            return res.status(500).json({success:false,msg:"Internal Server Error"});

        }
    }
}
module.exports.makeSwapRequest=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({success:false,msg:"Not all fields are recieved."});
    else{
        try{
            const koneVaadu=req.user._id;
            const {fromBook,toBook}=req.body;
            const book1=await bookModel.findById(fromBook);
            const book2=await bookModel.findById(toBook);
            if (!book1) return res.status(404).json({ success: false, msg: "Book not found." });
            if (!book2) return res.status(404).json({ success: false, msg: "Book not found." });
            const ammeVaadu=await userModel.findById(book2.owner);
            if(!ammeVaadu||book1.owner.toString() !== koneVaadu.toString()){
                return res.status(404).json({success:false,msg:"Seller not found"});
            }
            else{
                const alreadyRequested = await reqModel.findOne({
                    fromUser: koneVaadu,
                    toUser: ammeVaadu._id,
                    fromBook,
                    toBook,
                    status: "pending",
                    type: "Swap"
                  });
                  if (alreadyRequested) {
                    return res.status(400).json({ success: false, msg: "Request already sent." });
                  }
                  const reverseREquest=await reqModel.findOne({
                    fromUser:ammeVaadu._id,
                    toUser:koneVaadu,
                    toBook:fromBook,
                    fromBook:toBook
                  });
                const request=new reqModel({
                    fromUser:koneVaadu,
                    toUser:ammeVaadu._id,
                    fromBook:fromBook,
                    toBook:toBook,
                    status: reverseREquest ? "accepted" : "pending",
                    type:"Swap"
                });
                if(reverseREquest){
                    reverseREquest.status="accepted",
                    await reverseREquest.save();
                }
                const savedreq=await request.save();
                if(savedreq){
                    return res.status(200).json({success:true,req:savedreq});
                }
                else{
                    return res.status(500).json({success:false,msg:"Internal Server Error"});
                }
            }
        }
        catch(e){
            console.log(e);
            return res.status(500).json({success:false,msg:"Internal Server Error"});

        }
    }
}

module.exports.sentRequests=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({success:false,msg:"Fuck! push the neeeded fields"});
    else{
        try{
            const requests=await reqModel
            .find({ fromUser: req.user._id })
            .populate("toBook")
            .populate("fromBook")
            .populate("toUser", "username") 
            .sort({ createdAt: -1 });
            if(requests)
            return res.status(200).json({success:true,req:requests});
            else
            return res.status(200).json({success:true,msg:"No requests are made from your account",req:{}});
        }  
        catch(e){
            console.log(e);
            return res.status(500).json({success:false,msg:"Internal server error"});
        }
    }
}
module.exports.recievedRequests=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({success:false,msg:"Fuck! push the neeeded fields"});
    else{
        try{
            const requests=await reqModel
            .find({ toUser: req.user._id })
            .populate("toBook")
            .populate("fromBook")
            .populate("fromUser", "username") 
            .sort({ createdAt: -1 });
            if(requests)
            return res.status(200).json({success:true,req:requests});
        else
        return res.status(200).json({success:true,msg:"No requests are made to your account",req:{}});
}  
catch(e){
    console.log(e);
    return res.status(500).json({success:false,msg:"Internal server error"});
}
}
}

module.exports.acceptRequest=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({success:false,msg:"Fuck! push the neeeded fields"});
    else{
        try{

            const {reqId}=req.body;
            const request=await reqModel.findById(reqId);
            if (!request)
                return res.status(404).json({ success: false, msg: "Request not found" });
            if (request.toUser.toString() !== req.user._id.toString())
                return res.status(403).json({ success: false, msg: "Unauthorized" });
            if (request.status !== "pending")
                return res.status(400).json({ success: false, msg: "Request already handled" });
            request.status = "accepted";
            await request.save();
                return res.status(200).json({success:true,req:request});
        }
        catch(e){
            console.log(e);
            return res.status(500).json({success:false,msg:"Internal server error"});
        }
    }
}
module.exports.declineRequest=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({success:false,msg:"Fuck! push the neeeded fields"});
    else{
        try{
            const {reqId}=req.body;
            const request=await reqModel.findById(reqId);
            if (!request)
                return res.status(404).json({ success: false, msg: "Request not found" });
            if (request.toUser.toString() !== req.user._id.toString())
                return res.status(403).json({ success: false, msg: "Unauthorized" });
            if (request.status !== "pending")
                return res.status(400).json({ success: false, msg: "Request already handled" });
            request.status = "declined";
            await request.save();
                return res.status(200).json({success:true,req:request});
        }
        catch(e){
            console.log(e);
            return res.status(500).json({success:false,msg:"Internal server error"});
        }
    }
}

module.exports.cancelRequest = async (req, res) => {
    const { reqId } = req.body;
    try {
      const request = await reqModel.findById(reqId);
      if (!request)
        return res.status(404).json({ success: false, msg: "Request not found" });
      if (request.fromUser.toString() !== req.user._id.toString())
        return res.status(403).json({ success: false, msg: "Unauthorized" });
      if (request.status !== "pending")
        return res.status(400).json({ success: false, msg: "Can't cancel a handled request" });
  
      await request.deleteOne();
      return res.status(200).json({ success: true, msg: "Request cancelled" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, msg: "Internal server error" });
    }
  };
  

  module.exports.getSentRequests = async (req, res) => {
    try {
      const status = req.query.status; 
      const query = { fromUser: req.user._id };
      if (status) query.status = status;
  
      const requests = await reqModel
        .find(query)
        .populate("toBook")
        .populate("fromBook")
        .populate("toUser", "username")
        .sort({ createdAt: -1 });
  
      return res.status(200).json({ success: true, req: requests });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, msg: "Internal server error" });
    }
  };



  module.exports.getReceivedRequests = async (req, res) => {
    try {
      const status = req.query.status; 
      const query = { toUser: req.user._id };
      if (status) query.status = status;
  
      const requests = await reqModel
        .find(query)
        .populate("fromBook")
        .populate("toBook")
        .populate("fromUser", "username")
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: true, req: requests });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, msg: "Internal server error" });
    }
  };
  
  