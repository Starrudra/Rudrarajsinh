const mongoose=require("mongoose")

module.exports=()=>{
   
    try{
        mongoose.connect(process.env.DB)
        console.log("connected to database successfully");
        
    }catch(error){
        console.log(error);
        console.log("could not connect to database");
        
    }
}


// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DB, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB successfully");
//   } catch (error) {
//     console.error("❌ Could not connect to MongoDB:", error.message);
//     process.exit(1); // Stop the app if the database connection fails
//   }
// };

// module.exports = connectDB;
