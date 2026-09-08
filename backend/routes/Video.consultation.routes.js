const express = require("express");

const {
    getVideoConsultation,
    startVideoConsultation,
    endVideoConsultation
} = require(
    "../controllers/Video.consultation.controller"
);

const {
    protect
} = require(
    "../middleware/auth.middleware"
);

const {
    authorize
} = require(
    "../middleware/role.middleware"
);

const router = express.Router();


// ==========================================
// GET VIDEO CONSULTATION
// Patient + Doctor
// ==========================================

router.get(
    "/:appointmentId",
    protect,
    authorize("patient", "doctor"),
    getVideoConsultation
);


// ==========================================
// START VIDEO CONSULTATION
// Doctor only
// ==========================================

router.post(
    "/:appointmentId/start",
    protect,
    authorize("doctor"),
    startVideoConsultation
);


// ==========================================
// END VIDEO CONSULTATION
// Patient + Doctor
// ==========================================

router.put(
    "/:appointmentId/end",
    protect,
    authorize("patient", "doctor"),
    endVideoConsultation
);


module.exports = router;