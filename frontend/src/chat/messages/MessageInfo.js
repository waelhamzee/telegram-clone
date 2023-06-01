import React, { useEffect, useState } from "react";
import moment from 'moment'
import tickSVG from "../../assets/chatsvgs";
import { IoTimeOutline } from 'react-icons/io5'
import { BsCheck2, BsCheck2All } from 'react-icons/bs'
import { useAppContext } from "../../context/AppContext";

const btnStyles = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer'
}

const MessageInfo = ({createdAt, setisEditing, isEditing, setEditingMessages, text, _id, editingMessages, read, from}) => {
  const [flag, setFlag] = useState(false)
  const {user,theme} = useAppContext()

  useEffect(() => {
    if (window.navigator.onLine) {
      setFlag(true)
    }
  }, [])

  const editing = () => {
    if (isEditing) {
      const newE = editingMessages.filter(e => e._id !== _id)
      setisEditing(!isEditing)
      setEditingMessages(newE)
      return
    }
    setisEditing(!isEditing)
    setEditingMessages((prevEditingMessages) => {
      return [...prevEditingMessages, {text , _id}]
    })
  }

  const checkMessageState = () => {
    let addedTheme = theme?"dark-vision":""
    if (read) {
      return (
          <BsCheck2All className={`one-tick ${addedTheme}`}/>
      )
    } else {
      if (flag) {
        return  <BsCheck2 className={`one-tick ${addedTheme}`}/>
      } else {
        return <IoTimeOutline className={`timer ${addedTheme}`}/>
      }
    }
  }

  return (
     <button style={btnStyles} onClick={editing} className='message-info'>
          <div className="message-info">
        <div className={`${theme? "message-date dark-vision" : "message-date"}`}>{moment(createdAt).format("h:mm a")}</div>
        {/* {user._id === from && checkMessageState()} */}
      </div>
     </button>
  );
};

export default MessageInfo;
