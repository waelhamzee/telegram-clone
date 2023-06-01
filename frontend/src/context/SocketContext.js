import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Constants from "../core/Constants";
import RequestEngine from "../core/RequestEngine";
import { useAppContext } from "./AppContext";
// import { socket } from "../core/socket";

let token = localStorage.getItem('token');

const SocketContext = React.createContext();
const engine = new RequestEngine()

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(io(Constants.serverlink, {query: 'token='+token,'reconnection':true}))
    // const {user} = useAppContext()
    const [room, setRoom] = useState()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

    const fetchRoom = (ROOM) => {
      const roomid = localStorage.getItem("currentRoomID")
      if (roomid === ROOM.id && room) return // look more into this
      setRoom(
        {
          room : ROOM,
          username : ROOM.users.filter((element) => element._id !== user._id)[0].username,
          id : ROOM.users.filter((element) => element._id !== user._id)[0]._id
        }
        )
        localStorage.setItem("currentRoomID", ROOM.id)
    }

    useEffect(() => {
        socket.on("connect", () => {
            console.log("you are connected");
        })
        socket.on("reconnect", () => {
            console.log("you are reconnected");
        })
        socket.on("disconnect", () => {
            console.log("you are disconnected");
        })
        socket.io.on("reconnect_attempt", () => {
            console.log('reconnect_attempt');
          });
    },[])


  return (
    <SocketContext.Provider
      value={{
         socket, fetchRoom, room
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};
