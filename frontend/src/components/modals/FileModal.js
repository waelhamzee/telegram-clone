import React, {useEffect, useRef, useState} from "react";
import Modal from "react-modal";
import fileSize from 'filesize'
import "../../css/modal.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "auto",
    width: "30rem",
    // maxWidth: "420px",
    overflow : "overlay"
  },
};

const FileModal = ({modalIsOpen, files, closeModal, submitFile, handleCaptionChange}) => {

  const getExtension = () => {
    if (files.length) {
      let array = files[0].file.name.split('.')
      return array[array.length - 1]
    }
    return ""
  }

  const getBackgroundColor = () => {
    if (files.length) {
      if (getExtension() === 'pdf') return '#DF3F40'
      return '#3390ec'
    }
    return ""
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      <div className="modal-send-image">
          <div className="modal-send-container" style={{marginBottom:'10px'}}>
              <div className="modal-send-text">
              <div onClick={closeModal}>
              <span>&times;</span>
              </div>
               <p>Send File</p>
              </div>

              <div className="modal-send-button">
                  <button onClick={() => submitFile('file')}>Send</button>
              </div>
              
          </div>
            <div className="modal-image-container" style={{marginBottom:'25px'}}>
              <div className="file-upload-container">
               <div className="extension-container">
               <div className="extension" style={{backgroundColor: `${getBackgroundColor()}`}}>
                  <p>{getExtension()}</p>
                </div>
               </div>
                <div className="file-text-container">
                  <p className="file-name">{files.length? files[0].file.name : null}</p>
                  <p className="file-size">{files.length? `${fileSize(files[0].file.size)}` : null}</p>
                </div>
              </div>
           </div>
           <div className="modal-input-container" style={{marginBottom:'15px'}}>
              <input type='text' placeholder="Caption" onChange={handleCaptionChange}/>
          </div>
      </div>
    </Modal>
  );
};

export default FileModal;
