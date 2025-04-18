const { Server } = require("socket.io");
const userModel = require("./models/UserModel");
const messageModel = require("./models/Message"); 

let io;
const onlineUsers = new Map();
module.exports.initializeServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on("connection", (socket) => {

    socket.on("join", async (data) => {
      const { userId } = data;
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      console.log("hi")
      try {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        socket.userId = userId; 
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("send-message", async (data) => {
      const { senderId, receiverUsername, content } = data;
      if (!senderId || !receiverUsername || !content.trim()) return;
    
      try {
        const sender = await userModel.findById(senderId);
        const receiver = await userModel.findOne({ username: receiverUsername });
        if (!sender || !receiver) return;
    
        const message = new messageModel({
          sender: senderId,
          receiver: receiver._id,
          content,
          read: false
        });
        await message.save();
    
        const receiverSocketId = onlineUsers.get(receiver._id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new-message", {
            senderId,
            senderUserName: sender.username,
            content
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
    

    socket.on("typing", (data) => {
        const { senderId, receiverId } = data;
        if (!senderId || !receiverId) return;
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId }); 
        }
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        try {
        onlineUsers.delete(socket.userId);
          await userModel.findByIdAndUpdate(socket.userId, { socketId: null });
        } catch (e) {
          console.log(e);
        }
      }
    });
  });
};
