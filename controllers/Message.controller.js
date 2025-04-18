const { validationResult } = require("express-validator");
const messageModel = require("../models/Message");
const userModel = require('../models/UserModel');


module.exports.getChatList = async (req, res) => {
    const userId = req.user._id;
    try {
        const messages = await messageModel.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ timestamp: -1 });

        const chatMap = new Map();
        for (let msg of messages) {
            const otherId = msg.sender.equals(userId) ? msg.receiver.toString() : msg.sender.toString();
            if (!chatMap.has(otherId)) {
                chatMap.set(otherId, msg);
            }
        }

        const chatList = [];
        for (let [otherId, msg] of chatMap.entries()) {
            const otherUser = await userModel.findById(otherId).select("username");
            if (otherUser) {
                const unreadCount = await messageModel.countDocuments({
                    sender: otherId,
                    receiver: userId,
                    read: false,
                });

                chatList.push({
                    user: otherUser,
                    lastMessage: msg.content,
                    timestamp: msg.timestamp,
                    unreadCount: unreadCount,
                });
            }
        }

        return res.status(200).json({ success: true, chatList });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, msg: "Internal Server error" });
    }
};

module.exports.getChat=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,msg:"Not all feilds are submitted."});
    }
    else{
        const userId=req.user._id;
        const {otherId}=req.body;
        try{
            const messages=await messageModel.find({
                $or:[{sender:otherId,receiver:userId},{sender:userId,receiver:otherId}]
            }).sort({timestamp:-1}).lean();
            if(messages){
                await messageModel.updateMany({sender:otherId,receiver:userId,read:false},{$set:{read:true}})
                return res.status(200).json({success:true,messages:messages});
            }
            else{
                return res.status(400).json({success:false,messages:[]});
            }
        }
        catch(e){
            console.log(e);
            return res.status(500).json({success:false,msg:"Internal servet error"});
        }
    
    }
}

