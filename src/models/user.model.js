const mongoose = require('mongoose');
const bycrypt = require('bcryptjs'); 


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    }
}
,{
    timestamps:true
})
userSchema.pre('save', async function(){
     
if(!this.isModified('password')){
    return next();}
    const hash = await bycrypt.hash(this.password,10);
    this.password = hash;
    return;


})
userSchema.methods.comparePassword = async function(password){
    return await bycrypt.compare(password,this.password)
}
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;