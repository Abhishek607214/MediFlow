const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // =========================
        // DEPARTMENT
        // =========================
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null,
        },

        specialization: {
            type: String,
            required: true,
            trim: true,
        },

        qualification: {
            type: String,
            default: "",
            trim: true,
        },

        experience: {
            type: Number,
            default: 0,
            min: 0,
        },

        hospital: {
            type: String,
            default: "",
            trim: true,
        },

        clinicAddress: {
            type: String,
            default: "",
            trim: true,
        },

        city: {
            type: String,
            default: "",
            trim: true,
        },

        consultationFee: {
            type: Number,
            default: 0,
            min: 0,
        },

        phone: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        availableDays: {
            type: [String],
            default: [],
        },

        availableTime: {
            start: {
                type: String,
                default: "",
            },

            end: {
                type: String,
                default: "",
            },
        },
    },
    {
        timestamps: true,
    }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;