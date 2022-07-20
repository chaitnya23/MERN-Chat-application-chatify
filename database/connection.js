const mongoose = require('mongoose');
const connection = mongoose.connection;

//database connection 
//const uri = "mongodb+srv://chaitnya_giri:chaitnya2306@mycluster.osnnc.mongodb.net/database1?retryWrites=true&w=majority"

mongoose.connect(process.env.DATABASE_URI ,{ 
    useNewUrlParser:true,
    useUnifiedTopology:true 
}).then(()=>{
    console.log("connection successfull!!");
}).catch((e)=>{
    console.log(e.message ,"error in connecting ");
});
connection.once("open" ,()=>{
    console.log("connected to database succesfully"); 
});
 