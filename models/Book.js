const mongoose=require("mongoose");
const BookSchema=new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    author: String,
    genre: String,
    condition: {
        type: String,
        enum: ['new', 'good', 'fair', 'poor'],
        required: true
      },
    isAvailable: Boolean,
    imageUrl: String,
    location: {
        ltd:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    },
    key:String
  });
  module.exports=mongoose.model("Book",BookSchema);
