import React, { useEffect, useRef } from 'react'
import {useAppContext} from '../../context/AppContext'
import Constants from '../../core/Constants'
import MessageInfo from './MessageInfo'
import ProgressiveImg from './ProgressiveImg'


const imageCS = {
  maxWidth: '318px',
  maxHeight : '180px',
  position: 'relative'
}

const ImageMessage = ({from, text , filename , createdAt, read, _id}) => {
  const {user,theme} = useAppContext()
  let splitted = filename.split('.')
  let firstPart = splitted[0].concat('x.')
  let newFilename = firstPart.concat(splitted[splitted.length - 1])
  
  let customStyles = {
      display: "flex",
      flexDirection: "column",
      background: "#eeffde",
      borderRadius: "10px",
  }
  
  if (theme&&user._id === from) {
    customStyles['background'] = "rgb(118,106,200)"
  }

    return (
        <div className={user._id === from? 'message-container' : 'message-container incoming'}>
            <div style={customStyles}>
            {/* <a> */}
            <a style={imageCS} href={`${Constants.serverlink + 'upload/' +filename}`} target={'_blank'}>
                <ProgressiveImg
                    src={`${Constants.serverlink}upload/${filename}`}
                    placeholderSrc={`${Constants.serverlink}upload/${newFilename}`}
                    width="700"
                    height="465"
                  />
            </a>
            <div className={user._id === from? `${theme? "message-XY dark-vision" : "message-XY" }` : 'message-XY incoming-XY'} style={text===undefined? {justifyContent: 'flex-end'} : null}>
             <div className="message">{text}</div>
             <MessageInfo
              createdAt={createdAt}
              from={from}
              read={read}
              text={text}
              _id={_id}
            />
          </div>
            </div>
      </div>
    )
}

export default ImageMessage