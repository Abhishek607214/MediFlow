const mongoose = require("mongoose");

// =====================================================
// TRANSFER HISTORY
// =====================================================

const transferSchema = new mongoose.Schema(
    {
        fromRoom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        },

        fromBed: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bed"
        },

        toRoom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        },

        toBed: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bed"
        },

        transferDate: {
            type: Date,
            default: Date.now
        },

        reason: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        _id: true
    }
);

// =====================================================
// BILLING SEGMENT
// =====================================================
// Each room/bed stay gets its own billing record.
// This makes billing accurate when a patient is transferred.
// =====================================================

const billingSegmentSchema = new mongoose.Schema(
    {
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        bed: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bed",
            required: true
        },

        rate: {
            type: Number,
            required: true,
            min: 0
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            default: null
        },

        days: {
            type: Number,
            default: 0,
            min: 0
        },

        charges: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        _id: true
    }
);

// =====================================================
// ADMISSION SCHEMA
// =====================================================

const admissionSchema = new mongoose.Schema(
    {
        // =================================================
        // PATIENT
        // =================================================

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        // =================================================
        // DOCTOR
        // =================================================

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            default: null
        },

        // =================================================
        // CURRENT ROOM
        // =================================================

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        // =================================================
        // CURRENT BED
        // =================================================

        bed: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bed",
            required: true
        },

        // =================================================
        // ADMISSION DATE
        // =================================================

        admissionDate: {
            type: Date,
            default: Date.now
        },

        // =================================================
        // DISCHARGE DATE
        // =================================================

        dischargeDate: {
            type: Date,
            default: null
        },

        // =================================================
        // STATUS
        // =================================================

        status: {
            type: String,
            enum: [
                "admitted",
                "discharged"
            ],
            default: "admitted"
        },

        // =================================================
        // ADMISSION NOTES
        // =================================================

        admissionNotes: {
            type: String,
            default: "",
            trim: true
        },

        // =================================================
        // DISCHARGE NOTES
        // =================================================

        dischargeNotes: {
            type: String,
            default: "",
            trim: true
        },

        // =================================================
        // CURRENT ROOM RATE
        // =================================================
        // Kept for compatibility with the existing
        // admission system and current frontend.
        // =================================================

        roomRate: {
            type: Number,
            required: true,
            min: 0
        },

        // =================================================
        // TOTAL DAYS
        // =================================================

        totalDays: {
            type: Number,
            default: 0,
            min: 0
        },

        // =================================================
        // TOTAL ROOM CHARGES
        // =================================================

        roomCharges: {
            type: Number,
            default: 0,
            min: 0
        },

        // =================================================
        // TRANSFER HISTORY
        // =================================================

        transfers: [
            transferSchema
        ],

        // =================================================
        // BILLING HISTORY
        // =================================================
        // Example:
        //
        // ICU ₹5000 × 2 days = ₹10000
        // General ₹2500 × 3 days = ₹7500
        // Total = ₹17500
        //
        // =================================================

        billingSegments: [
            billingSegmentSchema
        ]
    },

    {
        timestamps: true
    }
);

// =====================================================
// INDEXES
// =====================================================

// Find admissions for a particular patient
admissionSchema.index({
    patient: 1,
    status: 1
});

// Find admissions associated with a particular bed
admissionSchema.index({
    bed: 1,
    status: 1
});

// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
    "Admission",
    admissionSchema
);