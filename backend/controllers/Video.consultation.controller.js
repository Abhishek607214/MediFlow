const VideoConsultation = require(
    "../models/Video.consultation.model"
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


// ==========================================
// GET VIDEO CONSULTATION
// ==========================================

const getVideoConsultation = async (req, res) => {

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


        // ======================================
        // FIND LOGGED-IN USER PROFILE
        // ======================================

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


        // ======================================
        // ONLY APPOINTMENT PARTICIPANTS
        // ======================================

        if (!isPatient && !isDoctor) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not part of this consultation"
            });
        }


        // ======================================
        // VIDEO ONLY FOR CONFIRMED APPOINTMENTS
        // ======================================

        if (
            appointment.status !==
            "confirmed"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Video consultation is available only for confirmed appointments"
            });
        }


        // ======================================
        // FIND VIDEO SESSION
        // ======================================

        let consultation =
            await VideoConsultation.findOne({
                appointment: appointmentId
            });


        // ======================================
        // CREATE SESSION IF NOT EXISTS
        // ======================================

        if (!consultation) {

            consultation =
                await VideoConsultation.create({

                    appointment:
                        appointment._id,

                    patient:
                        appointment.patient,

                    doctor:
                        appointment.doctor,

                    status:
                        "waiting"
                });
        }


        return res.status(200).json({

            success: true,

            consultation

        });


    } catch (error) {

        console.error(
            "Get video consultation error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Server error"
        });
    }
};


// ==========================================
// START VIDEO CONSULTATION
// ==========================================

const startVideoConsultation = async (
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


        // ======================================
        // FIND DOCTOR
        // ======================================

        const doctor =
            await Doctor.findOne({
                user: req.user._id
            });


        if (!doctor) {

            return res.status(403).json({
                success: false,
                message:
                    "Only the assigned doctor can start the consultation"
            });
        }


        // ======================================
        // VERIFY ASSIGNED DOCTOR
        // ======================================

        if (
            appointment.doctor.toString() !==
            doctor._id.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not the doctor assigned to this appointment"
            });
        }


        // ======================================
        // CHECK APPOINTMENT STATUS
        // ======================================

        if (
            appointment.status !==
            "confirmed"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Video consultation can only start for confirmed appointments"
            });
        }


        // ======================================
        // FIND OR CREATE SESSION
        // ======================================

        let consultation =
            await VideoConsultation.findOne({
                appointment: appointmentId
            });


        if (!consultation) {

            consultation =
                await VideoConsultation.create({

                    appointment:
                        appointment._id,

                    patient:
                        appointment.patient,

                    doctor:
                        appointment.doctor,

                    status:
                        "waiting"
                });
        }


        // ======================================
        // START SESSION
        // ======================================

        if (
            consultation.status !==
            "active"
        ) {

            consultation.status =
                "active";

            consultation.startedAt =
                new Date();

            consultation.endedAt =
                null;

            await consultation.save();
        }


        return res.status(200).json({

            success: true,

            message:
                "Video consultation started",

            consultation
        });


    } catch (error) {

        console.error(
            "Start video consultation error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Server error"
        });
    }
};


// ==========================================
// END VIDEO CONSULTATION
// ==========================================

const endVideoConsultation = async (
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


        // ======================================
        // VERIFY PARTICIPANT
        // ======================================

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


        // ======================================
        // FIND SESSION
        // ======================================

        const consultation =
            await VideoConsultation.findOne({
                appointment: appointmentId
            });


        if (!consultation) {

            return res.status(404).json({
                success: false,
                message:
                    "Video consultation not found"
            });
        }


        // ======================================
        // END SESSION
        // ======================================

        consultation.status =
            "completed";

        consultation.endedAt =
            new Date();


        await consultation.save();


        return res.status(200).json({

            success: true,

            message:
                "Video consultation ended",

            consultation
        });


    } catch (error) {

        console.error(
            "End video consultation error:",
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

    getVideoConsultation,

    startVideoConsultation,

    endVideoConsultation

};