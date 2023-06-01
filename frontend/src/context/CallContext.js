import React, { useContext, useEffect, useState, useReducer } from "react";
// import { socket } from "../core/socket";
import { useSocketContext } from "./SocketContext";
import { useAppContext } from "./AppContext";
import RequestEngine from "../core/RequestEngine";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Utilites } from "../utils/Utilities";
import { MdOutlineCallEnd, MdCall } from "react-icons/md";

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

let engine = new RequestEngine()

let options = {
  // Pass your App ID here.
  appId: "266cf064609e445583766553083ca1db",
  // Pass your App cert here.
  appcertificate : "ab0d86040289465699b36dd3537a7cbe",
  // Set the user ID.
  uid: null,
};

const CallContext = React.createContext();

export const CallProvider = ({ children }) => {
  const {user} = useAppContext()
  const {room, socket} = useSocketContext()
  const [isReceivingCall, setisReceivingCall] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState(undefined);

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState([]);

  async function createLocalTracks(audioConfig, videoConfig)
  {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);
    cameraTrack.setMuted(true)
    microphoneTrack.setMuted(true)
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  async function join(remote) {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks();
    const channelx = (room && room.room._id) || window.channel
    const response = await engine.postItem("agora", "/token",
    {channel: channelx, appId: options.appId, appcertificate : options.appcertificate, uid : options.uid})

    const token = response.data.data
    await client.join(options.appId, channelx, token, 0);
    await client.publish([microphoneTrack, cameraTrack]);
    if (!remote) socket.emit("Calling", {roomid : channelx, userid : user._id, username : room.username}, (data) => { console.log(data)});
    (window).client = client;
    (window).videoTrack = cameraTrack;
    setJoinState(true);
  }

  const leave = async() => {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    // if (!remoteUsers.length) {
    //   const roomid = localStorage.getItem("currentRoomID")
    //   let data = { text: "Missed Call", roomid };
    //   socket.emit("SendMessage", data, (m) => console.log(m));
    // }
    setRemoteUsers([]);
    setLocalVideoTrack(undefined)
    setLocalAudioTrack(undefined)
    setJoinState(false);
    closeModal()

    await client?.leave();
  }

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserUnpublished = (user) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserJoined = (user) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    const handleUserLeft = (user) => {
      console.log(client);
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);


  const openModal = () => {
  setIsOpen(true)
}

const closeModal = () => {
  setIsOpen(false)
}


useEffect(() => {
  socket.on("CallingReceived", (data) => {
    if (data.userid !== user._id) {
    (window).username = data.username
    window.channel = data.roomid
      const html = <div>
      <p>Wael is calling you.</p>
      <div style={{display:'flex', gap:'1rem', marginTop:'10px'}}>
      <div className="single-container">
          <button style={{ backgroundColor: " rgb(255, 89, 90)" }}>
          <MdOutlineCallEnd/>
          </button>
          <p>decline</p>
        </div>
        <div className="single-container">
          <button style={{background : "#5CC85E"}} onClick={() => {openModal(); join(true)}}> 
          <MdCall/>
          </button>
          <p>accept</p>
        </div>
      </div>
      </div>
      Utilites.showCall(html)
    }
  })
}, [])


  return (
    <CallContext.Provider
      value={{
        openModal, closeModal, modalIsOpen, client,
        localAudioTrack,
        localVideoTrack,
        joinState,
        leave,
        join,
        remoteUsers,
        isReceivingCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

const useCallContext = () => {
  return useContext(CallContext);
};

export {useCallContext}

