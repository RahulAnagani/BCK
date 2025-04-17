const mongoose = require("mongoose");
const SwapRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fromBook: {type: mongoose.Schema.Types.ObjectId, ref: "Book"},
  toBook: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined","received"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  type:{
    type:String,
    enum: ["Swap", "Buy"],
    required:true,
    default:"Buy"
  }
});

module.exports = mongoose.model("SwapRequest", SwapRequestSchema);