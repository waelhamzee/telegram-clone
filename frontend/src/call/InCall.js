import React, { useEffect, useState } from 'react'
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { MdOutlineCallEnd } from "react-icons/md";
import {IoCloseOutline} from 'react-icons/io5'
import { useCallContext } from '../context/CallContext';
import MediaPlayer from './MediaPlayer'
import Timer from './Timer'

const InCall = () => {
    const {localVideoTrack, localAudioTrack, closeModal ,loader,  leave, remoteUsers} = useCallContext()
    const [mute, setMute] = useState(true)
    const [video, setVideo] = useState(true)

    if (loader) {
       return (
        <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
        <p style={{color :'white'}}>Joining call...</p>
      </div>
       )
    } else {
    return (
        <React.Fragment>
          <div className="me"><MediaPlayer videoTrack={localVideoTrack} audioTrack={localAudioTrack}></MediaPlayer></div>
       {remoteUsers.map(user => (<div className='remoteuser' key={user.uid}>
             <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
           </div>))}
        <IoCloseOutline className="close-call" onClick={closeModal}/>
        <p className="style-w">W</p>
        <div className="call-info">
            <p>Telegram</p>
            {/* <p>Users Joined : You, Me</p> */}
            {/* <Timer/> */}
            {/* <p>Calling up</p> */}
        </div>
        <div className="call-flex">
        <div className="bottom-call">
          <div className="single-container">
           {mute? (
                <button onClick={() => {
                  localAudioTrack.setMuted(false);
                    setMute(false);
                  }}>
              <BiMicrophoneOff />
            </button>
           ) : (
            <button onClick={() => {
              localAudioTrack.setMuted(true);
                setMute(true);
              }}>
          <BiMicrophone />
        </button>
           )}
            <p>{mute? 'unmute' : 'mute'}</p>
          </div>
          <div className="single-container">
            {video? (
              <React.Fragment>
                <button onClick={() => {
                  document.querySelector('.me').style.opacity = 1
                    localVideoTrack.setMuted(false);
                    setVideo(false)}}>
                <BsCameraVideoOff/>
              </button>
              <p>unmute</p>
              </React.Fragment>
            ): (
              <React.Fragment>
                <button  onClick={() => {
                  document.querySelector('.me').style.opacity = 0
                    localVideoTrack.setMuted(true)
                    setVideo(true)}}>
              <BsCameraVideo/>
            </button>
            <p>mute</p>
            </React.Fragment>
            )}
          </div>
          <div className="single-container">
            <button onClick={leave} style={{ backgroundColor: " rgb(255, 89, 90)" }}>
              <MdOutlineCallEnd />
            </button>
            <p>end call</p>
          </div>
        </div> 
        </div>
        </React.Fragment>
    )
   }
}

export default InCall