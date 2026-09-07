const Doctor = require("../models/doctor.model");

// Create doctor profile
const createDoctorProfile = async (req, res) => {
    try {
        const {
            department,
            specialization,
            qualification,
            experience,
            hospital,
            clinicAddress,
            city,
            consultationFee,
            phone,
            bio,
            availableDays,
            availableTime,
        } = req.body;
if (!department) {
    return res.status(400).json({
        success: false,
        message: "Department is required",
    });
}

if (!specialization) {
    return res.status(400).json({
        success: false,
        message: "Specialization is required",
    });
}
        // Check if doctor profile already exists
        const existingDoctor = await Doctor.findOne({
            user: req.user._id,
        });

        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor profile already exists",
            });
        }

        // Create doctor profile
        const doctor = await Doctor.create({
            user: req.user._id,
            department,
            specialization,
            qualification,
            experience,
            hospital,
            clinicAddress,
            city,
            consultationFee,
            phone,
            bio,
            availableDays,
            availableTime,
        });

        return res.status(201).json({
            success: true,
            message: "Doctor profile created successfully",
            doctor,
        });

    } catch (error) {
        console.error("Create doctor profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


// Get logged-in doctor's profile
const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            user: req.user._id,
        }).populate("user", "name email phone role")
          .populate("department","name description status");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            doctor,
        });

    } catch (error) {
        console.error("Get doctor profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


// Update logged-in doctor's profile
const updateDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            user: req.user._id,
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
            });
        }

        const allowedFields = [
            "department",
            "specialization",
            "qualification",
            "experience",
            "hospital",
            "clinicAddress",
            "city",
            "consultationFee",
            "phone",
            "bio",
            "availableDays",
            "availableTime",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                doctor[field] = req.body[field];
            }
        });

        await doctor.save();

        // Populate user information before sending response
        await doctor.populate(
            "user",
            "name email phone role"
        );

        return res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully",
            doctor,
        });

    } catch (error) {
        console.error(
            "Update doctor profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate("user", "name email phone role")
            .populate("department","name description status");

        return res.status(200).json({
            success: true,
            doctors,
        });

    } catch (error) {
        console.error("Get all doctors error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    createDoctorProfile,
    getDoctorProfile,
    updateDoctorProfile,
    getAllDoctors
};