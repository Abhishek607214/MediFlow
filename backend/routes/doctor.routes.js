const express = require("express");

const {
    getDoctorProfile,
    updateDoctorProfile,
    getAllDoctors,
} = require("../controllers/doctor.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

// Get all doctors
router.get("/", getAllDoctors);

// Get logged-in doctor's profile
router.get(
    "/me",
    protect,
    authorize("doctor"),
    getDoctorProfile
);


// Update logged-in doctor's profile
router.put(
    "/me",
    protect,
    authorize("doctor"),
    updateDoctorProfile
);


module.exports = router;
