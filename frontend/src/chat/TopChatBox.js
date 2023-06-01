import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useCallContext } from "../context/CallContext";
import { useSocketContext } from "../context/SocketContext";
import { useAppContext } from "../context/AppContext";
import RequestEngine from "../core/RequestEngine";
import {formatDistance} from 'date-fns'
import { AiOutlineArrowLeft } from "react-icons/ai";

const engine = new RequestEngine()

const customBTN = {
  background: "transparent",
    border: "transparent",
    fontSize: "20px",
    position: "relative",
    top: "5px",
    cursor : "pointer"
}

function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}

const TopChatBox = () => {
  const {openModal, join, localAudioTrack, localVideoTrack} = useCallContext()
  const { room, socket } = useSocketContext()
  const [isTyping, setTyping] = useState(false)
  const [isOnline, setisOnline] = useState(false)
  const [lastSeen, setLastSeen] = useState("")
  const {user,theme} = useAppContext()
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    socket.on("onusertyping", (data) => {
      if (data.userid !== user._id) {
        setTyping(true)
      }
    })
  }, [])

  useEffect(() => {
    getUserInfo()
  }, [])


  const getUserInfo = async () => {
    let userinfo = await engine.postItem("user", "/getinfo", {id :room.id})
    if (userinfo.data.data.isonline) {
    setisOnline(userinfo.data.data.isonline)
    } else {
    setLastSeen(userinfo.data.data.lastseen)
    }
  };

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        setTyping(false)
      },2000)
    }
  }, [isTyping])

  const handleUserStatus = () => {
    if (isTyping) {
      return "typing..."
    } else {
      if (isOnline) {
        return "Online"
      } else {
        return lastSeen && formatDistance(new Date(parseInt(lastSeen)), new Date(), {addSuffix:true})
      }
    }
  }


  const call = () => {
    openModal()      
    if (!localAudioTrack && !localVideoTrack) join(false)
  }

  const configureChatBox = () => {
    const mainContainer = document.querySelector(".main-container")
    const firstContainer = document.querySelector(".first-container")
    if (window.innerWidth>500) {
       if (firstContainer.style.zIndex !== "-1") {
        mainContainer.style.gridTemplateColumns = "0px 1fr"
        firstContainer.style.zIndex = -1
       } else {
        mainContainer.style.gridTemplateColumns = ""
        firstContainer.style.zIndex = 0
       }
       return
    }
    mainContainer.style.gridTemplateColumns = "1fr 0px"
    firstContainer.style.zIndex = 0
  }

  return (
    <div className={`${theme? 'top-container dark-vision' : 'top-container'}`}>
      <div className="top-left-container">
        <button style={customBTN} className="left-chat-arrow-button" onClick={configureChatBox}>
        <AiOutlineArrowLeft style={{ fill: "rgb(112,117,121)" }} />
      </button>
        <div className="top-room">
          <div className="top-room-image">
            <img src={`https://ui-avatars.com/api/?name=${room.username[0]}`} alt="yo" />
          </div>
          <div className="top-room-container">
            <p className="top-room-username">{room.username}</p>
            <p className="top-room-message">{handleUserStatus()}</p>
          </div>
        </div>
      </div>

      <div className={`${theme? 'top-right-container dark-vision' : 'top-right-container'}`}>
        <div>
          <button>
            <BsSearch />
          </button>
        </div>
        <div>
          <button onClick={call}>
            <FiPhoneCall />
          </button>
        </div>
        <div>
          <button>
            <BiDotsVerticalRounded />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopChatBox;

