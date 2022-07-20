const jwt = require('jsonwebtoken');
const User = require('../database/models/UserModel');


const Authenticate = async (req ,res ,next)=>{

    try {
        
       // console.log(req.cookies);
        const token = req.cookies.chatapptoken;
       
        const verifyToken = jwt.verify(token ,process.env.JWT_SECRET_KEY);

        const rootUser = await User.findOne({_id:verifyToken._id  }); 
      
        if(!rootUser){ 
            throw new Error("authentication problem .....");
        }
        
        req.rootUser = rootUser;
        req.token = token;

        next();


    } catch (error) {
        console.log(error);
        res.status(401).send("error to authenticate...");
    }
}

module.exports = Authenticate;