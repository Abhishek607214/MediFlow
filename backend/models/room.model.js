const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        roomType: {
            type: String,
            enum: ["ICU", "General", "Private"],
            required: true
        },

        floor: {
            type: String,
            required: true,
            trim: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        dailyRate: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Room", roomSchema);