const express=require("express");
const connectDb = require("./config/connect");
const app=express();
const cors=require("cors");
const dotenv=require("dotenv").config();
const cookieParser=require("cookie-parser");
const userRoutes=require("./routes/UserRoutes");
const bookRoutes=require("./routes/BookRoutes");
const requestRouter=require("./routes/Request")
const mapRoutes=require("./routes/Map.routes");
const messageRoutes=require("./routes/Message.routes")
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use("/user",userRoutes);
app.use("/book",bookRoutes);
app.use("/request",requestRouter);
app.use("/maps",mapRoutes)
app.use("/message",messageRoutes)
app.get("/",(req,res)=>res.send("Star Start Power Starrrr !"));
connectDb();    
module.exports=app;