const express = require("express");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const {
    getDashboardStats,
    getAllDoctors,
    updateDoctorApproval,
    updateDoctorStatus,
    getAllPatients,
    updatePatientStatus,
    getAllAppointments,
    updateAdminAppointmentStatus,
    getAllUsers,
    updateUserStatus,
    deleteUser,
    getReports
} = require("../controllers/admin.controller");

const router = express.Router();


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
    "/dashboard",
    protect,
    authorize("admin"),
    getDashboardStats
);


// ==========================================
// DOCTOR MANAGEMENT
// ==========================================

router.get(
    "/doctors",
    protect,
    authorize("admin"),
    getAllDoctors
);


router.patch(
    "/doctors/:id/approval",
    protect,
    authorize("admin"),
    updateDoctorApproval
);


router.patch(
    "/doctors/:id/status",
    protect,
    authorize("admin"),
    updateDoctorStatus
);


// ==========================================
// PATIENT MANAGEMENT
// ==========================================

router.get(
    "/patients",
    protect,
    authorize("admin"),
    getAllPatients
);


router.patch(
    "/patients/:id/status",
    protect,
    authorize("admin"),
    updatePatientStatus
);

// ==========================================
// APPOINTMENT MANAGEMENT
// ==========================================

router.get(
    "/appointments",
    protect,
    authorize("admin"),
    getAllAppointments
);

router.patch(
    "/appointments/:id/status",
    protect,
    authorize("admin"),
    updateAdminAppointmentStatus
);

// ==========================================
// USER MANAGEMENT
// ==========================================

router.get(
    "/users",
    protect,
    authorize("admin"),
    getAllUsers
);

router.patch(
    "/users/:id/status",
    protect,
    authorize("admin"),
    updateUserStatus
);

router.delete(
    "/users/:id",
    protect,
    authorize("admin"),
    deleteUser
);
// ==========================================
// GET ADMIN REPORTS
// ==========================================

router.get(
    "/reports",
    protect,
    authorize("admin"),
    getReports
);

module.exports = router;