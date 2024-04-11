import {io} from "socket.io-client"

export const initSocket = async()=>{
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(process.env.REACT_APP_BACKEND_URL || "http://172.20.10.2:5000", options);
}