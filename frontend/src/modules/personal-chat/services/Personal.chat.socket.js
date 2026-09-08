import { io } from "socket.io-client";


// ==========================================
// SOCKET.IO CONNECTION
// ==========================================

const personalChatSocket = io(
    "http://localhost:5000",
    {
        withCredentials: true,
        autoConnect: false
    }
);


// ==========================================
// CONNECT
// ==========================================

export const connectPersonalChatSocket = () => {

    if (!personalChatSocket.connected) {
        personalChatSocket.connect();
    }

    return personalChatSocket;
};


// ==========================================
// DISCONNECT
// ==========================================

export const disconnectPersonalChatSocket = () => {

    if (personalChatSocket.connected) {
        personalChatSocket.disconnect();
    }
};


// ==========================================
// JOIN PERSONAL CHAT
// ==========================================

export const joinPersonalChat = (
    appointmentId
) => {

    personalChatSocket.emit(
        "join_personal_chat",
        appointmentId
    );
};


// ==========================================
// LEAVE PERSONAL CHAT
// ==========================================

export const leavePersonalChat = (
    appointmentId
) => {

    personalChatSocket.emit(
        "leave_personal_chat",
        appointmentId
    );
};


// ==========================================
// SEND REAL-TIME MESSAGE
// ==========================================

export const sendPersonalMessageSocket = (
    appointmentId,
    message
) => {

    personalChatSocket.emit(
        "send_personal_message",
        {
            appointmentId,
            message
        }
    );
};


// ==========================================
// LISTEN FOR NEW MESSAGE
// ==========================================

export const onPersonalMessageReceived = (
    callback
) => {

    personalChatSocket.on(
        "personal_message_received",
        callback
    );
};


// ==========================================
// REMOVE MESSAGE LISTENER
// ==========================================

export const offPersonalMessageReceived = (
    callback
) => {

    personalChatSocket.off(
        "personal_message_received",
        callback
    );
};


// ==========================================
// CHAT ERROR
// ==========================================

export const onPersonalChatError = (
    callback
) => {

    personalChatSocket.on(
        "personal_chat_error",
        callback
    );
};


// ==========================================
// REMOVE CHAT ERROR LISTENER
// ==========================================

export const offPersonalChatError = (
    callback
) => {

    personalChatSocket.off(
        "personal_chat_error",
        callback
    );
};


// ==========================================
// SOCKET CONNECTION ERROR
// ==========================================

export const onPersonalSocketConnectError = (
    callback
) => {

    personalChatSocket.on(
        "connect_error",
        callback
    );
};


// ==========================================
// REMOVE SOCKET CONNECTION ERROR
// ==========================================

export const offPersonalSocketConnectError = (
    callback
) => {

    personalChatSocket.off(
        "connect_error",
        callback
    );
};


// ==========================================
// GET SOCKET
// ==========================================

export const getPersonalChatSocket = () => {

    return personalChatSocket;
};