const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({

    name:{ 
        type: String,
        trim:true,
        required:true
    },
    email:String,
    password:{
        type:String,
        trim:true,
        required:true
    }, 
    profilePic:{
        type:String,
        default:""
    }
  

} ,{timestamps:true})


UserSchema.methods.generateToken = async function(){
    
    try {
        
        const token = await jwt.sign({_id:this._id} ,process.env.JWT_SECRET_KEY);
        await this.save();
        return token;
        

    } catch (error) {
        console.log(error.message);
    }

}



const User = new mongoose.model('User' ,UserSchema);
module.exports = User;