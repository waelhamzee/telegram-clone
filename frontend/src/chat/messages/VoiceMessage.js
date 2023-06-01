import React from 'react'
import {useAppContext} from '../../context/AppContext'
import Constants from '../../core/Constants'
import MessageInfo from './MessageInfo'
import ReactAudioPlayer from 'react-audio-player'

const customStyles = {
    display: "flex",
    flexDirection: "column",
    background: "#eeffde",
    borderRadius: "10px",
}

const VoiceMessage = ({from, filename, createdAt, read, _id}) => {
  const {user,theme} = useAppContext()

    return (
        <div className={user._id === from? 'message-container' : 'message-container incoming'}>
            <div style={customStyles}>
             {/* <audio controls>
                      <source
                        src={`${Constants.serverlink + 'upload/' +filename}`}
                        type="audio/ogg"
                      />
                      <source
                        src={`${Constants.serverlink + 'upload/' +filename}`}
                        type="audio/mpeg"
                      />
                      <source
                        src={`${Constants.serverlink + 'upload/' +filename}`}
                        type="audio/aac"
                      />
                      Your browser does not support the audio element.
                    </audio> */}
                    <ReactAudioPlayer
                    src={`${Constants.serverlink + 'upload/' +filename}`}
                    type="audio/aac"
                    controls
                  />
            <div className={user._id === from? `${theme? "message-XY dark-vision" : "message-XY" }` : 'message-XY incoming-XY'} style={{justifyContent: 'flex-end', backgroundColor: "#F1F3F4"}}>
            <MessageInfo
            createdAt={createdAt}
            from={from}
            read={read}
            _id={_id}
          />
          </div>
            </div>
      </div>
    )
}

export default VoiceMessage