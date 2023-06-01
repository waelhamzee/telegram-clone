import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useSocketContext } from '../context/SocketContext'

const Room = ({room, getRooms}) => {
    const {fetchRoom} = useSocketContext()
    const {user} = useAppContext()

    const handleLastMessage = (lastMessage) => {
        if (lastMessage === null) return ""
        if (lastMessage.text) return lastMessage.text 
        return lastMessage.type.charAt(0).toUpperCase() + lastMessage.type.slice(1)
      }

    const getRoom = () => {
       fetchRoom(room)
       const mainContainer = document.querySelector(".main-container")
       const firstContainer = document.querySelector(".first-container")
       if (window.innerWidth<=500) {
        mainContainer.style.gridTemplateColumns = "0px 1fr"
        firstContainer.style.zIndex = -1
       } 
    }

    return (
        <div className="room" onClick={getRoom}>
                {!!room.unreadcount && (
                <div className="unread-count"><span>{room.unreadcount}</span></div>
                )}
                    <div className="room-image">
                  <img src={`https://ui-avatars.com/api/?name=${room.users.filter((element) => element._id !== user._id)[0].username[0]}`} 
                  alt={room.users.filter((element) => element._id !== user._id)[0].username}
                  />
                </div>
                <div className="room-container">
                  <p className="room-username">{room.users.filter((element) => element._id !== user._id)[0].username}</p>
                  <p className="room-message">{handleLastMessage(room.lastMessage)}</p>
                </div>
            </div>
    )
}

export default Room 