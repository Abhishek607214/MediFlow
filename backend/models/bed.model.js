const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
    {
        bedNumber: {
            type: String,
            required: true,
            trim: true
        },

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        status: {
            type: String,
            enum: [
                "available",
                "occupied",
                "maintenance",
                "reserved"
            ],
            default: "available"
        },

        currentPatient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            default: null
        },

        notes: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

bedSchema.index(
    { room: 1, bedNumber: 1 },
    { unique: true }
);

module.exports = mongoose.model("Bed", bedSchema);