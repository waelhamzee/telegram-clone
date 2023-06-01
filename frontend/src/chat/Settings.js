import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import Modal from "react-modal";
import { useAppContext } from "../context/AppContext";
import SettingContainer from "./SettingContainer";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "300px",
    overflow: "overlay",
    height: "130px",
    border: "none",
    padding : "0px !important"
  },
};

const Settings = () => {
  const [modalIsOpen, setmodalIsOpen] = useState(false)
  const {theme, user} = useAppContext()

  const removeAnimation = () => {
    const el = document.getElementById("S*");
    const el2 = document.getElementById("X*");
    el.className = "hide-sidebar";
    el2.className = "hide-sidebar";
  };

  const closeModal = () => {
    setmodalIsOpen(false)
  }

  const logout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  return (
    <div id="X*">
      <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      <div className="quest">
        <p>Are you sure you want to logout?</p>
        <div className="cd-buttons">
          <button style={{background:"rgb(255, 79, 79)"}} onClick={logout}>Yes</button>
          <button style={{background:"rgb(50, 77, 103)"}} onClick={closeModal}>No</button>
        </div>
      </div>
    </Modal>
      <div className="ufX_">
        <button onClick={() => removeAnimation()}>
          <AiOutlineArrowLeft style={{ fill: "rgb(112,117,121)" }} />
        </button>
        <div>
          <p>Settings</p>
        </div>
      </div>
      <div className="settings-container">
        <div className="logout-container">
          <p>Username : </p>
          <p>"{user.username}"</p>
        </div>
        <SettingContainer pair={"notifications"} />
        <SettingContainer pair={"darktheme"} />
        <div className="logout-container">
          <p>Logout</p>
          <button className={theme? "dark-theme" : ""} onClick={() => setmodalIsOpen(true)}>
            <FiLogOut />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
