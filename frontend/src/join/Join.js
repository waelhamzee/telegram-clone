import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import "../css/join.css";

const token = localStorage.getItem("token")

const Join = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false)

  const {
    SignUp,
    LogIn,
    dispatchError,
    showAlert,
    clearAlert,
    isLoading,
  } = useAppContext();

  const onSignUp = (e) => {
    e.preventDefault();
    if (!username || !password || (!username && !password)) {
      dispatchError();
      clearAlert();
      return;
    }
    const currentUser = { username, password };
    SignUp(currentUser);
  };

  const onLogin = (e) => {
    e.preventDefault();
    if (!username || !password || (!username && !password)) {
      dispatchError();
      clearAlert();
      return;
    }
    const currentUser = { username, password };
    LogIn(currentUser)
  }

  useEffect(() => {
    if (token) {
      window.location.href = '/chat'
    }
  }, [])

  return (
    <div className="joinContainer">
      <div className="joinContainer-box-container">
        <div className="joinContainer-box">
          <div className="joinContainer-half">
            <div className="useless-stuff">
             <div className="useless-img-container">
             <img alt="Chat" src={require("../images/chat-g362b820a8_1280.png")} />
             </div>
              <h2>W02 Chat</h2>
              <p>{login? "Login with your username." : "Enter a nickname to introduce yourself."}</p>
            </div>
            <form className="joinContainer-form">
              {showAlert && <Alert />}
              <input
                type="text"
                placeholder="Example - wael_hamze"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn" disabled={isLoading}
               onClick={(e) => {if(login) onLogin(e); else onSignUp(e) }}>
                {isLoading ? <BeatLoader /> : "Continue"}
              </button>
              <a href="#" onClick={() => setLogin(!login)}>{!login? "Already have an account?" :
              "Create a new account." }
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
