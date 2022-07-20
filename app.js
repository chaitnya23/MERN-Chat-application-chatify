const express = require('express');
const app = express();
const router  = require('./router');
const cookieParser  = require('cookie-parser');
const path = require('path');

//initialisign env file
const dotenv = require('dotenv');
dotenv.config(); 
 
//database connection
require('./database/connection');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}))

//using router for routing 
app.use(router);

// --------------Deployement--------------------------------

const _dirname1 = path.resolve();
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname1 ,"/frontend/build")));

    app.get("*" ,(req ,res)=>{

        res.sendFile(path.resolve(_dirname1 ,"frontend" ,"build" ,"index.html"));
    })
}else{
    app.get("/", (req, res) => {
        res.send("hello chaitu");
      });
}

// --------------Deployement--------------------------------

 

//creating an express server
const port = process.env.PORT || 4000;


const server = app.listen(port ,()=>{
    console.log(`listning at port ${port}`);
})

//creating a socket-io server at same port
const io = require('socket.io')(server ,{

    cors:{
        origin:'*'
    }
});
 
io.on('connection' ,socket =>{

    
    socket.on('send-msg' ,({sender ,receiver ,message})=>{

      
        socket.broadcast.emit('receive-msg' ,{sender ,receiver,message});

    })

    socket.on("typing" ,({sender ,receiver})=>{

        socket.broadcast.emit("show-typing" ,{sender ,receiver});
    })
    socket.on("stop-typing" ,({sender ,receiver})=>{

        socket.broadcast.emit("hide-typing" ,{sender ,receiver});
    })
})

