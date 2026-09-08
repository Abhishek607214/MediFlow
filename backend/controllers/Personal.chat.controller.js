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
// GET CHAT MESSAGES
// ==========================================

const getChatMessages = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment =
            await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }


        // Find logged-in patient
        const patient =
            await Patient.findOne({
                user: req.user._id
            });


        // Find logged-in doctor
        const doctor =
            await Doctor.findOne({
                user: req.user._id
            });


        const isPatient =
            patient &&
            appointment.patient.toString() ===
                patient._id.toString();


        const isDoctor =
            doctor &&
            appointment.doctor.toString() ===
                doctor._id.toString();


        // Only appointment participants
        // can access the chat
        if (!isPatient && !isDoctor) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not part of this consultation"
            });
        }


        // Chat allowed only for confirmed
        // or completed appointments
        if (
            appointment.status !== "confirmed" &&
            appointment.status !== "completed"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Chat is available only for confirmed or completed appointments"
            });
        }


        const messages =
            await PersonalChatMessage.find({
                appointment: appointmentId
            })
            .populate(
                "sender",
                "name email role"
            )
            .populate(
                "receiver",
                "name email role"
            )
            .sort({
                createdAt: 1
            });


        return res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {

        console.error(
            "Get personal chat messages error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// SEND CHAT MESSAGE
// ==========================================

const sendChatMessage = async (req, res) => {
    try {

        const { appointmentId } = req.params;

        const { message } = req.body;


        // Validate message
        if (
            !message ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }


        const appointment =
            await Appointment.findById(
                appointmentId
            );


        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }


        // Only confirmed or completed
        // appointments can use chat
        if (
            appointment.status !== "confirmed" &&
            appointment.status !== "completed"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Chat is available only for confirmed or completed appointments"
            });
        }


        const patient =
            await Patient.findOne({
                user: req.user._id
            });


        const doctor =
            await Doctor.findOne({
                user: req.user._id
            });


        let patientProfile = null;

        let doctorProfile = null;

        let receiver = null;


        // ======================================
        // PATIENT SENDING MESSAGE
        // ======================================

        if (patient) {

            if (
                appointment.patient.toString() !==
                patient._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You are not part of this consultation"
                });
            }


            patientProfile = patient;


            doctorProfile =
                await Doctor.findById(
                    appointment.doctor
                );


            if (!doctorProfile) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Doctor profile not found"
                });
            }


            receiver =
                await User.findById(
                    doctorProfile.user
                );
        }


        // ======================================
        // DOCTOR SENDING MESSAGE
        // ======================================

        else if (doctor) {

            if (
                appointment.doctor.toString() !==
                doctor._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You are not part of this consultation"
                });
            }


            doctorProfile = doctor;


            patientProfile =
                await Patient.findById(
                    appointment.patient
                );


            if (!patientProfile) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Patient profile not found"
                });
            }


            receiver =
                await User.findById(
                    patientProfile.user
                );
        }


        // ======================================
        // INVALID ROLE
        // ======================================

        else {

            return res.status(403).json({
                success: false,
                message:
                    "Only patients and doctors can use personal consultation chat"
            });
        }


        if (!receiver) {
            return res.status(404).json({
                success: false,
                message:
                    "Receiver account not found"
            });
        }


        // ======================================
        // CREATE MESSAGE
        // ======================================

        const chatMessage =
            await PersonalChatMessage.create({

                appointment:
                    appointment._id,

                patient:
                    patientProfile._id,

                doctor:
                    doctorProfile._id,

                sender:
                    req.user._id,

                receiver:
                    receiver._id,

                message:
                    message.trim()
            });


        // Get populated message
        const populatedMessage =
            await PersonalChatMessage.findById(
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


        return res.status(201).json({
            success: true,
            message:
                "Message sent successfully",
            chatMessage:
                populatedMessage
        });


    } catch (error) {

        console.error(
            "Send personal chat message error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// MARK MESSAGES AS READ
// ==========================================

const markMessagesAsRead = async (
    req,
    res
) => {

    try {

        const { appointmentId } =
            req.params;


        const appointment =
            await Appointment.findById(
                appointmentId
            );


        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }


        const patient =
            await Patient.findOne({
                user: req.user._id
            });


        const doctor =
            await Doctor.findOne({
                user: req.user._id
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
            return res.status(403).json({
                success: false,
                message:
                    "You are not part of this consultation"
            });
        }


        await PersonalChatMessage.updateMany(
            {
                appointment:
                    appointmentId,

                receiver:
                    req.user._id,

                read: false
            },
            {
                $set: {
                    read: true
                }
            }
        );


        return res.status(200).json({
            success: true,
            message:
                "Messages marked as read"
        });


    } catch (error) {

        console.error(
            "Mark personal chat messages error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getChatMessages,

    sendChatMessage,

    markMessagesAsRead

};