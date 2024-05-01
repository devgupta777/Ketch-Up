const mongoose=require("mongoose");
const bcrypt=require('bcryptjs')
const userModel=mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        pic:{type:String,default: "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png"}},
      {timestamps:true}
    
);
userModel.methods.matchPassword=async(enteredpassword,a)=>{
    return await bcrypt.compare(enteredpassword,a);

}
userModel.pre("save", async function(next)
{
    if(!this.isModified)
    {
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
});
const User=mongoose.model("User",userModel);
module.exports=User;