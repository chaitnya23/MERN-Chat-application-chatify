export const isSameSender = (messages ,m,i,userId)=>{

    
        if(i<messages.length-1 && (messages[i+1].user._id!==m.user._id || messages[i+1]===undefined) &&
        messages[i].user._id!==userId){
            return true;
        }else{
            return false;
        }
    
}

export const isLastMessage = (messages ,i ,userId )=>{

   if(i===messages.length-1&&messages[i].user._id!==userId){
       return true;
   }else{
       return false; 
   }

}