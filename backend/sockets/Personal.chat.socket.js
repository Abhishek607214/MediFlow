const jwt = require("jsonwebtoken");

const PersonalChatMessage = require(
    "../models/Personal.chatMessage.model"
);

const Appointment = require(
    "../models/appointment.model"
);

const Patient = require(
    "../models/patient.model"
);

const Doctor = require(
    "../models/doctor.model"
);

const User = require(
    "../models/user.model"
);


// ==========================================
// GET TOKEN FROM SOCKET COOKIE
// ==========================================

const getTokenFromCookie = (cookieHeader) => {

    if (!cookieHeader) {
        return null;
    }

    const tokenCookie = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) =>
            cookie.startsWith("token=")
        );

    if (!tokenCookie) {
        return null;
    }

    return tokenCookie.substring(
        "token=".length
    );
};


// ==========================================
// PERSONAL CHAT SOCKET
// ==========================================

const setupPersonalChatSocket = (io) => {

    // ======================================
    // SOCKET AUTHENTICATION
    // ======================================

    io.use(async (socket, next) => {

        try {

            const cookieHeader =
                socket.handshake.headers.cookie;

            const token =
                getTokenFromCookie(cookieHeader);


            if (!token) {

                return next(
                    new Error(
                        "Not authenticated"
                    )
                );
            }


            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );


            const user =
                await User.findById(
                    decoded.userId
                ).select("-password");


            if (!user) {

                return next(
                    new Error(
                        "User not found"
                    )
                );
            }


            if (!user.isActive) {

                return next(
                    new Error(
                        "Account is deactivated"
                    )
                );
            }


            if (
                user.role !== "patient" &&
                user.role !== "doctor"
            ) {

                return next(
                    new Error(
                        "Only patients and doctors can use personal chat"
                    )
                );
            }


            socket.user = user;

            next();


        } catch (error) {

            console.error(
                "Socket authentication error:",
                error.message
            );

            next(
                new Error(
                    "Invalid or expired token"
                )
            );
        }
    });


    // ======================================
    // CONNECTION
    // ======================================

    io.on("connection", (socket) => {

        console.log(
            "Personal chat connected:",
            socket.user.name,
            socket.user.role
        );


        // ==================================
        // JOIN APPOINTMENT CHAT
        // ==================================

        socket.on(
            "join_personal_chat",
            async (appointmentId) => {

                try {

                    const appointment =
                        await Appointment.findById(
                            appointmentId
                        );


                    if (!appointment) {

                        socket.emit(
                            "personal_chat_error",
                            "Appointment not found"
                        );

                        return;
                    }


                    // --------------------------
                    // Find user profile
                    // --------------------------

                    const patient =
                        await Patient.findOne({
                            user: socket.user._id
                        });


                    const doctor =
                        await Doctor.findOne({
                            user: socket.user._id
                        });


                    const isPatient =
                        patient &&
                        appointment.patient
                            .toString() ===
                        patient._id.toString();


                    const isDoctor =
                        doctor &&
                        appointment.doctor
                            .toString() ===
                        doctor._id.toString();


                    // --------------------------
                    // Check participant
                    // --------------------------

                    if (
                        !isPatient &&
                        !isDoctor
                    ) {

                        socket.emit(
                            "personal_chat_error",
                            "You are not part of this consultation"
                        );

                        return;
                    }


                    // --------------------------
                    // Check appointment status
                    // --------------------------

                    if (
                        appointment.status !==
                            "confirmed" &&
                        appointment.status !==
                            "completed"
                    ) {

                        socket.emit(
                            "personal_chat_error",
                            "Chat is available only for confirmed or completed appointments"
                        );

                        return;
                    }


                    // --------------------------
                    // Join room
                    // --------------------------

                    const room =
                        `personal-chat-${appointmentId}`;


                    socket.join(room);


                    socket.currentChatRoom =
                        room;


                    socket.currentAppointmentId =
                        appointmentId;


                    console.log(
                        `${socket.user.name} joined ${room}`
                    );


                    socket.emit(
                        "personal_chat_joined",
                        {
                            appointmentId
                        }
                    );


                } catch (error) {

                    console.error(
                        "Join personal chat error:",
                        error
                    );


                    socket.emit(
                        "personal_chat_error",
                        "Unable to join chat"
                    );
                }
            }
        );


        // ==================================
        // SEND REAL-TIME MESSAGE
        // ==================================

        socket.on(
            "send_personal_message",
            async (data) => {

                try {

                    const {
                        appointmentId,
                        message
                    } = data;


                    // --------------------------
                    // Validate message
                    // --------------------------

                    if (
                        !message ||
                        !message.trim()
                    ) {

                        socket.emit(
                            "personal_chat_error",
                            "Message is required"
                        );

                        return;
                    }


                    // --------------------------
                    // Find appointment
                    // --------------------------

                    const appointment =
                        await Appointment.findById(
                            appointmentId
                        );


                    if (!appointment) {

                        socket.emit(
                            "personal_chat_error",
                            "Appointment not found"
                        );

                        return;
                    }


                    // --------------------------
                    // Appointment status
                    // --------------------------

                    if (
                        appointment.status !==
                            "confirmed" &&
                        appointment.status !==
                            "completed"
                    ) {

                        socket.emit(
                            "personal_chat_error",
                            "Chat is available only for confirmed or completed appointments"
                        );

                        return;
                    }


                    // --------------------------
                    // Find profiles
                    // --------------------------

                    const patient =
                        await Patient.findOne({
                            user: socket.user._id
                        });


                    const doctor =
                        await Doctor.findOne({
                            user: socket.user._id
                        });


                    let patientProfile =
                        null;

                    let doctorProfile =
                        null;

                    let receiver =
                        null;


                    // --------------------------
                    // Patient sending
                    // --------------------------

                    if (patient) {

                        if (
                            appointment.patient
                                .toString() !==
                            patient._id.toString()
                        ) {

                            socket.emit(
                                "personal_chat_error",
                                "You are not part of this consultation"
                            );

                            return;
                        }


                        patientProfile =
                            patient;


                        doctorProfile =
                            await Doctor.findById(
                                appointment.doctor
                            );


                        if (!doctorProfile) {

                            socket.emit(
                                "personal_chat_error",
                                "Doctor profile not found"
                            );

                            return;
                        }


                        receiver =
                            await User.findById(
                                doctorProfile.user
                            );
                    }


                    // --------------------------
                    // Doctor sending
                    // --------------------------

                    else if (doctor) {

                        if (
                            appointment.doctor
                                .toString() !==
                            doctor._id.toString()
                        ) {

                            socket.emit(
                                "personal_chat_error",
                                "You are not part of this consultation"
                            );

                            return;
                        }


                        doctorProfile =
                            doctor;


                        patientProfile =
                            await Patient.findById(
                                appointment.patient
                            );


                        if (!patientProfile) {

                            socket.emit(
                                "personal_chat_error",
                                "Patient profile not found"
                            );

                            return;
                        }


                        receiver =
                            await User.findById(
                                patientProfile.user
                            );
                    }


                    else {

                        socket.emit(
                            "personal_chat_error",
                            "Only patients and doctors can use personal chat"
                        );

                        return;
                    }


                    // --------------------------
                    // Receiver validation
                    // --------------------------

                    if (!receiver) {

                        socket.emit(
                            "personal_chat_error",
                            "Receiver account not found"
                        );

                        return;
                    }


                    // --------------------------
                    // Save message
                    // --------------------------

                    const chatMessage =
                        await PersonalChatMessage.create({

                            appointment:
                                appointment._id,

                            patient:
                                patientProfile._id,

                            doctor:
                                doctorProfile._id,

                            sender:
                                socket.user._id,

                            receiver:
                                receiver._id,

                            message:
                                message.trim()
                        });


                    // --------------------------
                    // Populate message
                    // --------------------------

                    const populatedMessage =
                        await PersonalChatMessage
                            .findById(
                                chatMessage._id
                            )
                            .populate(
                                "sender",
                                "name email role"
                            )
                            .populate(
                                "receiver",
                                "name email role"
                            );


                    // --------------------------
                    // Room
                    // --------------------------

                    const room =
                        `personal-chat-${appointmentId}`;


                    // --------------------------
                    // Send to everyone in room
                    // --------------------------

                    io.to(room).emit(
                        "personal_message_received",
                        populatedMessage
                    );


                } catch (error) {

                    console.error(
                        "Send real-time personal message error:",
                        error
                    );


                    socket.emit(
                        "personal_chat_error",
                        "Unable to send message"
                    );
                }
            }
        );


        // ==================================
        // LEAVE CHAT
        // ==================================

        socket.on(
            "leave_personal_chat",
            (appointmentId) => {

                const room =
                    `personal-chat-${appointmentId}`;

                socket.leave(room);

                console.log(
                    `${socket.user.name} left ${room}`
                );
            }
        );


        // ==================================
        // DISCONNECT
        // ==================================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Personal chat disconnected:",
                    socket.user.name
                );
            }
        );
    });
};


module.exports = setupPersonalChatSocket;