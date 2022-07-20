import React, { useEffect, useState } from "react";
import axios from "axios";
import dpImg from "../profile.jpeg";
import { ChatState } from "../Context/UserIdContext";


export default function Users({selectedChat ,users}) {

  const {user} = ChatState();


  return (
    <div className="users-box  p-4">
      <div className="row">
        <h4 className="text-center">
        <i className="fas  p-2 fa-comments"></i>
        My Chats</h4>
        <hr />
      </div>
      
      <div className="row all-users mt-3">
        {users.map((ele ,idx)=>{
          return (
            user._id===ele._id?(<p></p>):(<SingalUser name={ele.name} key={idx} imgSrc={ele.profilePic===""?dpImg:ele.profilePic} id={ele._id} selectedChat={selectedChat} email={ele.email}/>)
          )
        })}
      </div>
    </div>
  );
}

const SingalUser = ({name ,imgSrc ,id ,selectedChat ,email}) => {
  return (
    <>
      <div className="signal-user-box row mt-3 mx-auto py-1 shadow" onClick={()=>selectedChat(id ,name ,imgSrc ,email)}>
        <div className="col-3">
          <img src={imgSrc} alt="#" />
        </div>
        <div className="col ">
            <p className="my-2 ">{name}</p>
            
        </div>
      </div>
    </>
  ); 
};
