import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const SettingContainer = ({ pair }) => {
  const [check, setCheck] = useState(JSON.parse(localStorage.getItem("config"))[pair]);
  const {setTheme} = useAppContext()

  const onChange = (e) => {
    const config = JSON.parse(localStorage.getItem("config"));
    config[pair] = e.target.checked
    setCheck(e.target.checked)
    localStorage.setItem("config", JSON.stringify(config))
    if (pair === "darktheme") setTheme(JSON.parse(localStorage.getItem("config")).darktheme)
  };

  return (
    <div className="settings-container-d">
      <p>{pair.replace(/^./, pair[0].toUpperCase())}</p>
      <div>
        <label className="switch">
          <input type="checkbox" onChange={onChange} checked={check} />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default SettingContainer;
