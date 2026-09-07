const express = require("express");

const {
    getAllDepartments,
    getActiveDepartments,
    createDepartment,
    updateDepartment,
    updateDepartmentStatus,
    deleteDepartment
} = require("../controllers/department.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();


// ==========================================
// GET ALL DEPARTMENTS
// ==========================================

router.get(
    "/",
    protect,
    authorize("admin"),
    getAllDepartments
);

// ==========================================
// GET ACTIVE DEPARTMENTS
// ==========================================

router.get(
    "/active",
    protect,
    getActiveDepartments
);

// ==========================================
// CREATE DEPARTMENT
// ==========================================

router.post(
    "/",
    protect,
    authorize("admin"),
    createDepartment
);


// ==========================================
// UPDATE DEPARTMENT
// ==========================================

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateDepartment
);


// ==========================================
// UPDATE DEPARTMENT STATUS
// ==========================================

router.patch(
    "/:id/status",
    protect,
    authorize("admin"),
    updateDepartmentStatus
);


// ==========================================
// DELETE DEPARTMENT
// ==========================================

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteDepartment
);


module.exports = router;