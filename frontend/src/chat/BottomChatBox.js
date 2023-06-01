import React, { useEffect, useRef, useState } from "react";
import { RiAttachment2 } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import { MdOutlineEmojiEmotions, MdOutlineKeyboardVoice, MdOutlineDelete } from "react-icons/md";
import { toggleDiv } from "../helpers/AnimationHelpers";
import { useSocketContext } from "../context/SocketContext";
import { getFileBase64 } from "../utils/savebase64";
import { scrollToBottom } from "../utils/scroll-to-bottom";
import ImageFileUpload from "../components/ImageFileUpload";
import Message from "./messages/Message";
import MessageDelete from "./messages/MessageDelete";
import ClipboardAlert from "../components/ClipboardAlert";
import useRecorder from "./recorder/hooks/useRecorder";
import Recorder from "./recorder/Recorder";
import ImageModal from "../components/modals/ImageModal";
import FileModal from "../components/modals/FileModal";
import RequestEngine from "../core/RequestEngine";
import Loader from "react-spinners/RingLoader";
import "../css/chatbox.css";
import { useAppContext } from "../context/AppContext";

const engine = new RequestEngine()

const BottomChatBox = () => {
  const { socket, room } = useSocketContext();
  const {user,theme} = useAppContext()
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [modalIsOpen2, setmodalIsOpen2] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loader, setLoader] = useState(false)
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingMessages, setEditingMessages] = useState([]);
  const [showAlert, setAlert] = useState(false);
  const [counter, setCounter] = useState(20)
  const { recorderState, startRecording, cancelRecording, saveRecording, setRecorderState, initialState } = useRecorder();
  let messagesContainer = useRef(null);

  if (images.length) {
    if (!modalIsOpen) {
      setmodalIsOpen(true);
    }
  }

  if (files.length) {
    if (!modalIsOpen2) {
      setmodalIsOpen2(true);
    }
  }

  const closeModal = () => {
    setImages([]);
    setmodalIsOpen(false);
  };

  const closeModal2 = () => {
    setFiles([]);
    setmodalIsOpen2(false);
  };

  const fetchMessages = async (counter) => {
    // setLoader(true)
    const response = await engine.postItem("room", "/messages", {
      roomid: room.room._id,
      counter: counter,
    });
    if (response && response.status === 200) {
     setMessages(response.data.data)
    //  setLoader(false)
    }
  };

  // useEffect(() => {
  //   socket.emit("SendRead", {roomid : room.room._id, from : room.id})
  // }, [room])

  useEffect(() => {
    if (messages.length > 20) {
     if (messagesContainer.current && messagesContainer.current.children.length) {

      let childrenCount = messagesContainer.current.childElementCount
      if (childrenCount%10!=0) childrenCount = childrenCount%10
      else childrenCount = 10

      let height = 0
      for (let i = 0; i<childrenCount; i++) {
         height += messagesContainer.current.children[i].getBoundingClientRect().height
      }
      
      if (!height) return 
      messagesContainer.current.scrollTop = height
    }
  }
  }, [messages]);
  
  useEffect(() => {
    if ((messagesContainer.current && messages.length && !isNaN(messages[messages.length - 1].createdAt))
    || (messages.length && messages.length <=20)) {
    //  messagesContainer.current.style.scrollBehavior = 'smooth' 
      scrollToBottom(messagesContainer)
    }
  }, [messages]);


  useEffect(() => {
   fetchMessages(counter)
  }, [counter, room]);


  useEffect(() => {
    if (messagesContainer.current) messagesContainer.current.style.maxHeight = `${messagesContainer.current.getBoundingClientRect().height}px`;
  }, []);

  
  useEffect(() => {
    socket.emit("join", room.room._id);
  }, [room]);

  useEffect(() => {
    socket.on("MessageReceived", (data) => {
        setMessages((prevState) => {
          // if (data.from !== user._id) data.received = true
          return [...prevState, data];
        });
      });
      return () => socket.off("MessageReceived")
    }, [socket,room]);

  // useEffect(() => {
  //   if ( messages.length && messages[messages.length - 1].from === user._id) return 
  //   if (!messages.find(message => message.read === false || message.read === undefined)) return
  //   socket.emit("SendRead", {roomid : room.room._id, from : room.id})
  // }, [messages])

  // useEffect(() => {
  //   socket.on("MessageRead", (data) => {
  //     // setMessages((prevState) => {
  //     //   prevState.map((e) => e.read = true)
  //     //   return [...prevState]
  //     // });
  //   }) 
  // }, [])
  
  useEffect(() => {
    const recorder = recorderState.mediaRecorder;
    if (!recorder) return
    let chunks = [];
    if (recorder && recorder.state === "inactive") {
      recorder.start();
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        let STATE_HELPER = 1
        setRecorderState((prevState) => {
          if (prevState.mediaRecorder && STATE_HELPER) {
            submitVoice(blob)
            STATE_HELPER--
          }
          return initialState;
        });
      }
    }
    return () => {
      if (recorder)
      recorder.stream.getAudioTracks().forEach((track) => track.stop());
    };
  }, [recorderState.mediaRecorder]);

  
  const  onScroll = (e) => {
    if (messagesContainer.current && messagesContainer.current.scrollTop === 0) {
     if (messages.length>= 20 && messages.length%10==0) {
        const maxCounter = messages.length + 10;
        setCounter(maxCounter)
      }
    }
  }

  function submitMessage() {
    setMessage("");
    const roomid = room.room._id;
    let data = { text: message, roomid };
    
    socket.emit("SendMessage", data, (m) => {
      console.log(m);
    });
  }

  const submitImage = () => {
    let base64data = images[0].data_url;
    let roomid = room.room._id;
    let ext = images[0].file.name.split(".");
    ext = ext[ext.length - 1];
    // base64data = base64data.split("base64,")[1];

    let size = images[0].file.size;

    let data = {
      base64data,
      type: "image",
      ext,
      roomid,
      text: caption ? caption : undefined,
      size,
    };
    socket.emit("SendMessage", data, (m) => {
      closeModal();
      setCaption("");
    });
  };

  const submitFile = () => {
    setUploading(true);
    let base64data = files[0].data_url;
    let roomid = room.room._id;
    let ext = files[0].file.name.split(".");
    ext = ext[ext.length - 1];

    let size = files[0].file.size;
    let filename = files[0].file.name;

    let data = {
      base64data,
      type: "file",
      ext,
      roomid,
      text: caption ? caption : undefined,
      size,
      filename,
    };
    socket.emit("SendMessage", data, (m) => {
      closeModal2();
    });
  };

  const submitVoice = (blob) => {
    let roomid = room.room._id;
    getFileBase64(blob, base64data => {
      let data = {
        base64data,
        type: "voice",
        roomid,
        duration : recorderState.recordingSeconds
      };
      socket.emit("SendMessage", data, (m) => {
        console.log(m);
      });
    })
  }

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const onChange = (imageList) => {
    setImages(imageList);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
    socket.emit("usertyping", {userid : user._id, roomid: room.room._id})
  }

    return (
        <React.Fragment>
         <ImageModal
        handleCaptionChange={handleCaptionChange}
        submitImage={submitImage}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        images={images}
      />
      <FileModal
        modalIsOpen={modalIsOpen2}
        closeModal={closeModal2}
        files={files}
        submitFile={submitFile}
        handleCaptionChange={handleCaptionChange}
      />
        <div className="bottom-container">
        <div className="hueIP">
          <div className="bottom-top-container">
            <div className="helPI">
              {showAlert && <ClipboardAlert setAlert={setAlert} />}
              <div className="messages-container" ref={messagesContainer} onScroll={onScroll}>
                {loader? (
                  <div className="messages-loader-container">
                  <Loader/>
                  </div>
                ): (
                  messages.map((message, index) => {
                    return (
                      <Message
                        key={index}
                        {...message}
                        setEditingMessages={setEditingMessages}
                        editingMessages={editingMessages}
                      />
                    );
                  })
                )}
              </div>
            </div>
            {!editingMessages.length ? (
              <div className="bottom-bottom-container">
                <div className="input-container">
                  <div className="global">
                    <div className={theme? "input-container-2 dark-vision" : "input-container-2"}>
                      <button>
                        <MdOutlineEmojiEmotions />
                      </button>
                      <input
                        type="text"
                        placeholder="Message"
                        value={message}
                        onChange={handleMessageChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && message)
                            return submitMessage();
                        }}
                      />
                      {recorderState.initRecording ? (
                        <Recorder {...recorderState} />
                      ) : (
                        <button
                          className="attachment-btn"
                          onClick={() =>
                            toggleDiv(
                              "attachment-content",
                              "show",
                              "hide-animation"
                            )
                          }
                        >
                          <RiAttachment2 />
                        </button>
                      )}
                      <div className="attachment-content">
                        <div className="attachment-content-container">
                          <ImageFileUpload
                            file={false}
                            label="Photo"
                            onChange={onChange}
                            images={images}
                            setFiles={setFiles}
                          />
                        </div>
                        <div className="attachment-content-container">
                          <ImageFileUpload
                            file={true}
                            label="File"
                            onChange={onChange}
                            images={images}
                            setFiles={setFiles}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={theme? "voice-container dark-vision" : "voice-container"}>
                      {message || recorderState.initRecording ? (
                        recorderState.initRecording ? (
                         <div style={{display:'flex', gap:'.5rem'}}>
                            <button className="delete-voice-note" onClick={cancelRecording}>
                            <MdOutlineDelete />
                          </button>
                          <button onClick={saveRecording}>
                            <AiOutlineSend className="send-message" />
                          </button>
                         </div>
                        ) : (
                          <button onClick={(e) => submitMessage(e)}>
                            <AiOutlineSend className="send-message" />
                          </button>
                        )
                      ) : (
                        <button onClick={startRecording}>
                          <MdOutlineKeyboardVoice className="voice-note" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <MessageDelete
                editingMessages={editingMessages}
                setEditingMessages={setEditingMessages}
                setAlert={setAlert}
              />
            )}
          </div>
        </div>
      </div> 
      </React.Fragment>
    )
}

export default BottomChatBox