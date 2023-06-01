import React, { useEffect } from "react";
import TopChatBox from "./TopChatBox";
import BottomChatBox from "./BottomChatBox";
import { useSocketContext } from "../context/SocketContext";

const ChatBox = () => {
  const { room } = useSocketContext();

  return (
    <div className="chatbox-container">
      {room && (
        <React.Fragment>
          <TopChatBox />
          <BottomChatBox />
        </React.Fragment>
       )} 
    </div>
  );
};

export default ChatBox;
