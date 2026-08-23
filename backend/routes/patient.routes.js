const express = require("express");

const {
    getPatientProfile,
    updatePatientProfile
} = require("../controllers/patient.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();


// Get logged-in patient's profile
router.get(
    "/profile",
    protect,
    authorize("patient"),
    getPatientProfile
);


// Update logged-in patient's profile
router.put(
    "/profile",
    protect,
    authorize("patient"),
    updatePatientProfile
);

module.exports = router;