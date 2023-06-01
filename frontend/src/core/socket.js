import { io } from "socket.io-client";
import Constants from "./Constants";
let token = localStorage.getItem('token');
export const socket = io(Constants.serverlink, {query: 'token='+token,'reconnection':true, reconnectionDelay : 500});