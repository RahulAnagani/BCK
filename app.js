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
app.use(express.json());
app.use(cors({
    origin: 'https://rgtcxhg8-5173.inc1.devtunnels.ms',
    credentials: true
  }));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use("/user",userRoutes);
app.use("/book",bookRoutes);
app.use("/request",requestRouter);
app.use("/maps",mapRoutes)
app.get("/",(req,res)=>res.send("Star Start Power Star !"));
connectDb();    
module.exports=app;