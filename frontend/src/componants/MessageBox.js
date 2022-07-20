import React, { useEffect, useState } from "react";
import dpImg from "../profile.jpeg";
import axios from "axios";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../Logics";
import Profile from "./Profile";
import Logo from "../chatAppLogo.png";

export default function MessageBox({
  user,
  receiver,
  Messages,
  handleUsersSidebar,
  deleteMsg,
}) {
  const [isSelected, setisSelected] = useState(false);
  const [handleSidebarArrow, sethandleSidebarArrow] = useState("right");
  const [showDp, setshowDp] = useState("none");

  useEffect(() => {
    if (Messages === undefined) {
      setisSelected(false);
    } else {
      setisSelected(true);
    }
  }, []);

  const showReceiverProfile = () => {
    setshowDp("inline-block");
  };
  const exitProfile = () => {
    setshowDp("none");
  };

  return (
    <div>
      <Profile
        showDp={showDp}
        exitProfile={exitProfile}
        name={receiver.name}
        email={receiver.email}
        imgSrc={receiver.profilePic}
      />
      <div className="message-box container p-3">
        <div className="row receiver-info mb-1">
          <div className="col-md-1">
            <button
              className="btn "
              onClick={() => {
                handleUsersSidebar();
                if (handleSidebarArrow === "left") {
                  sethandleSidebarArrow("right");
                } else {
                  sethandleSidebarArrow("left");
                }
              }}
            >
              <i className={`fas fa-arrow-${handleSidebarArrow}`}></i>
            </button>
          </div>
          <div className="col-2">
            <img
              src={receiver.profilePic === "" ? dpImg : receiver.profilePic}
              alt=""
              onClick={showReceiverProfile}
            />
          </div>
          <div className="col">
            <h5>{receiver.name}</h5>
          </div>
        </div>
        {isSelected !== {} ? (
          <div className="  messages-container ">
            {Messages.length === 0 ? (
              <div className="LogoBox container-fluid m-0 ">
                <img src={Logo} alt="#" />
              </div>
            ) : (
              <div></div>
            )}

            <ScrollableFeed>
              {Messages.map((ele, idx) => {
                return (
                  <Message
                    msg={ele.message}
                    float={ele.user.name === user.name ? "end" : "start"}
                    key={idx}
                    color={ele.user.name === user.name ? "#BEE3F8" : "#B9F5D0"}
                    imgShow={
                      isSameSender(Messages, ele, idx, user._id)||isLastMessage(Messages ,idx,user._id)
                        ? "inline-block"
                        : "none"
                    }
                    imgSrc={ele.user.profilePic}
                    deleteMsg={deleteMsg}
                  />
                );
              })}
            </ScrollableFeed>
          </div>
        ) : (
          <div className=" "></div>
        )}
      </div>
    </div>
  );
}

const Message = ({ msg, float, color, imgShow, imgSrc, deleteMsg }) => {
  const open_delete_tool = () => {};
  return (
    <>
      <div className={` d-flex justify-content-${float}  msg-content `}>
        <div className="img-box">
          <img className={`d-${imgShow}`} src={imgSrc} alt="#" />
        </div>
     
        
          <span
            className=" mx-2 my-1 msg"
            style={{ backgroundColor: color }}
            onClick={open_delete_tool}
          >
            {msg}
          </span>
         
      
      </div>
    </>
  );
};
