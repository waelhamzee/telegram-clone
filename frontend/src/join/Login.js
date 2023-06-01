// import React, { useEffect, useRef, useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { BeatLoader } from "react-spinners";
// import {useNavigate} from "react-router-dom"
// import Alert from "../components/Alert";
// import "../css/join.css";

// const Login = () => {
//   const navigate = useNavigate()
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const {
//     SignUp,
//     alertType,
//     dispatchError,
//     alertText,
//     showAlert,
//     clearAlert,
//     ToggleSignUp,
//     isLoading,
//     user,
//     token
//   } = useAppContext();
//   const firstbox = useRef(null);
//   const secondbox = useRef(null);


//   const swipeUp = (e) => {
//     e.preventDefault();
//     if (!username || !password || (!username && !password)) {
//       dispatchError();
//       clearAlert();
//       return;
//     }
//     ToggleSignUp(firstbox.current, secondbox.current);
//   };

//   const onSubmit = (e) => {
//     e.preventDefault();
//     // if (image) do stuff
//     ToggleSignUp(firstbox.current, secondbox.current);
//     const currentUser = { username, password, base64: images[0].data_url };
//     SignUp(currentUser);
//   };

//   useEffect(() => {
//     if (token && localStorage.getItem("isloggedin")) {
//       setTimeout(() => {
//         navigate('/chat')
//         localStorage.removeItem("isloggedin")
//       }, 3000)
//     } else if (token) {
//       navigate('/chat')
//     }
//   }, [token, navigate])

//   return (
//     <div className="joinContainer">
//       <div className="joinContainer-box-container">
//         <div className="joinContainer-box" ref={firstbox}>
//           <div className="joinContainer-half">
//             <div className="useless-stuff">
//               <img
//                 alt="Chat"
//                 src={require("../images/1200px-Google_Chat_icon_(2020).svg.png")}
//               />
//               <h2>W02 Chat</h2>
//               <p>Enter a nickname to introduce yourself</p>
//               {showAlert && <Alert/>}
//             </div>
//             <form className="joinContainer-form">
//               <input
//                 type="text"
//                 placeholder="Example - Wael02"
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button className="btn" disabled={isLoading} onClick={swipeUp}>
//               {isLoading ? <BeatLoader /> : "Continue"}
//               </button>
//               <a href="#">Already have an account?</a>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
