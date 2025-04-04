import {io} from "socket.io-client"

export const initSocket = async()=>{
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(process.env.REACT_APP_BACKEND_URL || "http://13.203.66.35:3001", options);
    // return io(process.env.REACT_APP_BACKEND_URL || "http://localhost:3001", options);
}