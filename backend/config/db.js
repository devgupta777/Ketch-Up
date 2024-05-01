const mongoose=require('mongoose');

const connectDB=async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log(`MongoDB connected ${conn.connection.host}`.blue.bold);
    }
    catch(err)
    {
        console.log(`error: ${err.message}`);
        process.exit();
    }
}
module.exports= connectDB;