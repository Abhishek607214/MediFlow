const express = require("express");

const {
    createAppointment,
    getAvailableSlots,
    getPatientAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    cancelAppointment,
    getReceptionistAppointments,
    updateReceptionistAppointmentStatus
} = require("../controllers/appointment.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();


// Patient creates an appointment
router.post(
    "/",
    protect,
    authorize("patient"),
    createAppointment
);

// Patient gets available doctor slots
router.get(
    "/availability/:doctorId",
    protect,
    authorize("patient"),
    getAvailableSlots
);


// Patient views their appointments
router.get(
    "/patient",
    protect,
    authorize("patient"),
    getPatientAppointments
);


// Doctor views their appointments
router.get(
    "/doctor",
    protect,
    authorize("doctor"),
    getDoctorAppointments
);

// Patient cancels their appointment
router.put(
    "/:id/cancel",
    protect,
    authorize("patient"),
    cancelAppointment
);

// Doctor updates appointment status
router.put(
    "/:id/status",
    protect,
    authorize("doctor"),
    updateAppointmentStatus
);

// ==========================================
// RECEPTIONIST - VIEW APPOINTMENTS
// ==========================================

router.get(
    "/receptionist",
    protect,
    authorize("receptionist"),
    getReceptionistAppointments
);


// ==========================================
// RECEPTIONIST - UPDATE APPOINTMENT
// ==========================================

router.put(
    "/:id/receptionist-status",
    protect,
    authorize("receptionist"),
    updateReceptionistAppointmentStatus
);

module.exports = router;
