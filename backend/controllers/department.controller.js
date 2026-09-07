const Department = require("../models/department.model");

// ==========================================
// GET ALL DEPARTMENTS
// ==========================================

const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            departments
        });

    } catch (error) {
        console.error(
            "GET DEPARTMENTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to load departments"
        });
    }
};
// ==========================================
// GET ACTIVE DEPARTMENTS
// ==========================================

const getActiveDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            departments
        });
    } catch (error) {
        console.error("GET ACTIVE DEPARTMENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load departments"
        });
    }
};

// ==========================================
// CREATE DEPARTMENT
// ==========================================

const createDepartment = async (req, res) => {
    try {
        const {
            name,
            description
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Department name is required"
            });
        }

        const existingDepartment =
            await Department.findOne({
                name: name.trim()
            });

        if (existingDepartment) {
            return res.status(400).json({
                success: false,
                message: "Department already exists"
            });
        }

        const department =
            await Department.create({
                name: name.trim(),
                description:
                    description?.trim() || ""
            });

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            department
        });

    } catch (error) {
        console.error(
            "CREATE DEPARTMENT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to create department"
        });
    }
};


// ==========================================
// UPDATE DEPARTMENT
// ==========================================

const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description
        } = req.body;

        const department =
            await Department.findById(id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        if (name) {
            department.name = name.trim();
        }

        if (description !== undefined) {
            department.description =
                description.trim();
        }

        await department.save();

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            department
        });

    } catch (error) {
        console.error(
            "UPDATE DEPARTMENT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to update department"
        });
    }
};

const updateDepartmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const department = await Department.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department status updated",
            department
        });

    } catch (error) {
        console.error("DEPARTMENT STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update department status"
        });
    }
};

// ==========================================
// DELETE DEPARTMENT
// ==========================================

const deleteDepartment = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const department =
            await Department.findByIdAndDelete(id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });

    } catch (error) {
        console.error(
            "DELETE DEPARTMENT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to delete department"
        });
    }
};


module.exports = {
    getAllDepartments,
    getActiveDepartments,
    createDepartment,
    updateDepartment,
    updateDepartmentStatus,
    deleteDepartment
};