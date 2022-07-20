const mongoose = require('mongoose');

const ChatRoomSchma = new mongoose.Schema({

    roomName:{
        type:String,
        trim:true
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        } 
    ],
    messages:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            message:String 
        }
    ]

} ,{timestamps:true})


ChatRoomSchma.methods.deleteMessage = async function(idx){
    try {
       
        this.messages = this.messages.filter((msg ,index)=>{
            
           return idx!==index ;
        })
        //console.log(this.messages);
        await this.save();
       
        
        
    } catch (error) {
        console.log(error.message);
        
    }
}
const ChatRoom = new mongoose.model('ChatRoom' ,ChatRoomSchma);
module.exports = ChatRoom;