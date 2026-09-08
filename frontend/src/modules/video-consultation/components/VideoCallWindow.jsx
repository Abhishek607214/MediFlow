import {
    useEffect,
    useRef,
    useState
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../../../services/api";

import {
    connectVideoConsultationSocket,
    disconnectVideoConsultationSocket,
    joinVideoConsultation,
    leaveVideoConsultation,
    sendVideoOffer,
    sendVideoAnswer,
    sendVideoIceCandidate,
    endVideoConsultationSocket,
    onVideoParticipantJoined,
    offVideoParticipantJoined,
    onVideoOffer,
    offVideoOffer,
    onVideoAnswer,
    offVideoAnswer,
    onVideoIceCandidate,
    offVideoIceCandidate,
    onVideoConsultationEnded,
    offVideoConsultationEnded,
    onVideoConsultationJoined,
    offVideoConsultationJoined,
    onVideoConsultationError,
    offVideoConsultationError,
    onVideoSocketConnectError,
    offVideoSocketConnectError
} from "../services/Video.consultation.socket";

import "../styles/Video.consultation.css";


const VideoCallWindow = ({
    appointmentId,
    currentUserRole,
    currentUserName,
    otherParticipantName
}) => {

    // ==========================================
    // VIDEO REFERENCES
    // ==========================================

    const navigate = useNavigate();
    const localVideoRef = useRef(null);

    const remoteVideoRef = useRef(null);

    const localStreamRef = useRef(null);

    const peerConnectionRef = useRef(null);

    const callStartedRef = useRef(false);

    const offerCreatedRef = useRef(false); 

    // ==========================================
    // STATE
    // ==========================================

    const [isMuted, setIsMuted] =
        useState(false);

    const [isCameraOff, setIsCameraOff] =
        useState(false);

    const [isConnected, setIsConnected] =
        useState(false);

    const [
        isOtherParticipantPresent,
        setIsOtherParticipantPresent
    ] = useState(false);

    const [consultationEnded, setConsultationEnded] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [connectionStatus, setConnectionStatus] =
        useState("Connecting...");


    // ==========================================
    // WEBRTC CONFIGURATION
    // ==========================================

    const rtcConfiguration = {
        iceServers: [
            {
                urls:
                    "stun:stun.l.google.com:19302"
            }
        ]
    };


    // ==========================================
    // CREATE PEER CONNECTION
    // ==========================================

    const createPeerConnection = () => {

        if (peerConnectionRef.current) {
            return peerConnectionRef.current;
        }


        const peerConnection =
            new RTCPeerConnection(
                rtcConfiguration
            );


        // Add local tracks

        if (localStreamRef.current) {

            localStreamRef.current
                .getTracks()
                .forEach((track) => {

                    peerConnection.addTrack(
                        track,
                        localStreamRef.current
                    );

                });

        }


        // Receive remote video/audio

        peerConnection.ontrack = (event) => {

            const [remoteStream] =
                event.streams;

            if (
                remoteVideoRef.current &&
                remoteStream
            ) {

                remoteVideoRef.current.srcObject =
                    remoteStream;

            }

            setIsOtherParticipantPresent(
                true
            );

            setConnectionStatus(
                "Connected"
            );

        };


        // ICE candidates

        peerConnection.onicecandidate = (
            event
        ) => {

            if (event.candidate) {

                sendVideoIceCandidate(
                    appointmentId,
                    event.candidate
                );

            }

        };


        // Connection state

        peerConnection.onconnectionstatechange =
            () => {

                const state =
                    peerConnection.connectionState;


                if (state === "connected") {

                    setIsConnected(true);

                    setConnectionStatus(
                        "Connected"
                    );

                } else if (
                    state === "connecting"
                ) {

                    setConnectionStatus(
                        "Connecting..."
                    );

                } else if (
                    state === "disconnected"
                ) {

                    setIsConnected(false);

                    setConnectionStatus(
                        "Disconnected"
                    );

                } else if (
                    state === "failed"
                ) {

                    setIsConnected(false);

                    setConnectionStatus(
                        "Connection failed"
                    );

                }

            };


        peerConnectionRef.current =
            peerConnection;


        return peerConnection;
    };


    // ==========================================
    // CREATE WEBRTC OFFER
    // ==========================================

const createOffer = async () => {

    try {

        // ======================================
        // ONLY DOCTOR CAN CREATE AN OFFER
        // ======================================

        if (currentUserRole !== "doctor") {

            console.warn(
                "Offer blocked: only doctor can create offer."
            );

            return;
        }

        // ======================================
        // PREVENT DUPLICATE OFFER CREATION
        // ======================================

        if (offerCreatedRef.current) {

            console.warn(
                "Offer already created. Skipping duplicate offer."
            );

            return;
        }

        const peerConnection =
            createPeerConnection();

        // ======================================
        // OFFER MUST START FROM STABLE STATE
        // ======================================

        if (
            peerConnection.signalingState !==
            "stable"
        ) {

            console.warn(
                "Offer not created. Current signaling state:",
                peerConnection.signalingState
            );

            return;
        }

        // Lock offer creation BEFORE async operations
        offerCreatedRef.current = true;

        const offer =
            await peerConnection.createOffer();

        await peerConnection.setLocalDescription(
            offer
        );

        sendVideoOffer(
            appointmentId,
            offer
        );

        console.log(
            "Doctor sent WebRTC offer"
        );

    } catch (err) {

        // Allow retry if offer creation actually failed
        offerCreatedRef.current = false;

        console.error(
            "Create offer error:",
            err
        );

        setError(
            "Unable to start video connection"
        );
    }

};
    // ==========================================
    // HANDLE OFFER
    // ==========================================

  const handleOffer = async (data) => {

    try {

        // ======================================
        // ONLY PATIENT HANDLES THE OFFER
        // ======================================

        if (currentUserRole !== "patient") {

            console.warn(
                "Offer ignored: only patient handles offers."
            );

            return;

        }


        const peerConnection =
            createPeerConnection();


        // ======================================
        // HANDLE POSSIBLE OLD OFFER
        // ======================================

        if (
            peerConnection.signalingState ===
            "have-local-offer"
        ) {

            console.warn(
                "Patient already has a local offer. Rolling back."
            );


            await peerConnection.setLocalDescription({
                type: "rollback"
            });

        }


        // ======================================
        // ACCEPT DOCTOR OFFER
        // ======================================

        if (
            peerConnection.signalingState !==
            "stable"
        ) {

            console.warn(
                "Cannot accept offer. Current state:",
                peerConnection.signalingState
            );

            return;

        }


        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(
                data.offer
            )
        );


        // ======================================
        // CREATE ANSWER
        // ======================================

        const answer =
            await peerConnection.createAnswer();


        await peerConnection.setLocalDescription(
            answer
        );


        sendVideoAnswer(
            appointmentId,
            answer
        );


        console.log(
            "Patient sent WebRTC answer"
        );


    } catch (err) {

        console.error(
            "Handle offer error:",
            err
        );

        setError(
            "Unable to connect video"
        );

    }

};

    // ==========================================
    // HANDLE ANSWER
    // ==========================================
const handleAnswer = async (data) => {

    try {

        // ======================================
        // ONLY DOCTOR RECEIVES ANSWER
        // ======================================

        if (currentUserRole !== "doctor") {

            console.warn(
                "Answer ignored: only doctor handles answers."
            );

            return;

        }


        const peerConnection =
            peerConnectionRef.current;


        if (!peerConnection) {
            return;
        }


        // ======================================
        // ANSWER MUST FOLLOW OUR OFFER
        // ======================================

        if (
            peerConnection.signalingState !==
            "have-local-offer"
        ) {

            console.warn(
                "Ignoring answer because signaling state is:",
                peerConnection.signalingState
            );

            return;

        }


        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(
                data.answer
            )
        );


        console.log(
            "Doctor received patient answer"
        );


    } catch (err) {

        console.error(
            "Handle answer error:",
            err
        );

    }

};

    // ==========================================
    // HANDLE ICE CANDIDATE
    // ==========================================

    const handleIceCandidate = async (data) => {

        try {

            const peerConnection =
                peerConnectionRef.current;


            if (!peerConnection) {
                return;
            }


            if (data.candidate) {

                await peerConnection.addIceCandidate(
                    new RTCIceCandidate(
                        data.candidate
                    )
                );

            }

        } catch (err) {

            console.error(
                "ICE candidate error:",
                err
            );

        }

    };


    // ==========================================
    // START LOCAL CAMERA + MICROPHONE
    // ==========================================

    const startLocalMedia = async () => {

        try {

            const stream =
                await navigator.mediaDevices
                    .getUserMedia({
                        video: true,
                        audio: true
                    });


            localStreamRef.current =
                stream;


            if (localVideoRef.current) {

                localVideoRef.current.srcObject =
                    stream;

            }


            return true;


        } catch (err) {

            console.error(
                "Camera/microphone error:",
                err
            );


            if (
                err.name ===
                "NotAllowedError"
            ) {

                setError(
                    "Camera and microphone permission was denied."
                );

            } else if (
                err.name ===
                "NotFoundError"
            ) {

                setError(
                    "Camera or microphone was not found."
                );

            } else {

                setError(
                    "Unable to access camera or microphone."
                );

            }


            return false;

        }

    };


    // ==========================================
    // START CONSULTATION
    // ==========================================

    const startConsultation = async () => {

        if (callStartedRef.current) {
        return;
    }

    callStartedRef.current = true;
        try {

            setLoading(true);

            setError("");


            // Doctor starts the consultation

            if (
                currentUserRole ===
                "doctor"
            ) {

                await api.post(
                    `/video-consultation/${appointmentId}/start`
                );

            } else {

                // Patient verifies consultation

                await api.get(
                    `/video-consultation/${appointmentId}`
                );

            }


            // Start camera and microphone

            const mediaStarted =
                await startLocalMedia();


            if (!mediaStarted) {

                setLoading(false);

                return;

            }


            // Connect Socket.IO

            const socket =
                connectVideoConsultationSocket();


            socket.once(
                "connect",
                () => {

                    joinVideoConsultation(
                        appointmentId
                    );

                }
            );


            if (socket.connected) {

                joinVideoConsultation(
                    appointmentId
                );

            }


            setLoading(false);


        } catch (err) {

            console.error(
                "Start consultation error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to start video consultation"
            );


            setLoading(false);

        }

    };


    // ==========================================
    // MUTE / UNMUTE
    // ==========================================

    const toggleMute = () => {

        if (!localStreamRef.current) {
            return;
        }


        const audioTracks =
            localStreamRef.current
                .getAudioTracks();


        audioTracks.forEach((track) => {

            track.enabled =
                !track.enabled;

        });


        setIsMuted(
            !audioTracks[0]?.enabled
        );

    };


    // ==========================================
    // CAMERA ON / OFF
    // ==========================================

    const toggleCamera = () => {

        if (!localStreamRef.current) {
            return;
        }


        const videoTracks =
            localStreamRef.current
                .getVideoTracks();


        videoTracks.forEach((track) => {

            track.enabled =
                !track.enabled;

        });


        setIsCameraOff(
            !videoTracks[0]?.enabled
        );

    };


    // ==========================================
    // CLEANUP
    // ==========================================

    const cleanupCall = () => {

        if (localStreamRef.current) {

            localStreamRef.current
                .getTracks()
                .forEach(
                    (track) => track.stop()
                );

            localStreamRef.current =
                null;

        }


        if (peerConnectionRef.current) {

            peerConnectionRef.current.close();

            peerConnectionRef.current =
                null;

        }


        if (localVideoRef.current) {

            localVideoRef.current.srcObject =
                null;

        }

if (remoteVideoRef.current) {

    remoteVideoRef.current.srcObject =
        null;

}

// Reset call guards
callStartedRef.current = false;

offerCreatedRef.current = false;

};


    // ==========================================
    // END CALL
    // ==========================================

    const endCall = async () => {

        try {

            endVideoConsultationSocket(
                appointmentId
            );


            await api.put(
                `/video-consultation/${appointmentId}/end`
            );


        } catch (err) {

            console.error(
                "End consultation error:",
                err
            );

        } 
  finally {

    leaveVideoConsultation(
        appointmentId
    );

    cleanupCall();

    disconnectVideoConsultationSocket();

    setConsultationEnded(true);

    setConnectionStatus(
        "Call ended"
    );

    // Redirect to the correct dashboard
    if (currentUserRole === "doctor") {

        navigate("/doctor-dashboard");

    } else {

        navigate("/dashboard");

    }

}

    };


    // ==========================================
    // SOCKET EVENTS
    // ==========================================

    useEffect(() => {

const handleParticipantJoined = () => {

    setIsOtherParticipantPresent(
        true
    );

    setConnectionStatus(
        "Participant joined"
    );


    // ======================================
    // ONLY DOCTOR STARTS WEBRTC NEGOTIATION
    // ======================================

    if (
        currentUserRole === "doctor"
    ) {

        console.log(
            "Doctor detected participant. Creating offer..."
        );

        createOffer();

    } else {

        console.log(
            "Patient detected participant. Waiting for doctor offer..."
        );

    }

};

        const handleConsultationJoined = (
            data
        ) => {

            console.log(
                "Joined video consultation:",
                data
            );

        };

const handleConsultationEnded = () => {

    cleanupCall();

    setConsultationEnded(true);

    setConnectionStatus(
        "Call ended"
    );

    // Redirect to the correct dashboard
    if (currentUserRole === "doctor") {

        navigate("/doctor-dashboard");

    } else {

        navigate("/dashboard");

    }

};


        const handleError = (message) => {

            setError(
                message ||
                "Video consultation error"
            );

        };


        const handleConnectError = (err) => {

            console.error(
                "Video socket error:",
                err
            );

            setError(
                "Unable to connect to video server"
            );

        };


        onVideoParticipantJoined(
            handleParticipantJoined
        );

        onVideoConsultationJoined(
            handleConsultationJoined
        );

        onVideoOffer(
            handleOffer
        );

        onVideoAnswer(
            handleAnswer
        );

        onVideoIceCandidate(
            handleIceCandidate
        );

        onVideoConsultationEnded(
            handleConsultationEnded
        );

        onVideoConsultationError(
            handleError
        );

        onVideoSocketConnectError(
            handleConnectError
        );


        startConsultation();


        return () => {

            offVideoParticipantJoined(
                handleParticipantJoined
            );

            offVideoConsultationJoined(
                handleConsultationJoined
            );

            offVideoOffer(
                handleOffer
            );

            offVideoAnswer(
                handleAnswer
            );

            offVideoIceCandidate(
                handleIceCandidate
            );

            offVideoConsultationEnded(
                handleConsultationEnded
            );

            offVideoConsultationError(
                handleError
            );

            offVideoSocketConnectError(
                handleConnectError
            );


            leaveVideoConsultation(
                appointmentId
            );

            cleanupCall();

            disconnectVideoConsultationSocket();

        };

    }, [appointmentId]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="video-call-container">

                <div className="video-loading">

                    <div className="video-loading-spinner">
                    </div>

                    <h2>
                        Starting Video Consultation
                    </h2>

                    <p>
                        Connecting camera, microphone
                        and consultation room...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (
        error &&
        !localStreamRef.current
    ) {

        return (

            <div className="video-call-container">

                <div className="video-error">

                    <div className="video-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Start Video Call
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // VIDEO CALL UI
    // ==========================================

    return (

        <div className="video-call-container">

            {/* HEADER */}

            <div className="video-call-header">

                <div>

                    <h2>
                        Video Consultation
                    </h2>

                    <p>
                        {currentUserRole === "doctor"
                            ? `Patient: ${otherParticipantName}`
                            : `Doctor: ${otherParticipantName}`
                        }
                    </p>

                </div>


                <div
                    className={
                        isConnected
                            ? "video-status connected"
                            : "video-status"
                    }
                >

                    <span>
                        ●
                    </span>

                    {connectionStatus}

                </div>

            </div>


            {/* VIDEO AREA */}

            <div className="video-call-area">

                {/* REMOTE VIDEO */}

                <video
                    ref={remoteVideoRef}
                    className="remote-video"
                    autoPlay
                    playsInline
                />


                {/* WAITING */}

                {!isOtherParticipantPresent && (

                    <div className="remote-placeholder">

                        <div className="remote-avatar">

                            {otherParticipantName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"
                            }

                        </div>

                        <h3>
                            Waiting for{" "}
                            {otherParticipantName}
                        </h3>

                        <p>
                            The other participant
                            has not joined yet.
                        </p>

                    </div>

                )}


                {/* LOCAL VIDEO */}

                <div className="local-video-wrapper">

                    <video
                        ref={localVideoRef}
                        className="local-video"
                        autoPlay
                        muted
                        playsInline
                    />


                    {isCameraOff && (

                        <div className="local-camera-off">

                            <span>
                                📷
                            </span>

                            Camera Off

                        </div>

                    )}

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="video-inline-error">

                    ⚠️ {error}

                </div>

            )}


            {/* CONTROLS */}

            <div className="video-controls">

                <button
                    className={
                        isMuted
                            ? "video-control active"
                            : "video-control"
                    }
                    onClick={toggleMute}
                >

                    {isMuted
                        ? "🔇"
                        : "🎤"
                    }

                    <span>
                        {isMuted
                            ? "Unmute"
                            : "Mute"
                        }
                    </span>

                </button>


                <button
                    className={
                        isCameraOff
                            ? "video-control active"
                            : "video-control"
                    }
                    onClick={toggleCamera}
                >

                    {isCameraOff
                        ? "📷"
                        : "📹"
                    }

                    <span>
                        {isCameraOff
                            ? "Camera On"
                            : "Camera Off"
                        }
                    </span>

                </button>


                <button
                    className="video-end-button"
                    onClick={endCall}
                >

                    ☎️

                    <span>
                        End Call
                    </span>

                </button>

            </div>


            {/* ENDED */}

            {consultationEnded && (

                <div className="video-ended-message">

                    <h3>
                        Video Consultation Ended
                    </h3>

                    <p>
                        This consultation has ended.
                    </p>

                </div>

            )}

        </div>

    );

};


export default VideoCallWindow;