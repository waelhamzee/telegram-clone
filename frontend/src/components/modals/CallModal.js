import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import AgoraRTC from 'agora-rtc-sdk-ng'
import RequestEngine from "../../core/RequestEngine";
import MediaPlayer from '../../call/MediaPlayer'
import { useCallContext } from "../../context/CallContext";
import { MdOutlineCallEnd, MdCall } from "react-icons/md";
import InCall from "../../call/InCall";
import { useAppContext } from "../../context/AppContext";
import { useSocketContext } from "../../context/SocketContext";
import "../../css/modal.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "35rem",
    overflow: "overlay",
    height: "450px",
    background: "linear-gradient(#badcbc, rgb(111, 213, 206))",
    border: "none",
  },
};

let engine = new RequestEngine()

let options = {
  // Pass your App ID here.
  appId: "266cf064609e445583766553083ca1db",
  // Pass your App cert here.
  appcertificate : "ab0d86040289465699b36dd3537a7cbe",
  // Set the user ID.
  uid: null,
};

const CallModal = () => {
  const {modalIsOpen, closeModal, client} = useCallContext()
  const {localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers, isReceivingCall} = useCallContext();
  
  
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      {joinState? (
        <InCall/>
      ): (
        <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
             <p style={{color :'white'}}>Joining call...</p>
        </div>
      )}
        {/* {!isReceivingCall? (
      <InCall mute={mute} setMute={setMute} video={video} setVideo={setVideo} animation={false}/>
    ): (
      localVideoTrack===undefined? (
        <React.Fragment>
      <div className="call-info">
          <p>Telegram</p>
          <p>calling up...</p>
      </div>
      <div className="call-flex">
      <div className="bottom-call">
        <div className="single-container">
          <button style={{ backgroundColor: " rgb(255, 89, 90)" }}>
          <MdOutlineCallEnd/>
          </button>
          <p>decline</p>
        </div>
        <div className="single-container">
          <button style={{background : "#5CC85E"}} onClick={() => join(false)}> 
          <MdCall/>
          </button>
          <p>accept</p>
        </div>
      </div> 
      </div> 
      </React.Fragment>
      ) : (
        <InCall mute={mute} setMute={setMute} video={video} setVideo={setVideo} animation={true}/>
      )

    )} */}

    </Modal>
  );
};

export default CallModal;


// {!isReceivingCall? (
//   <InCall mute={mute} setMute={setMute} video={video} setVideo={setVideo} animation={false}/>
// ): (
//   localStream===undefined? (
//     <React.Fragment>
//   <div className="call-info">
//        <p>Telegram</p>
//        <p>calling up...</p>
//    </div>
//    <div className="call-flex">
//    <div className="bottom-call">
//      <div className="single-container">
//       <button style={{ backgroundColor: " rgb(255, 89, 90)" }}>
//       <MdOutlineCallEnd/>
//       </button>
//        <p>decline</p>
//      </div>
//      <div className="single-container">
//       <button style={{background : "#5CC85E"}} onClick={() => join(false)}> {/* maybe shouldn't join in here */}
//       <MdCall/>
//       </button>
//        <p>accept</p>
//      </div>
//    </div> 
//    </div> 
//    </React.Fragment>
//    ) : (
//     <InCall mute={mute} setMute={setMute} video={video} setVideo={setVideo} animation={true}/>
//    )

// )}

