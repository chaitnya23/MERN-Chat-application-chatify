const express = require("express");
const router = express.Router();
const User = require("./database/models/UserModel");
const ChatRoom = require("./database/models/ChatRoomModel");
const authenticate = require('./middlewares/authentication');

//GET requests


//logout user 

router.get('/api/logout' ,async(req ,res)=>{

  try {
    res.clearCookie('chatapptoken').send('logged out');
    console.log("looged out succesfully ");

  } catch (error) {
    
    res.status(404).send('error in logging out');
  }
})

//userauthentication endpoint
router.get('/api/user' ,authenticate ,async(req ,res)=>{
  try {
    
    res.send(req.rootUser);

  } catch (error) {
    console.log(error.message);
    res.status(404).send('authentication failed');
  }
})

//get all rooms user present in 

//featching groupChats
router.get('/api/getRoomChats' ,async(req,res)=>{
  
  try {
    
    const {roomName} = req.body;
    const chat = await ChatRoom.findOne({roomName}).populate('users' ,'name').populate('messages.user' ,'name');
    res.send(chat);
    
  } catch (error) {
    res.status(404).send("error in finding messages");
  }
  
})

//featch personal chats

//get all the users
router.get('/api/getUsers' ,async(req ,res)=>{
  try {
    const users = await User.find({});
    res.send(users);
    
  } catch (error) {
    res.status(402).send('error in getting the users');
  }
}) 


//POST requests
router.post('/api/getrooms' , async(req ,res)=>{

  try { 
 
    const {userId} = req.body

    const rooms = await ChatRoom.find({$and:[{users:userId} ,{isGroupChat:true}]}).populate('users')
    res.status(200).send(rooms)

    

  } catch (error) {
    console.log(error.message); 
    res.status(404).send("error... to getting rooms");
  }
})

//user sign in
router.post("/api/signin", async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;
    
    if (!name || !email || !password ) {
      res.status(404).send("error... in signin");
      return;
    }

    const userExist = await User.findOne({
      $and: [{ password: password }, { email: email }],
    });
    if (userExist) {
      res.status(402).send("user already exist");
    } else {

      const user = await new User({ name, email, password, profilePic }).save();
      const token = await user.generateToken();

      res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        profilePic:user.profilePic,
        Token:token
      });

    }
  } catch (error) {
    console.log(error.message);
    res.status(404).send("error... in signin");
  }
});


//login user

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ $and: [{ email }, { password }] });
    
    if(user) {
      
      const token = await user.generateToken();
      
      res.cookie("chatapptoken" ,token ,{
          httpOnly:true
      })
      res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        profilePic:user.profilePic,
        Token:token
      });
      
    } else {
      res.status(404).send("wrong credentials..");
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).send("error... in login");
  }
});
 

// join room

router.post("/api/joinroom", async (req, res) => {

  try {
    
    const {userId , roomName } = req.body;
    
    const user = await User.findOne({_id:userId})
    
    const alreadyInRoom = await ChatRoom.findOne({users:userId});
    
    if(alreadyInRoom){

      const roomData = await ChatRoom.findOne({roomName}).populate('users');
      res.send(roomData);
        return ;
        
      }

      else{

        const roomUpdated = await ChatRoom.updateOne(
            { roomName },
            { $push: { users: user } }
            ); 
            
            
            const roomData = await ChatRoom.findOne({roomName}).populate('users');
            res.send(roomData);
          }
        
    
          
        } catch (error) {
          console.log(error.message);
        res.status(404).send("error... to join a room ");
      }
      
});

router.post('/api/createroom' ,async(req ,res)=>{
  
  try {
    
    const {roomName ,userId} = req.body;

    const roomExist = await ChatRoom.findOne({roomName});       
    if(roomExist){
      res.status(404).send("room already exists change name ");
      return ;
        }
        
        const user = await User.findOne({_id:userId})
          
        
        const newRoom = await new ChatRoom({
            roomName,
            isGroupChat:true
        })  
        await newRoom.save();

        const roomUpdated = await ChatRoom.updateOne(
          { roomName },
            { $push: { users: user } }
            ); 
             
            const roomData = await ChatRoom.findOne({roomName}).populate('users').populate('messages');
            res.send(roomData);    
            
          } catch (error) {
            console.log(error.message);
        res.status(404).send("error... to join a room ");
        
    }
  });

  //adding message to chat room
router.post('/api/add_msg_to_room' ,async(req ,res)=>{
  try {

      const {userId , roomName ,message} = req.body;
      const user = await User.findOne({_id:userId});

      await ChatRoom.updateOne({roomName} ,{$push:{messages:{user ,message}}})
      res.status(202).send('message added to room successfully');


    } catch (error) {
       
      res.status(404).send("error... in sending messages");
      console.log(error.message);
    }   
  }); 

router.post('/api/add_msg_to_singal_chat' ,async(req ,res) =>{
  
  try {
    
    const {sender_id ,receiver_id ,message} = req.body;
    const sender = await User.findOne({_id:sender_id});
    const receiver = await User.findOne({_id:receiver_id});
    const isChatExist = await  ChatRoom.findOne({$and:[{users:sender} ,{users:receiver}]});
    //console.log(isChatExist);
    
    
      
      await ChatRoom.updateOne({$and:[{users:sender} ,{users:receiver}]} ,{$push:{messages:{user:sender ,message}}});
      
      const chat = await ChatRoom.findOne({$and:[{users:sender} ,{users:receiver}]}).populate('users').populate('messages.user', 'name');
      res.status(200).send("message added successfully");

    
    

  } catch (error) {
    res.status(404).send("error in sending message");
  }
})

//delete message endpoint
router.post('/api/delete_message' ,async(req ,res)=>{
  try {
    const {sender_id ,receiver_id  ,index} = req.body;
    const sender = await User.findOne({_id:sender_id});
    const receiver = await User.findOne({_id:receiver_id});
    const findChat = await  ChatRoom.findOne({$and:[{users:sender} ,{users:receiver}]});
    
    const newChat = await findChat.deleteMessage(index);
    res.send("messages deleted");

  } catch (error) {
    res.send("error in deleting ")
  }
})

router.post('/api/getSingalChat' ,async(req ,res)=>{
  
  try {

    const {user_id ,receiver_id} = req.body;
    //console.log(req.body);
    const sender = await User.findOne({_id:user_id});
    
    const receiver = await User.findOne({_id:receiver_id});
    

    
    //console.log(chat);
    const isChatExist = await  ChatRoom.findOne({$and:[{users:sender} ,{users:receiver}]});

    if(isChatExist){
      const chat = await  ChatRoom.findOne({$and:[{users:sender} ,{users:receiver}]}).populate('users' ,'name').populate('messages.user' );
      
      res.status(200).send(chat);
    }else{
      const newChat = await new ChatRoom({
        roomName:"personalChat", 
        isGroupChat:false,
        users:[sender ,receiver]
        
      }) 
      
      await newChat.save();
      res.send(newChat);
    }

    
    
  } catch (error) {
    res.status(404).send("error in finding messages");
    
  }
})

module.exports = router;