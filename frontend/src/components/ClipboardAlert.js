import React, { useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

const customStyles = {
  position: "absolute",
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  background: "rgba(32,32,32,.7)",
  padding: "0.7rem",
  borderRadius: "10px",
  color: "white",
  top: "5%",
  paddingRight: "10rem",
  paddingLeft: "1.5rem",
  left: '2%',
};

const customStyles2 = {
  display: "flex",
  alignItems: "center",
  fontSize: "1.5rem",
};

const ClipboardAlert = ({setAlert}) => {

  useEffect(() => {
    setTimeout(() => {
      setAlert(false)
    }, 3000)
  }, [])

  return (
    <div style={customStyles} className='animate-alert'>
      <div style={customStyles2}>
        <AiOutlineInfoCircle />
      </div>
      <p style={{fontWeight:'500', fontSize: ".9rem"}}>Copied to Clipboard</p>
    </div>
  );
};

export default ClipboardAlert;
