const express = require("express");

const {
    getReceptionistAppointments,
    updateReceptionistAppointmentStatus
} = require("../controllers/appointment.controller");

const {
    getAllPatients
} = require("../controllers/patient.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

// ==========================================
// RECEPTIONIST - GET ALL APPOINTMENTS
// ==========================================

router.get(
    "/appointments",
    protect,
    authorize("receptionist"),
    getReceptionistAppointments
);

// ==========================================
// RECEPTIONIST - UPDATE APPOINTMENT STATUS
// ==========================================

router.put(
    "/appointments/:id/status",
    protect,
    authorize("receptionist"),
    updateReceptionistAppointmentStatus
);

// ==========================================
// RECEPTIONIST - GET ALL PATIENTS
// ==========================================

router.get(
    "/patients",
    protect,
    authorize("receptionist"),
    getAllPatients
);

module.exports = router;