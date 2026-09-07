const express = require("express");

const {
    createReport,
    getDoctorReports,
    getPatientReports,
    getPatientReportById
} = require("../controllers/report.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

// =====================================================
// DOCTOR ROUTES
// =====================================================

router.post(
    "/doctor",
    protect,
    authorize("doctor"),
    createReport
);

router.get(
    "/doctor",
    protect,
    authorize("doctor"),
    getDoctorReports
);

// =====================================================
// PATIENT ROUTES
// =====================================================

router.get(
    "/patient",
    protect,
    authorize("patient"),
    getPatientReports
);

router.get(
    "/patient/:id",
    protect,
    authorize("patient"),
    getPatientReportById
);

module.exports = router;