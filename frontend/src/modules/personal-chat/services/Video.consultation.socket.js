import { io } from "socket.io-client";


// ==========================================
// CREATE VIDEO SOCKET
// ==========================================

const videoConsultationSocket = io(
    "http://localhost:5000",
    {
        withCredentials: true,
        autoConnect: false
    }
);


// ==========================================
// CONNECT
// ==========================================

export const connectVideoConsultationSocket = () => {

    if (!videoConsultationSocket.connected) {
        videoConsultationSocket.connect();
    }

    return videoConsultationSocket;
};


// ==========================================
// DISCONNECT
// ==========================================

export const disconnectVideoConsultationSocket = () => {

    if (videoConsultationSocket.connected) {
        videoConsultationSocket.disconnect();
    }

};


// ==========================================
// JOIN VIDEO CONSULTATION
// ==========================================

export const joinVideoConsultation = (
    appointmentId
) => {

    videoConsultationSocket.emit(
        "join_video_consultation",
        appointmentId
    );

};


// ==========================================
// LEAVE VIDEO CONSULTATION
// ==========================================

export const leaveVideoConsultation = (
    appointmentId
) => {

    videoConsultationSocket.emit(
        "leave_video_consultation",
        appointmentId
    );

};


// ==========================================
// SEND WEBRTC OFFER
// ==========================================

export const sendVideoOffer = (
    appointmentId,
    offer
) => {

    videoConsultationSocket.emit(
        "video_offer",
        {
            appointmentId,
            offer
        }
    );

};


// ==========================================
// SEND WEBRTC ANSWER
// ==========================================

export const sendVideoAnswer = (
    appointmentId,
    answer
) => {

    videoConsultationSocket.emit(
        "video_answer",
        {
            appointmentId,
            answer
        }
    );

};


// ==========================================
// SEND ICE CANDIDATE
// ==========================================

export const sendVideoIceCandidate = (
    appointmentId,
    candidate
) => {

    videoConsultationSocket.emit(
        "video_ice_candidate",
        {
            appointmentId,
            candidate
        }
    );

};


// ==========================================
// END VIDEO CONSULTATION
// ==========================================

export const endVideoConsultationSocket = (
    appointmentId
) => {

    videoConsultationSocket.emit(
        "end_video_consultation",
        appointmentId
    );

};


// ==========================================
// VIDEO PARTICIPANT JOINED
// ==========================================

export const onVideoParticipantJoined = (
    callback
) => {

    videoConsultationSocket.on(
        "video_participant_joined",
        callback
    );

};


export const offVideoParticipantJoined = (
    callback
) => {

    videoConsultationSocket.off(
        "video_participant_joined",
        callback
    );

};


// ==========================================
// VIDEO OFFER
// ==========================================

export const onVideoOffer = (
    callback
) => {

    videoConsultationSocket.on(
        "video_offer",
        callback
    );

};


export const offVideoOffer = (
    callback
) => {

    videoConsultationSocket.off(
        "video_offer",
        callback
    );

};


// ==========================================
// VIDEO ANSWER
// ==========================================

export const onVideoAnswer = (
    callback
) => {

    videoConsultationSocket.on(
        "video_answer",
        callback
    );

};


export const offVideoAnswer = (
    callback
) => {

    videoConsultationSocket.off(
        "video_answer",
        callback
    );

};


// ==========================================
// ICE CANDIDATE
// ==========================================

export const onVideoIceCandidate = (
    callback
) => {

    videoConsultationSocket.on(
        "video_ice_candidate",
        callback
    );

};


export const offVideoIceCandidate = (
    callback
) => {

    videoConsultationSocket.off(
        "video_ice_candidate",
        callback
    );

};


// ==========================================
// CONSULTATION JOINED
// ==========================================

export const onVideoConsultationJoined = (
    callback
) => {

    videoConsultationSocket.on(
        "video_consultation_joined",
        callback
    );

};


export const offVideoConsultationJoined = (
    callback
) => {

    videoConsultationSocket.off(
        "video_consultation_joined",
        callback
    );

};


// ==========================================
// CONSULTATION ENDED
// ==========================================

export const onVideoConsultationEnded = (
    callback
) => {

    videoConsultationSocket.on(
        "video_consultation_ended",
        callback
    );

};


export const offVideoConsultationEnded = (
    callback
) => {

    videoConsultationSocket.off(
        "video_consultation_ended",
        callback
    );

};


// ==========================================
// ERROR
// ==========================================

export const onVideoConsultationError = (
    callback
) => {

    videoConsultationSocket.on(
        "video_consultation_error",
        callback
    );

};


export const offVideoConsultationError = (
    callback
) => {

    videoConsultationSocket.off(
        "video_consultation_error",
        callback
    );

};


// ==========================================
// SOCKET CONNECT ERROR
// ==========================================

export const onVideoSocketConnectError = (
    callback
) => {

    videoConsultationSocket.on(
        "connect_error",
        callback
    );

};


export const offVideoSocketConnectError = (
    callback
) => {

    videoConsultationSocket.off(
        "connect_error",
        callback
    );

};


// ==========================================
// GET SOCKET
// ==========================================

export const getVideoConsultationSocket = () => {

    return videoConsultationSocket;

};