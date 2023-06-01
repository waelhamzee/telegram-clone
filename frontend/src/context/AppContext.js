import React, { useContext, useEffect, useReducer, useState } from "react";
import RequestEngine from "../core/RequestEngine";
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
} from "./actions";
import reducer from "./reducer";

const AppContext = React.createContext();

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
};

const engine = new RequestEngine();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [theme, setTheme] = useState(localStorage.getItem("config") && JSON.parse(localStorage.getItem("config")).darktheme)

  const SignUp = async (currentUser) => {
    dispatch({ type: SETUP_USER_BEGIN });
    const response = await engine.postItem("user", "/create", currentUser);
    if (response.data.message) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: response.data.message },
      });
      clearAlert();
      return;
    }

    const { user, token } = response.data.data;
    dispatch({
      type: SETUP_USER_SUCCESS,
      payload: { user, token, alertText: "User Created! Redirecting..." },
    });
    addUserToLocalStorage({ user, token });
    addConfigToLocalStorage();
    window.location.href = '/chat'
  };

  const LogIn = async (currentUser) => {
    dispatch({ type: SETUP_USER_BEGIN });
    const response = await engine.postItem("user", "/login", currentUser);
    if (response.data.message) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: response.data.message },
      });
      clearAlert();
      return;
    }

    const { user, token } = response.data.data;
    dispatch({
      type: SETUP_USER_SUCCESS,
      payload: { user, token, alertText: "Login Successful! Redirecting..." },
    });
    addUserToLocalStorage({ user, token });
    addConfigToLocalStorage();
    window.location.href = '/chat'
  };

  const addUserToLocalStorage = ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const addConfigToLocalStorage = () => {
    const config = {
      notifications : true,
      darktheme : false
    }
    localStorage.setItem("config", JSON.stringify(config))
  }

  const dispatchError = () => {
    dispatch({ type: DISPLAY_ALERT });
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 300000);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        SignUp,
        LogIn,
        dispatchError,
        clearAlert,
        theme,
        setTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
