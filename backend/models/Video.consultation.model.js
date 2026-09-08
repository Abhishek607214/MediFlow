const mongoose = require("mongoose");

const videoConsultationSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },

        status: {
            type: String,
            enum: [
                "waiting",
                "active",
                "completed",
                "cancelled"
            ],
            default: "waiting"
        },

        startedAt: {
            type: Date,
            default: null
        },

        endedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

videoConsultationSchema.index({
    appointment: 1
});

module.exports = mongoose.model(
    "VideoConsultation",
    videoConsultationSchema
);