const jwt = require("jsonwebtoken");

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

const VideoConsultation = require(
    "../models/Video.consultation.model"
);


// ==========================================
// GET TOKEN FROM COOKIE
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
// VERIFY APPOINTMENT PARTICIPANT
// ==========================================

const verifyParticipant = async (
    user,
    appointmentId
) => {

    const appointment =
        await Appointment.findById(
            appointmentId
        );

    if (!appointment) {
        return {
            success: false,
            message: "Appointment not found"
        };
    }


    // Video consultation only for confirmed
    // appointments

    if (
        appointment.status !==
        "confirmed"
    ) {
        return {
            success: false,
            message:
                "Video consultation is available only for confirmed appointments"
        };
    }


    const patient =
        await Patient.findOne({
            user: user._id
        });


    const doctor =
        await Doctor.findOne({
            user: user._id
        });


    const isPatient =
        patient &&
        appointment.patient.toString() ===
            patient._id.toString();


    const isDoctor =
        doctor &&
        appointment.doctor.toString() ===
            doctor._id.toString();


    if (!isPatient && !isDoctor) {
        return {
            success: false,
            message:
                "You are not part of this consultation"
        };
    }


    return {
        success: true,
        appointment,
        isPatient,
        isDoctor
    };
};


// ==========================================
// SETUP VIDEO CONSULTATION SOCKET
// ==========================================

const setupVideoConsultationSocket = (
    io
) => {


    // ======================================
    // SOCKET AUTHENTICATION
    // ======================================

    io.use(async (socket, next) => {

        try {

            const cookieHeader =
                socket.handshake.headers.cookie;


            const token =
                getTokenFromCookie(
                    cookieHeader
                );


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
                        "Only patients and doctors can use video consultation"
                    )
                );
            }


            socket.user = user;

            next();


        } catch (error) {

            console.error(
                "Video socket authentication error:",
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
    // NEW CONNECTION
    // ======================================

    io.on(
        "connection",
        (socket) => {


            console.log(
                "Video consultation connected:",
                socket.user.name,
                socket.user.role
            );


            // ==================================
            // JOIN VIDEO CONSULTATION
            // ==================================

            socket.on(
                "join_video_consultation",
                async (appointmentId) => {

                    try {

                        const result =
                            await verifyParticipant(
                                socket.user,
                                appointmentId
                            );


                        if (!result.success) {

                            socket.emit(
                                "video_consultation_error",
                                result.message
                            );

                            return;
                        }


                        const room =
                            `video-consultation-${appointmentId}`;


                        // Check existing consultation

                        let consultation =
                            await VideoConsultation.findOne({
                                appointment:
                                    appointmentId
                            });


                        if (!consultation) {

                            consultation =
                                await VideoConsultation.create({

                                    appointment:
                                        appointmentId,

                                    patient:
                                        result.appointment.patient,

                                    doctor:
                                        result.appointment.doctor,

                                    status:
                                        "waiting"
                                });
                        }


                        socket.join(room);


                        socket.videoRoom =
                            room;

                        socket.videoAppointmentId =
                            appointmentId;


                        // Get number of users
                        // already inside room

                        const roomSockets =
                            await io
                                .in(room)
                                .fetchSockets();


                        const participantCount =
                            roomSockets.length;


                        console.log(
                            `${socket.user.name} joined video room ${room}`
                        );


                        socket.emit(
                            "video_consultation_joined",
                            {
                                appointmentId,

                                participantCount
                            }
                        );


                        // Tell existing participant
                        // that another participant
                        // has joined
io.to(room).emit(
    "video_participant_joined",
    {
        userId:
            socket.user._id.toString(),

        name:
            socket.user.name,

        role:
            socket.user.role
    }
);


                    } catch (error) {

                        console.error(
                            "Join video consultation error:",
                            error
                        );


                        socket.emit(
                            "video_consultation_error",
                            "Unable to join video consultation"
                        );
                    }

                }
            );


            // ==================================
            // WEBRTC OFFER
            // ==================================

            socket.on(
                "video_offer",
                ({
                    appointmentId,
                    offer
                }) => {

                    const room =
                        `video-consultation-${appointmentId}`;


                    socket.to(room).emit(
                        "video_offer",
                        {
                            offer,

                            fromUserId:
                                socket.user._id.toString()
                        }
                    );

                }
            );


            // ==================================
            // WEBRTC ANSWER
            // ==================================

            socket.on(
                "video_answer",
                ({
                    appointmentId,
                    answer
                }) => {

                    const room =
                        `video-consultation-${appointmentId}`;


                    socket.to(room).emit(
                        "video_answer",
                        {
                            answer,

                            fromUserId:
                                socket.user._id.toString()
                        }
                    );

                }
            );


            // ==================================
            // ICE CANDIDATE
            // ==================================

            socket.on(
                "video_ice_candidate",
                ({
                    appointmentId,
                    candidate
                }) => {

                    const room =
                        `video-consultation-${appointmentId}`;


                    socket.to(room).emit(
                        "video_ice_candidate",
                        {
                            candidate,

                            fromUserId:
                                socket.user._id.toString()
                        }
                    );

                }
            );


            // ==================================
            // END VIDEO CONSULTATION
            // ==================================

            socket.on(
                "end_video_consultation",
                async (appointmentId) => {

                    try {

                        const result =
                            await verifyParticipant(
                                socket.user,
                                appointmentId
                            );


                        if (!result.success) {

                            socket.emit(
                                "video_consultation_error",
                                result.message
                            );

                            return;
                        }


                        const consultation =
                            await VideoConsultation.findOne({
                                appointment:
                                    appointmentId
                            });


                        if (consultation) {

                            consultation.status =
                                "completed";

                            consultation.endedAt =
                                new Date();

                            await consultation.save();
                        }


                        const room =
                            `video-consultation-${appointmentId}`;


                        io.to(room).emit(
                            "video_consultation_ended",
                            {
                                appointmentId,

                                endedBy:
                                    socket.user.name
                            }
                        );


                    } catch (error) {

                        console.error(
                            "End video consultation socket error:",
                            error
                        );


                        socket.emit(
                            "video_consultation_error",
                            "Unable to end video consultation"
                        );
                    }

                }
            );


            // ==================================
            // LEAVE ROOM
            // ==================================

            socket.on(
                "leave_video_consultation",
                (appointmentId) => {

                    const room =
                        `video-consultation-${appointmentId}`;


                    socket.leave(room);


                    console.log(
                        `${socket.user.name} left video room`
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
                        "Video consultation disconnected:",
                        socket.user.name
                    );
                }
            );

        }
    );
};


module.exports =
    setupVideoConsultationSocket;