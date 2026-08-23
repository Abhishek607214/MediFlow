const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    zipCode: {
      type: String,
      default: "",
    },

    emergencyContact: {
      name: {
        type: String,
        default: "",
      },

      relationship: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },
    },

    insurance: {
      providerName: {
        type: String,
        default: "",
      },

      memberId: {
        type: String,
        default: "",
      },

      groupNumber: {
        type: String,
        default: "",
      },
    },

    bloodPressure: {
      type: String,
      default: "",
    },

    heartRate: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;