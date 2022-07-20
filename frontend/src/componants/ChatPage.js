import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import dpImg from "../profile.jpeg";
import axios from "axios";
import Profile from "./Profile";
import Users from "./Users";
import MessageBox from "./MessageBox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { ChatState } from "../Context/UserIdContext";
import Logo from "../chatAppLogo.png";
import { BeatLoader } from "react-spinners";

const socket = io.connect("https://mern-app-chatify.herokuapp.com/");
// const socket = io.connect("http://localhost:4000");



function ChatPage() {
  const history = useHistory();

  const { user } = ChatState();

  const [isTyping, setisTyping] = useState(false);

  useEffect(() => {
    socket.on("receive-msg", (payload) => {
      if (payload.receiver._id === user._id) {
        setMessages([
          ...Messages,
          { user: payload.sender, message: payload.message },
        ]);
      }
    });

    socket.on("show-typing", (payload) => {
      if (payload.receiver._id === user._id) {
        setisTyping(true);
      }
    });

    socket.on("hide-typing", (payload) => {
      if (payload.receiver._id === user._id) {
        setisTyping(false);
      }
    });
  });
  //states
  const [dpInfo, setdpInfo] = useState("none");
  //const [user, setuser] = useState({});
  const [isSelected, setisSelected] = useState(false);
  const [selectedUser, setselectedUser] = useState({});
  const [showDp, setshowDp] = useState("none");
  const [msg, setmsg] = useState("");
  const [Messages, setMessages] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [sidebarShow, setsidebarShow] = useState("0");
  const [presentChatData, setpresentChatData] = useState({});
  //all users
  const [users, setusers] = useState([]);

  const profileClickHandler = () => {
    setdpInfo("inline-block");
  };

  //useeffect to feach all users
  useEffect(async () => {
    //const all_users = get_allUsers();
    const { data } = await axios.get("/api/getUsers");
    setusers(data);
  }, []);

  //logout function
  const logoutUser = async () => {
    try {
      // const res = await axios.get("/api/logout");
      localStorage.removeItem("userInfo");
      history.push("/auth");
      //if (res) {
      //  console.log(res);
      // history.push("/auth");
      // }
    } catch (error) {
      console.log("error in logging out");
    }
  };

  //useeffect to featch chats
  useEffect(async () => {
    if (selectedUser !== {}) {
      // const chats = featchChats(user ,selectedUser);
      setLoading(true);
      const { data } = await axios.post("/api/getSingalChat", {
        user_id: user._id,
        receiver_id: selectedUser._id,
      });
      if (data) {
        setMessages(data.messages);
        setLoading(false);
      }
    }
  }, [selectedUser]);

  const exitProfile = () => {
    setshowDp("none");
  };

  const selectedChat = (id, name, imgSrc, email) => {
    // console.log(id ,name);
    setisSelected(true)
    setselectedUser({
      _id: id,
      name: name,
      email: email,
      profilePic: imgSrc,
    });
  };

  //fuction to send msg
  const sendmsg = async () => {
    try {
      socket.emit("send-msg", {
        sender: user,
        receiver: selectedUser,
        message: msg,
      });

      setMessages([...Messages, { user, message: msg }]);
      setmsg("");

      const { data } = await axios.post("/api/add_msg_to_singal_chat", {
        sender_id: user._id,
        receiver_id: selectedUser._id,
        message: msg,
      });

      console.log("message sent successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUsersSidebar = () => {
    if (sidebarShow === "0") {
      setsidebarShow("3");
    } else {
      setsidebarShow("0");
    }
  };

  const deleteMsg = async (idx) => {
    setMessages(
      Messages.filter((ele, index) => {
        return idx !== index;
      })
    );
    try {
      await axios.post("/api/delete_message", {
        sender_id: user._id,
        receiver_id: selectedUser._id,
        index: idx,
      });
    } catch (error) {
      console.log("error in deleting messages", error.message);
    }
  };

  console.log(selectedUser !== {});
  return (
    <>
      <Profile
        showDp={showDp}
        exitProfile={exitProfile}
        name={user.name ? user.name : ""}
        email={user.email ? user.email : ""}
        imgSrc={user.profilePic ? user.profilePic : ""}
      />
      <div className="container-fluid">
        <div className="row header">
          <div className=" col-5 ">
            <h3 className="main-title ">
              {" "}
              <span style={{ color: "#BEE3F8" }}>Chat</span>-
              <span style={{ color: "#B9F5D0" }}>ify</span>{" "}
            </h3>
          </div>
        
            <div className="col-4 user-info-top align-self-center m-0 p-0 d-flex">
              <img
                src={user.profilePic === "" ? dpImg : user.profilePic}
                className="mt-1"
                alt=""
                onClick={profileClickHandler}
              />
              <h6 className="top-name">{user.name}</h6>
            </div>
     

          <div className={`dp-click my-1 d-${dpInfo} `}>
            <div className="row  justify-content-end">
              <div
                className="btn cancel-dp-info"
                onClick={() => setdpInfo("none")}
              >
                X
              </div>
            </div>
            <div className="row my-1 px-2">
              <button className="btn btn-danger " onClick={logoutUser}>
                Logout
              </button>
            </div>
            <div className="row my-2 px-2">
              <button
                className="btn btn-primary "
                onClick={() => setshowDp("inline-block")}
              >
                View profile
              </button>
            </div>
          </div>


        </div>
      </div>

      <div className="chatbox container-fluid mt-3">
        <div className="row">
          <div className="col main-message-box">
            {Loading ? (
              <div className="loading-box message-box container d-flex justify-content-center align-items-center">
                <BeatLoader loading={Loading} size={70} color="#6bacf7f3" />
              </div>
            ) : (
              <MessageBox
                user={user}
                receiver={selectedUser}
                Messages={Messages}
                handleUsersSidebar={handleUsersSidebar}
                deleteMsg={deleteMsg}
              />
            )}

            {isSelected ? (
              <div className="row input-msg-box mb-2 p-1">
                <div className="form-group col-9">
                  <input
                    className="form-control"
                    type="text"
                    value={msg}
                    onChange={(e) => {
                      setmsg(e.target.value);
                    }}
                    onKeyUp={() => console.log("left key")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendmsg();
                      }
                    }}
                  />
                </div>
                <div className="col">
                  <button className="msg-btn btn btn-primary" onClick={sendmsg}>
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <span></span>
            )}
          </div>
          <div className={`col-sm-${sidebarShow} `}>
            <Users selectedChat={selectedChat} users={users ? users : []} />
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
export default ChatPage;
