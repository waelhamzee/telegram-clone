import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import MessageInfo from "./MessageInfo";

const TextMessage = ({ from, text, createdAt, setEditingMessages, _id, editingMessages, read }) => {
  const { user, theme } = useAppContext();
  const [isEditing, setisEditing] = useState(false);

  useEffect(() => {
    if (!editingMessages.length) {
      setisEditing(false)
    }
  }, [editingMessages])

  const demo = () => {
      if (isEditing) {
        const newE = editingMessages.filter(e => e._id !== _id)
        setisEditing(false)
        setEditingMessages(newE)
        return
      }
  };

  return (
    <div className={user._id === from ? "message-container" : "message-container incoming"} onClick={demo}>
      {isEditing && (
        <React.Fragment>
          <div className="message-container-background"></div>
        </React.Fragment>
      )}
      <div
        className={user._id === from ? `${theme? "message-XY dark-vision" : "message-XY" }` : "message-XY incoming-XY"}
      >
        <div className="message">{text}</div>
        <MessageInfo
          createdAt={createdAt}
          from={from}
          read={read}
          isEditing={isEditing}
          setisEditing={setisEditing}
          setEditingMessages={setEditingMessages}
          editingMessages={editingMessages}
          text={text}
          _id={_id}
        />
      </div>
    </div>
  );
};

export default TextMessage;
