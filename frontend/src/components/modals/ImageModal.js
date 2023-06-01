import React, {useEffect, useRef, useState} from "react";
import Modal from "react-modal";
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
    overflow : "overlay"
  },
};

const ImageModal = ({handleCaptionChange, submitImage, modalIsOpen, images, closeModal}) => {
  const imageElement = useRef(null)

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      <div className="modal-send-image">
          <div className="modal-send-container">
              <div className="modal-send-text">
              <div onClick={closeModal}>
              <span>&times;</span>
              </div>
               <p>Send Photo</p>
              </div>

              <div className="modal-send-button">
                  <button onClick={() => submitImage()}>Send</button>
              </div>
              
          </div>
            <div className="modal-image-container" ref={imageElement}>
            <img src={images.length? images[0].data_url : null} alt='Send'/>
           </div>
          <div className="modal-input-container">
              <input type='text' placeholder="Caption" onChange={handleCaptionChange}/>
          </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
