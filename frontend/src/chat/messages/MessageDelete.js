import React from "react";
import {MdContentCopy} from 'react-icons/md'
import {AiOutlineDelete} from 'react-icons/ai'

const firstFlex = {
  padding: "5px",
  display: "flex",
  justifyContent: "space-between",
  padding: "5px",
  background: "white",
  borderRadius: "10px",
  borderBottomRightRadius: "0",
  paddingLeft: "20px",
  paddingRight: "20px",
  alignItems: "center",
};

const secondFlex = {
  display: "flex",
  gap: "2rem",
  alignItems: "center",
};

const thirdFlex = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
};

const btnStyle = {
  background: "transparent",
  border: "none",
  padding: "0.2rem",
  fontSize: "2rem",
  position: "relative",
  bottom: "2px",
  color: "rgb(112,117,121)",
  cursor : "pointer"
};

const MessageDelete = ({setEditingMessages, editingMessages, setAlert}) => {

  const copyContent = () => {
    setAlert(true)
    let fullContent = ""
    editingMessages.map((message) => {
      fullContent += message.text 
      fullContent += '\n'
    })
    navigator.clipboard.writeText(fullContent);
    setEditingMessages([])
  }

  const deleteMessage = () => {

  }

  return (
    <div className="bottom-bottom-container animate-message-delete">
      <div className="input-container">
        <div className="global">
          <div style={firstFlex}>
            <div style={secondFlex}>
              <button style={btnStyle} onClick={() => setEditingMessages([])}>&times;</button>
              <p style={{fontWeight:'500'}}>{editingMessages.length} Message{editingMessages.length>1? 's' : null} Selected</p>
            </div>
            <div style={thirdFlex}>
              <div style={{fontSize:'1.3rem', color : "grey", cursor:'pointer'}}><MdContentCopy onClick={copyContent}/></div>
              <div style={{fontSize:'1.5rem', color : "#e53935", cursor:'pointer'}}><AiOutlineDelete onClick={deleteMessage}/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDelete;
