import React from "react";
import ReactDOM from "react-dom";
import { AppProvider } from "./context/AppContext";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./css/styles.css";
import { SocketProvider } from "./context/SocketContext";
import { CallProvider } from "./context/CallContext";

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <AppProvider>
        <CallProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CallProvider>
      </AppProvider>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
