const Report = require("../models/Report");
const Patient = require("../models/patient.model");
const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");

// =====================================================
// DOCTOR - CREATE REPORT
// =====================================================

const createReport = async (req, res) => {
    try {
        const {
            appointmentId,
            diagnosis,
            symptoms,
            testResults,
            prescription,
            doctorNotes
        } = req.body;

        // =========================
        // VALIDATE APPOINTMENT ID
        // =========================

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        // =========================
        // GET DOCTOR PROFILE
        // =========================

        const doctor = await Doctor.findOne({
            user: req.user._id
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found"
            });
        }

        // =========================
        // GET APPOINTMENT
        // =========================

        const appointment = await Appointment.findById(
            appointmentId
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // =========================
        // VERIFY DOCTOR
        // =========================

        if (
            appointment.doctor.toString() !==
            doctor._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only create reports for your own appointments"
            });
        }

        // =========================
        // ONLY COMPLETED APPOINTMENT
        // =========================

        if (appointment.status !== "completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Report can only be created for a completed appointment"
            });
        }

        // =========================
        // CHECK EXISTING REPORT
        // =========================

        const existingReport = await Report.findOne({
            appointment: appointment._id
        });

        if (existingReport) {
            return res.status(400).json({
                success: false,
                message:
                    "A report already exists for this appointment"
            });
        }

        // =========================
        // CREATE REPORT
        // =========================

        const report = await Report.create({
            patient: appointment.patient,
            doctor: appointment.doctor,
            appointment: appointment._id,
            diagnosis: diagnosis || "",
            symptoms: symptoms || "",
            testResults: testResults || "",
            prescription: prescription || "",
            doctorNotes: doctorNotes || ""
        });

        // =========================
        // RETURN REPORT
        // =========================

        const populatedReport =
            await Report.findById(report._id)
                .populate({
                    path: "patient",
                    populate: {
                        path: "user",
                        select: "name email phone"
                    }
                })
                .populate({
                    path: "doctor",
                    populate: {
                        path: "user",
                        select: "name email phone"
                    }
                })
                .populate("appointment");

        return res.status(201).json({
            success: true,
            message: "Patient report created successfully",
            report: populatedReport
        });

    } catch (error) {
        console.error(
            "Create report error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create report",
            error: error.message
        });
    }
};


// =====================================================
// DOCTOR - GET OWN REPORTS
// =====================================================

const getDoctorReports = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            user: req.user._id
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found"
            });
        }

        const reports = await Report.find({
            doctor: doctor._id
        })
            .populate({
                path: "patient",
                populate: {
                    path: "user",
                    select: "name email phone"
                }
            })
            .populate("appointment")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            reports
        });

    } catch (error) {
        console.error(
            "Get doctor reports error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get doctor reports",
            error: error.message
        });
    }
};


// =====================================================
// PATIENT - GET OWN REPORTS
// =====================================================

const getPatientReports = async (req, res) => {
    try {
        // =========================
        // GET PATIENT PROFILE
        // =========================

        const patient = await Patient.findOne({
            user: req.user._id
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient profile not found"
            });
        }

        // =========================
        // GET REPORTS
        // =========================

        const reports = await Report.find({
            patient: patient._id
        })
            .populate({
                path: "doctor",
                populate: {
                    path: "user",
                    select: "name email phone"
                }
            })
            .populate("appointment")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            reports
        });

    } catch (error) {
        console.error(
            "Get patient reports error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get patient reports",
            error: error.message
        });
    }
};


// =====================================================
// PATIENT - GET SINGLE REPORT
// =====================================================

const getPatientReportById = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            user: req.user._id
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient profile not found"
            });
        }

        const report = await Report.findOne({
            _id: req.params.id,
            patient: patient._id
        })
            .populate({
                path: "patient",
                populate: {
                    path: "user",
                    select: "name email phone"
                }
            })
            .populate({
                path: "doctor",
                populate: {
                    path: "user",
                    select: "name email phone"
                }
            })
            .populate("appointment");

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        return res.status(200).json({
            success: true,
            report
        });

    } catch (error) {
        console.error(
            "Get patient report error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get report",
            error: error.message
        });
    }
};


module.exports = {
    createReport,
    getDoctorReports,
    getPatientReports,
    getPatientReportById
};