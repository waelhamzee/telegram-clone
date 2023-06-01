import React, { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc"
import { FcCheckmark } from "react-icons/fc";
import RequestEngine from "../core/RequestEngine";
import { useAppContext } from "../context/AppContext";

const customStyles = {
  display: "flex",
  flexDirection: "column",
};

const engine = new RequestEngine();

const SearchContainer = ({ users, setUsers, active, setActive }) => {
  const [userInfo, setUserinfo] = useState([]);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);
  const {user} = useAppContext()

  const sendRequest = async (id) => {
    const response = await engine.postItem("user", "/sendrequest", {id});
    if (response.status === 200) {
      getUserInfo()
    }
  };

  const acceptRequest = async (id) => {
    const response = await engine.postItem("user", "/acceptrequest", {id});
    if (response.status === 200) {
      getUserInfo()
    }
  }

  const rejectRequest = async (id) => {
    const response = await engine.postItem("user", "/rejectrequest", {id});
    if (response.status === 200) {
      getUserInfo()
    }
  }

  const getUserInfo = async () => {
    let userinfo = await engine.postItem("user", "/getinfo", {id : user._id});
    setUserinfo(userinfo.data.data);
    setFriendRequestsCount(userinfo.data.data.requestsreceived.length);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    const setFriendRequests = async () => {
      if (active === "friendsrequests") {
        console.log(active);
        const response = await engine.postItem("user", "/search", {
          flag: active,
        });
        console.log(response);
        if (response.data.data) {
          setUsers(response.data.data);
        }
      }
    };
    setFriendRequests();
  }, [active]);

  const checkFriendStatus = (userid) => {
    if (userInfo.requestssent.length && userInfo.requestssent.includes(userid)) {
      return <p>Sent</p>
    } else if (userInfo.friends.length && userInfo.friends.includes(userid)) {
      return <p>Friends</p>
    } else if (userInfo.requestsreceived.length && userInfo.requestsreceived.includes(userid)) {
      return (
        <div className="request-state-container">
          <button onClick={() => rejectRequest(userid)}><VscChromeClose className="add-container-reject"/></button>
          <button onClick={() => acceptRequest(userid)}><FcCheckmark className="add-container-sent" /></button>
        </div>
      );
    }
    return (
      <AiOutlineUserAdd
        className="add-container-add"
        onClick={() => sendRequest(userid)}
      />
    );
  };

  const toggleActive = (name) => {
    setActive(name);
    setUsers([]);
    document.getElementById("search").value = "";
  };

  return (
    <div style={customStyles}>
      <div className="divider">
        <div
          className={
            active === "chats"
              ? "divider-container grey-background"
              : "divider-container"
          }
          onClick={() => toggleActive("chats")}
        >
          <p>Chats</p>
        </div>
        <div
          className={
            active === "people"
              ? "divider-container grey-background"
              : "divider-container"
          }
          onClick={() => toggleActive("people")}
        >
          <p>People</p>
        </div>
        <div
          className={
            active === "friendsrequests"
              ? "divider-container grey-background"
              : "divider-container"
          }
          onClick={() => toggleActive("friendsrequests")}
        >
          {friendRequestsCount!==0 && (
            <div className="friend-req-counter">
              <p>{friendRequestsCount}</p>
            </div>
          )}
          <p>Friend Requests</p>
        </div>
      </div>
      <div className="users-found">
        {users.map((user, index) => {
          return (
            <div key={index} className="user">
              <div className="user-first-container">
                <div className="user-image-container">
                  <img src={`https://ui-avatars.com/api/?name=${user.username[0]}`} alt={user.username[0]} />
                </div>
                <p>{user.username}</p>
              </div>
              {active!=='chats' && (
                <div className="add-container">
                {checkFriendStatus(user._id)}
              </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchContainer;
