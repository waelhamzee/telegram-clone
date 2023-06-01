import React from "react";
import FullContainer from "./chat/FullContainer";
import { Routes, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAppContext } from "./context/AppContext";
import Join from "./join/Join";
import CallModal from "./components/modals/CallModal";
import ReactNotification from "react-notifications-component";
import 'react-notifications-component/dist/theme.css'

function App() {
  const token = localStorage.getItem("token")
  return (
    <Routes>
      {/* {!token && <Route path="/" element={<Join />} /> } */}
      <Route path="/" element={<Join/>} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ReactNotification />
            <CallModal />
            <FullContainer />
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
}

export default App;
