const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        // =========================
        // PATIENT
        // =========================
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        // =========================
        // DOCTOR
        // =========================
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },

        // =========================
        // APPOINTMENT
        // =========================
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true
        },

        // =========================
        // REPORT INFORMATION
        // =========================
        diagnosis: {
            type: String,
            default: "",
            trim: true
        },

        symptoms: {
            type: String,
            default: "",
            trim: true
        },

        testResults: {
            type: String,
            default: "",
            trim: true
        },

        prescription: {
            type: String,
            default: "",
            trim: true
        },

        doctorNotes: {
            type: String,
            default: "",
            trim: true
        },

        // =========================
        // REPORT DATE
        // =========================
        reportDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Report", reportSchema);