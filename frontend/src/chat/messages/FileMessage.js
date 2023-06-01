import React, {  useEffect, useState } from 'react'
import fileSize from 'filesize'
import {useAppContext} from '../../context/AppContext'
import axios from 'axios'
import { HiDownload } from 'react-icons/hi'
import MessageInfo from './MessageInfo'
import Constants from '../../core/Constants'



const FileMessage = ({width, height, from, text , filename , createdAt, size, uploading, read, _id}) => {
  const {user,theme} = useAppContext()
  const [progress, setProgress] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [hover, setHover] = useState(false)

  let customStyles = {
      display: "flex",
      flexDirection: "column",
      background: "#eeffde",
      borderRadius: "10px",
      maxWidth: '325px',
      userSelect : 'none'
  }

  const link = Constants.serverlink + "upload/" + filename 
  const controller = new window.AbortController();

  const download = async () => {
    setDownloading(true)
    const response = await axios({
      url: link,
      method: "GET",
      responseType: "blob", // important
      onDownloadProgress: (progressEvent) => {
        setDownloading(true)
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total); // you can use this to show user percentage of file downloaded
          setProgress(percentCompleted)
      },
      signal : controller.signal
   })
   if (response.data) {
    const url =window.URL.createObjectURL(new Blob([response.data], { type: "application/octet-stream" }))
    const a = document.createElement("a");
    a.style = "display: none";
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
   }
  }

  useEffect(() => {
    if (progress === 100 && downloading) {
      setDownloading(false)
      setHover(false)
      setProgress(0)
    }
  }, [progress])

  useEffect(() => {
    if (controller.signal.aborted) {
      setHover(false)
      setDownloading(false)
      setProgress(0)
    }
  }, [])

  const cancel = () => {
    controller.abort()
  }

  if (theme&&user._id === from) {
    customStyles['background'] = "rgb(118,106,200)"
    customStyles['color'] = "white"
  }

  const addWhiteColor = theme?'white':null

    return (
          <div className={user._id === from? 'message-container' : 'message-container incoming'}>
            <div style={customStyles}>
             <div className="file-upload-container" style={user._id === from? {padding: "0.4rem .7rem 0rem .4rem"} : {padding: "0.4rem .7rem 0rem .4rem", background :'white'}}>
              {!downloading? (
                 <div className='extension-container' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                 {!hover? (
                   <div className="extension">
                   <p>{filename.split('.')[1]}</p>
                 </div>
                 ): (
                  <div className="extension">
                  <div className='download-style' onClick={download}><HiDownload/></div>
                </div>
                 )}
                 </div>
              ) : (
                <div className='extension-container' onClick={cancel}>
                  <div className='extension-download'><div>&times;</div></div>
                </div>
               )} 
                <div className="file-text-container">
                  <p className='file-name' style={{textAlign: 'left'}}>{filename}</p>
                  {progress? (
                    <p className='file-size' style={{textAlign: 'left', color : addWhiteColor}}>{progress}%</p>
                  ) : <p className='file-size' style={{textAlign: 'left', color : addWhiteColor}}>{fileSize(size)}</p>}
                </div>
              </div>
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

export default FileMessage