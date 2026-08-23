const Patient = require("../models/patient.model");

const createPatientProfile = async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      emergencyContact,
      insurance,
      bloodPressure,
      heartRate,
    } = req.body;

    // Check if profile already exists
    const existingPatient = await Patient.findOne({
      user: req.user._id,
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient profile already exists",
      });
    }

    const patient = await Patient.create({
      user: req.user._id,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      emergencyContact,
      insurance,
      bloodPressure,
      heartRate,
    });

    res.status(201).json({
      success: true,
      message: "Patient profile created successfully",
      patient,
    });
  } catch (error) {
    console.error("Create patient profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create patient profile",
      error: error.message,
    });
  }
};

const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      user: req.user._id,
    }).populate("user", "name email phone role");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Get patient profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get patient profile",
      error: error.message,
    });
  }
};

const updatePatientProfile = async (req, res) => {
    try {

        const {
            dateOfBirth,
            gender,
            address,
            city,
            state,
            zipCode,
            emergencyContact,
            insurance,
            bloodPressure,
            heartRate
        } = req.body;

        const patient = await Patient.findOneAndUpdate(
            {
                user: req.user._id
            },
            {
                $set: {
                    dateOfBirth,
                    gender,
                    address,
                    city,
                    state,
                    zipCode,
                    emergencyContact,
                    insurance,
                    bloodPressure,
                    heartRate
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("user","name email phone role");

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Patient profile updated successfully",
            patient
        });

    } catch (error) {

        console.error(
            "Update patient profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update patient profile",
            error: error.message
        });
    }
};

module.exports = {
  createPatientProfile,
  getPatientProfile,
  updatePatientProfile,
};
