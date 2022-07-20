import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/UserIdContext";


export default function GroupChat() {
  const [displyCreateBox, setdisplyCreateBox] = useState("none");
  const [displyJoinBox, setdisplyJoinBox] = useState("none");
 const [rooms, setrooms] = useState([])
 const {user} = ChatState();
  

 useEffect(async() => {
   try {
     const {data} = await axios.post("/api/getrooms" ,{
       userId:user._id
     })
   } catch (error) {
     window.alert("error in getiing rooms");
   }
 }, [])

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="users-box col-3 p-4">
            <div
              className="create-room-box mt-1"
              onClick={() => {
                displyCreateBox === "none"
                  ? setdisplyCreateBox("inline-block")
                  : setdisplyCreateBox("none");
              }}
            >
              <h5 className="text-center text-white">+ Create room</h5>
            </div>
            <div
              className="create-room-box my-2"
              onClick={() => {
                displyCreateBox === "none"
                  ? setdisplyJoinBox("inline-block")
                  : setdisplyJoinBox("none");
              }}
            >
              <h5 className="text-center text-white">+ Join room</h5>
            </div>
            <h4 className="text-center mt-2">
              <i className="fas  p-2 fa-comments"></i>
              My Rooms
            </h4>
            <hr />
              {
                rooms.map((ele)=>{
                  return(
                    <div className="room-card p-1 m-1">
                      <h4 className="text-center">{ele.roomName}</h4>
                    </div>
                  )
                })
              }
          </div>
        </div>
      </div>
      <CreateInputBox
        displyCreateBox={displyCreateBox}
        setdisplyCreateBox={setdisplyCreateBox}
      />
      <JoinInputBox
        displyJoinBox={displyJoinBox}
        setdisplyJoinBox={setdisplyJoinBox}
      />
    </div>
  );
}

const JoinInputBox = ({ displyJoinBox, setdisplyJoinBox }) => {
  const {user} = ChatState();
  const [roomInfo, setroomInfo] = useState({
    userId:user._id,roomName:""
  })

  const handleJoinRoom = async()=>{
    try {
      const {userId ,roomName} = roomInfo;
      const res = await axios.post("/api/joinroom" ,{
        userId ,roomName
      })

      if(res){

      }
    } catch (error) {
      window.alert("the room you entered does not exist ");
    }
  };

  return (
    <div>
      <div className={`input-area row d-${displyJoinBox} p-1`}>
        <div className="form-group input-room-box col-4 ">
          <label htmlFor="name">*name</label>

          <input
            type="text"
            className="form-control"
            placeholder=" Enter Room name to Join"
            name="name"
            value={roomInfo.roomName}
            onChange={(e)=>{
              setroomInfo({...roomInfo ,roomName:e.target.value})
            }}
            id="name"
          />

          <div className="row mt-4 p-3">
            <button className="btn btn-primary col-4" onClick={handleJoinRoom}>Join</button>
            <button
              className="btn btn-danger  col-4 offset-4"
              onClick={() => setdisplyJoinBox("none")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateInputBox = ({ displyCreateBox, setdisplyCreateBox }) => {
  return (
    <>
      <div className={`input-area row d-${displyCreateBox} p-1`}>
        <div className="form-group input-room-box col-4 ">
          <label htmlFor="name">*name</label>

          <input
            type="text"
            className="form-control"
            placeholder=" Enter Room name to create"
            name="name"
            id="name"
          />

          <div className="row mt-4 p-3">
            <button className="btn btn-primary col-4">Create</button>
            <button
              className="btn btn-danger  col-4 offset-4"
              onClick={() => setdisplyCreateBox("none")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
