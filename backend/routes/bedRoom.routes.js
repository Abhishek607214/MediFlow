const express = require("express");

const {
    getBedRoomDashboard,
    getRooms,
    createRoom,
    getBeds,
    createBed,
    getAvailableBeds,
    admitPatient,
    dischargePatient,
    transferPatient,
    getAdmissions,
    getAdmissionById
} = require("../controllers/bedRoom.controller");

const {
    protect
} = require("../middleware/auth.middleware");

const {
    authorize
} = require("../middleware/role.middleware");

const router = express.Router();


// =====================================================
// DASHBOARD
// =====================================================

router.get(
    "/dashboard",
    protect,
    authorize("admin", "receptionist"),
    getBedRoomDashboard
);


// =====================================================
// ROOMS
// =====================================================

router.get(
    "/rooms",
    protect,
    authorize("admin", "receptionist"),
    getRooms
);

router.post(
    "/rooms",
    protect,
    authorize("admin", "receptionist"),
    createRoom
);


// =====================================================
// BEDS
// =====================================================

router.get(
    "/beds",
    protect,
    authorize("admin", "receptionist"),
    getBeds
);

router.post(
    "/beds",
    protect,
    authorize("admin", "receptionist"),
    createBed
);

router.get(
    "/beds/available",
    protect,
    authorize("admin", "receptionist"),
    getAvailableBeds
);


// =====================================================
// ADMISSIONS
// =====================================================

router.get(
    "/admissions",
    protect,
    authorize("admin", "receptionist"),
    getAdmissions
);

router.get(
    "/admissions/:id",
    protect,
    authorize("admin", "receptionist"),
    getAdmissionById
);

router.post(
    "/admissions",
    protect,
    authorize("admin", "receptionist"),
    admitPatient
);

router.put(
    "/admissions/:id/discharge",
    protect,
    authorize("admin", "receptionist"),
    dischargePatient
);

router.put(
    "/admissions/:id/transfer",
    protect,
    authorize("admin", "receptionist"),
    transferPatient
);


module.exports = router;