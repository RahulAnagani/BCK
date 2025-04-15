const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:5
    },
    username:{
        type:String,
        required:true,
        minlength:3,
        unique:true
    }
    ,
    password:{
        type:String,
        required:true,
        minlength:4,
        select:false
    },
    socketId:{
        type:String,
    },
    location:{
        ltd:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    swappedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});
UserSchema.methods.GenerateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.PASS, { expiresIn: "24h" });
}
UserSchema.methods.HashPass=async(password)=>{
    return await bcrypt.hash(password,10);
}
UserSchema.methods.VerifyPass = async function (password) {
    if(password==undefined||this.password==undefined)return false;
    return await bcrypt.compare(password, this.password);
  };
  
module.exports=mongoose.model("User",UserSchema);