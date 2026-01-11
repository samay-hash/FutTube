const mongoose = require("mongoose");

async function connectDB(){
  try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Monogo db connected");
    
  } catch(e){
    console.log("Database Error:", e.message)
  }
}

module.exports = {
  connectDB
}