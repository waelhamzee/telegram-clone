import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useCallContext } from "../context/CallContext";
import { useSocketContext } from "../context/SocketContext";
import ChatBox from "./ChatBox";
import Rooms from "./Rooms";

function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}


const FullContainer = () => {
    const [windowSize, setWindowSize] = useState(getWindowSize());
    const {localAudioTrack, localVideoTrack, modalIsOpen, openModal} = useCallContext()
    const {theme} = useAppContext()
    const {room} = useSocketContext()
    useEffect(() => {
      function handleWindowResize() {
        setWindowSize(getWindowSize());
      }
  
      window.addEventListener('resize', handleWindowResize);
  
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }, []);
    useEffect(() => {
      const mainContainer = document.querySelector(".main-container")
      if (windowSize.innerWidth > 500 && mainContainer.style.gridTemplateColumns === "1fr 0px") {
        mainContainer.style.gridTemplateColumns = ""
      }
    }, [windowSize])

  return (
    <div className={`${theme? 'wrapper dark-mode' : 'wrapper'}`}>
      <div></div>
      {((localAudioTrack || localVideoTrack)!==undefined && !modalIsOpen)? (<div onClick={openModal} className='call-toggle'>{(room && room.username) || "Return to call"}</div>) : null}
      <div className="main-container">
        <Rooms />
        <ChatBox />
      </div>
    </div>
  );
};

export default FullContainer;
