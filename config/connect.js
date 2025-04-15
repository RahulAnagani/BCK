const mongoose = require("mongoose");

const connectDb = async () => {
  const uri = process.env.URI;
  try {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Connected to DB:", connection.connection.host);
  } catch (err) {
    console.error("Initial DB connection failed:", err.message);

    setTimeout(connectDb, 5000); 
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

module.exports = connectDb;
