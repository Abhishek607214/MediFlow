import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import {
    getPersonalChatMessages,
    sendPersonalChatMessage,
    markPersonalChatMessagesAsRead
} from "../services/Personal.chat.service";

import {
    connectPersonalChatSocket,
    disconnectPersonalChatSocket,
    joinPersonalChat,
    leavePersonalChat,
    sendPersonalMessageSocket,
    onPersonalMessageReceived,
    offPersonalMessageReceived,
    onPersonalChatError,
    offPersonalChatError,
    onPersonalSocketConnectError,
    offPersonalSocketConnectError,
    getPersonalChatSocket
} from "../services/Personal.chat.socket";

import "../styles/Personal.chat.css";


const PersonalChatWindow = ({
    appointmentId,
    currentUserId,
    participantName = "User",
    participantRole = ""
}) => {

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [sending, setSending] =
        useState(false);

    const [error, setError] =
        useState("");

    const messagesEndRef =
        useRef(null);


    // ==========================================
    // SCROLL TO BOTTOM
    // ==========================================

    const scrollToBottom = () => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };


    // ==========================================
    // LOAD CHAT HISTORY
    // ==========================================

    const loadMessages = useCallback(
        async () => {

            if (!appointmentId) {
                return;
            }

            try {

                const data =
                    await getPersonalChatMessages(
                        appointmentId
                    );

                setMessages(
                    data.messages || []
                );

                setError("");


                await markPersonalChatMessagesAsRead(
                    appointmentId
                );


            } catch (error) {

                console.error(
                    "Load personal chat error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load chat messages"
                );

            } finally {

                setLoading(false);
            }

        },
        [appointmentId]
    );


    // ==========================================
    // INITIAL CHAT LOAD
    // ==========================================

    useEffect(() => {

        loadMessages();

    }, [loadMessages]);


    // ==========================================
    // SOCKET.IO CONNECTION
    // ==========================================

    useEffect(() => {

        if (!appointmentId) {
            return;
        }


        const socket =
            connectPersonalChatSocket();


        // -------------------------------
        // Join appointment room
        // -------------------------------

        const joinRoom = () => {

            joinPersonalChat(
                appointmentId
            );
        };


        if (socket.connected) {

            joinRoom();

        } else {

            socket.once(
                "connect",
                joinRoom
            );
        }


        // ==================================
        // RECEIVE NEW MESSAGE
        // ==================================

        const handleNewMessage = async (
            newMessage
        ) => {

            // Make sure this message belongs
            // to the current appointment
            const messageAppointmentId =
                newMessage.appointment?._id ||
                newMessage.appointment;


            if (
                messageAppointmentId?.toString() !==
                appointmentId?.toString()
            ) {
                return;
            }


            setMessages((previousMessages) => {

                // Prevent duplicate messages
                const alreadyExists =
                    previousMessages.some(
                        (item) =>
                            item._id ===
                            newMessage._id
                    );


                if (alreadyExists) {
                    return previousMessages;
                }


                return [
                    ...previousMessages,
                    newMessage
                ];
            });


            // If the incoming message belongs
            // to another user, mark it as read
            const senderId =
                newMessage.sender?._id ||
                newMessage.sender;


            if (
                senderId?.toString() !==
                currentUserId?.toString()
            ) {

                try {

                    await markPersonalChatMessagesAsRead(
                        appointmentId
                    );

                } catch (error) {

                    console.error(
                        "Mark message as read error:",
                        error
                    );
                }
            }
        };


        // ==================================
        // CHAT ERROR
        // ==================================

        const handleChatError = (
            socketError
        ) => {

            console.error(
                "Personal chat socket error:",
                socketError
            );

            setError(
                typeof socketError === "string"
                    ? socketError
                    : "Personal chat error"
            );
        };


        // ==================================
        // SOCKET CONNECTION ERROR
        // ==================================

        const handleSocketError = (
            socketError
        ) => {

            console.error(
                "Personal chat connection error:",
                socketError
            );

            setError(
                "Real-time chat connection failed"
            );
        };


        // Register listeners
        onPersonalMessageReceived(
            handleNewMessage
        );

        onPersonalChatError(
            handleChatError
        );

        onPersonalSocketConnectError(
            handleSocketError
        );


        // ==================================
        // CLEANUP
        // ==================================

        return () => {

            socket.off(
                "connect",
                joinRoom
            );


            leavePersonalChat(
                appointmentId
            );


            offPersonalMessageReceived(
                handleNewMessage
            );

            offPersonalChatError(
                handleChatError
            );

            offPersonalSocketConnectError(
                handleSocketError
            );


            disconnectPersonalChatSocket();
        };

    }, [
        appointmentId,
        currentUserId
    ]);


    // ==========================================
    // SCROLL WHEN MESSAGES CHANGE
    // ==========================================

    useEffect(() => {

        scrollToBottom();

    }, [messages]);


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const handleSendMessage = async (
        event
    ) => {

        event.preventDefault();


        const trimmedMessage =
            message.trim();


        if (!trimmedMessage) {
            return;
        }


        if (!appointmentId) {
            return;
        }


        try {

            setSending(true);

            setError("");


            const socket =
                getPersonalChatSocket();


            // ==================================
            // SOCKET.IO SEND
            // ==================================

            if (socket.connected) {

                sendPersonalMessageSocket(
                    appointmentId,
                    trimmedMessage
                );

            }

            // ==================================
            // FALLBACK TO REST API
            // ==================================

            else {

                const data =
                    await sendPersonalChatMessage(
                        appointmentId,
                        trimmedMessage
                    );


                if (data.chatMessage) {

                    setMessages(
                        (previousMessages) => {

                            const alreadyExists =
                                previousMessages.some(
                                    (item) =>
                                        item._id ===
                                        data.chatMessage._id
                                );


                            if (alreadyExists) {
                                return previousMessages;
                            }


                            return [
                                ...previousMessages,
                                data.chatMessage
                            ];
                        }
                    );
                }
            }


            setMessage("");


        } catch (error) {

            console.error(
                "Send personal chat error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to send message"
            );

        } finally {

            setSending(false);
        }
    };


    // ==========================================
    // SEND WITH ENTER
    // ==========================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSendMessage(event);
        }
    };


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (date) => {

        if (!date) {
            return "";
        }


        return new Date(
            date
        ).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="personal-chat-window">

                <div className="personal-chat-loading">
                    Loading conversation...
                </div>

            </div>
        );
    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="personal-chat-window">


            {/* ================================= */}
            {/* CHAT HEADER */}
            {/* ================================= */}

            <div className="personal-chat-header">

                <div className="personal-chat-user">

                    <div className="personal-chat-avatar">

                        {participantName
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>


                    <div>

                        <h3>
                            {participantName}
                        </h3>


                        {participantRole && (

                            <span>
                                {participantRole}
                            </span>

                        )}

                    </div>

                </div>


                <div className="personal-chat-status">
                    ● Consultation Chat
                </div>

            </div>


            {/* ================================= */}
            {/* ERROR */}
            {/* ================================= */}

            {error && (

                <div className="personal-chat-error">
                    {error}
                </div>

            )}


            {/* ================================= */}
            {/* MESSAGES */}
            {/* ================================= */}

            <div className="personal-chat-messages">

                {messages.length === 0 ? (

                    <div className="personal-chat-empty">

                        <div className="personal-chat-empty-icon">
                            💬
                        </div>


                        <h3>
                            No messages yet
                        </h3>


                        <p>
                            Start the conversation with{" "}
                            {participantName}.
                        </p>

                    </div>

                ) : (

                    messages.map(
                        (chatMessage) => {

                            const senderId =
                                chatMessage.sender?._id ||
                                chatMessage.sender;


                            const isMine =
                                currentUserId &&
                                senderId?.toString() ===
                                currentUserId?.toString();


                            return (

                                <div
                                    key={
                                        chatMessage._id
                                    }
                                    className={
                                        isMine
                                            ? "personal-message-row personal-message-own"
                                            : "personal-message-row personal-message-other"
                                    }
                                >

                                    <div className="personal-message-bubble">

                                        <div className="personal-message-text">

                                            {chatMessage.message}

                                        </div>


                                        <div className="personal-message-time">

                                            {formatTime(
                                                chatMessage.createdAt
                                            )}


                                            {isMine && (

                                                <span className="personal-message-read">

                                                    {chatMessage.read
                                                        ? " ✓✓"
                                                        : " ✓"}

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )

                )}


                <div
                    ref={messagesEndRef}
                />

            </div>


            {/* ================================= */}
            {/* MESSAGE INPUT */}
            {/* ================================= */}

            <form
                className="personal-chat-input-area"
                onSubmit={handleSendMessage}
            >

                <textarea
                    value={message}
                    onChange={(event) =>
                        setMessage(
                            event.target.value
                        )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    maxLength={2000}
                    rows={1}
                    disabled={sending}
                />


                <button
                    type="submit"
                    disabled={
                        sending ||
                        !message.trim()
                    }
                >

                    {sending
                        ? "Sending..."
                        : "Send"}

                </button>

            </form>

        </div>
    );
};


export default PersonalChatWindow;