import React, { useEffect, useState } from "react";
import { GoThreeBars } from "react-icons/go";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { toggleDiv } from "../helpers/AnimationHelpers";
import { useSocketContext } from "../context/SocketContext";
import { useAppContext } from "../context/AppContext";
import { Utilites } from "../utils/Utilities";
import { FiSettings, FiRefreshCcw } from 'react-icons/fi'
import SearchContainer from "./SearchContainer";
import Settings from "./Settings";
import RequestEngine from "../core/RequestEngine";
import Room from "./Room";
import "../css/rooms.css";

const engine = new RequestEngine()
const types = ['chats', 'people', 'friendsrequests']

const Rooms = () => {
  const {user,theme} = useAppContext()
  const {room, socket} = useSocketContext()
  const [search, setSearch] = useState(false);
  const [users, setUsers] = useState([])
  const [active, setActive] = useState(types[0])
  const [rooms, setRooms] = useState([])

  const handleChange = async (e) => {
    let flag;
    if (active==='chats') flag = 'searchfriends'
    if (active==='people') flag = 'searchpeople'
    if (active==='friendsrequests') return
    
    if (e.target.value === "") {
      setUsers([]);
      return;
    }
    const response = await engine.postItem("user", "/search", {
      keyword : e.target.value, flag
    });
    if (response.data.data) {
      setUsers(response.data.data);
    }
  };

  useEffect(() => {
    socket.on("MessageReceived", (data) => {
      getRooms()
    });
  }, [])

  const getRooms = async () => {
    const response = await engine.getItem("room", "/list")
    console.log(response);
    if (response.status === 200) {
      for (let i = 0; i < response.data.data.length; i++) {
        const ROOM = response.data.data[i];
        if (ROOM.title !=='Demo') {
          const lastMessage = await engine.postItem("room", "/message/last", {roomid:ROOM._id});
          // const unreadcount = await engine.postItem("room", "/message/unread",
          //  {roomid : room._id, id: room.users.filter((element) => element._id !== user._id)[0]._id
          // })
          response.data.data[i].lastMessage = lastMessage.data.data
          // response.data.data[i].unreadcount = unreadcount.data.data.count
        }
      }
      setRooms(response.data.data)
    }
  }

  useEffect(() => { 
    socket.on("MessageReceivedGlobal", (data) => {
      console.log('hi');
      getRooms();
      if (data.from !== user._id && JSON.parse(localStorage.getItem("config")).notifications && localStorage.getItem("currentRoomID") !== data.room) {
        Utilites.showMessage(data.title, data.text)
      }
    })
  }, [])

  useEffect(() => {
    getRooms()
  }, [])

  const addAnimation = () => {
    const el = document.getElementById("S*")
    const el2 = document.getElementById("X*")
    el.className = "show-sidebar"
    el2.className = "show-sidebar"
  }
  
  return (
    <div className={`${theme? 'first-container dark-theme' : 'first-container'}`}>
     <div id="S*">
      <div className="container">
        {!search ? (
          <div style={{display:'flex'}}>
            <button style={{marginRight:'0'}} onClick={addAnimation}>
              <FiSettings />
            </button>
            <button onClick={getRooms}>
              <FiRefreshCcw />
            </button>
          </div>
        ) : (
          <button onClick={(e) => {setSearch(false); setUsers([]); document.getElementById('search').value=''}}>
            <AiOutlineArrowLeft style={{ fill: "rgb(112,117,121)" }} />
          </button>
        )}
        <div className={!search? 'search-container' : 'search-container focus-search-container'}>
          <BsSearch className={search? "focus-svg" : null}/>
          <input
            type="text"
            id="search"
            placeholder="Search"
            onFocus={(e) => setSearch(true)}
            onChange={handleChange}
            autoComplete={"off"}
          />
        </div>
      </div>
      {!search ? (
        <div className="rooms-container">
          {rooms.map((room,index) => {
            return (
              <Room room={room} key={index} getRooms={getRooms}/>
            )
          })}
        </div>
      ) : (
        <SearchContainer setUsers={setUsers} users={users} active={active} setActive={setActive} />
      )}
      </div>
      <Settings />
    </div>
  );
};

export default Rooms;
