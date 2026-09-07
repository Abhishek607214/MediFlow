const User = require("../models/user.model");
const Patient = require("../models/patient.model");
const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");
const Department = require("../models/department.model");

// ==========================================
// GET ADMIN DASHBOARD
// ==========================================

const getDashboardStats = async (req, res) => {
    try {

        // Total patients
        const totalPatients = await Patient.countDocuments();

        // Total doctors
        const totalDoctors = await Doctor.countDocuments();

        // Pending doctors
        const pendingDoctors = await Doctor.countDocuments({
            approvalStatus: "pending"
        });

        // Total appointments
        const totalAppointments =
            await Appointment.countDocuments();

        // Recent appointments
        const recentAppointments =
            await Appointment.find()
                .populate({
                    path: "patient",
                    populate: {
                        path: "user",
                        select: "name email"
                    }
                })
                .populate({
                    path: "doctor",
                    populate: {
                        path: "user",
                        select: "name email"
                    }
                })
                .sort({ createdAt: -1 })
                .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalPatients,
                totalDoctors,
                totalAppointments,
                pendingDoctors,
                recentAppointments
            }
        });

    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while loading admin dashboard"
        });
    }
};
// ==========================================
// GET ALL DOCTORS FOR ADMIN
// ==========================================

const getAllDoctors = async (req, res) => {
    try {
        const { search = "", status = "all" } = req.query;

        const query = {};

        // Filter by approval status
        if (status !== "all") {
            query.approvalStatus = status;
        }

        const doctors = await Doctor.find(query)
            .populate({
                path: "user",
                select: "name email phone isActive profileImage"
            })
            .sort({ createdAt: -1 });

        // Search doctor name/email/specialization
        const filteredDoctors = doctors.filter((doctor) => {

            const searchText = search.toLowerCase();

            if (!searchText) {
                return true;
            }

            return (
                doctor.user?.name
                    ?.toLowerCase()
                    .includes(searchText) ||

                doctor.user?.email
                    ?.toLowerCase()
                    .includes(searchText) ||

                doctor.specialization
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });

        res.status(200).json({
            success: true,
            doctors: filteredDoctors
        });

    } catch (error) {

        console.error(
            "Get doctors error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while loading doctors"
        });
    }
};


// ==========================================
// APPROVE / REJECT DOCTOR
// ==========================================

const updateDoctorApproval = async (req, res) => {
    try {

        const { id } = req.params;
        const { approvalStatus } = req.body;

        if (
            !["pending", "approved", "rejected"]
                .includes(approvalStatus)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid approval status"
            });
        }

        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        doctor.approvalStatus = approvalStatus;

        await doctor.save();

        res.status(200).json({
            success: true,
            message: `Doctor ${approvalStatus} successfully`,
            doctor
        });

    } catch (error) {

        console.error(
            "Doctor approval error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while updating doctor"
        });
    }
};


// ==========================================
// ACTIVATE / DEACTIVATE DOCTOR
// ==========================================

const updateDoctorStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        const user = await User.findById(doctor.user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Doctor user account not found"
            });
        }

        user.isActive = isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: isActive
                ? "Doctor activated successfully"
                : "Doctor deactivated successfully",
            isActive
        });

    } catch (error) {

        console.error(
            "Doctor status error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while updating doctor status"
        });
    }
};

// ==========================================
// GET ALL PATIENTS FOR ADMIN
// ==========================================

const getAllPatients = async (req, res) => {
    try {
        const { search = "" } = req.query;

        const patients = await Patient.find()
            .populate({
                path: "user",
                select: "name email phone isActive profileImage createdAt"
            })
            .sort({ createdAt: -1 });

        // Search patient name, email or phone
        const filteredPatients = patients.filter((patient) => {
            const searchText = search.toLowerCase().trim();

            if (!searchText) {
                return true;
            }

            return (
                patient.user?.name
                    ?.toLowerCase()
                    .includes(searchText) ||

                patient.user?.email
                    ?.toLowerCase()
                    .includes(searchText) ||

                patient.user?.phone
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });

        res.status(200).json({
            success: true,
            patients: filteredPatients
        });

    } catch (error) {
        console.error(
            "Get patients error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while loading patients"
        });
    }
};


// ==========================================
// ACTIVATE / DEACTIVATE PATIENT
// ==========================================

const updatePatientStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        // Validate status
        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        // Find patient
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        // Find associated user
        const user = await User.findById(patient.user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Patient user account not found"
            });
        }

        // Make sure this is actually a patient account
        if (user.role !== "patient") {
            return res.status(400).json({
                success: false,
                message: "User is not a patient"
            });
        }

        // Update account status
        user.isActive = isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: isActive
                ? "Patient activated successfully"
                : "Patient deactivated successfully",
            isActive
        });

    } catch (error) {
        console.error(
            "Patient status error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while updating patient status"
        });
    }
};

// ==========================================
// GET ALL APPOINTMENTS FOR ADMIN
// ==========================================

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate({
                path: "patient",
                populate: {
                    path: "user",
                    select: "name email phone"
                }
            })
            .populate({
                path: "doctor",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .sort({
                date: -1,
                time: -1
            });

        res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {

        console.error(
            "Get admin appointments error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while loading appointments"
        });
    }
};


// ==========================================
// UPDATE APPOINTMENT STATUS BY ADMIN
// ==========================================

const updateAdminAppointmentStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        // Validate status

        const allowedStatuses = [
            "pending",
            "confirmed",
            "rejected",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid appointment status"
            });
        }

        // Find appointment

        const appointment =
            await Appointment.findById(id);

        if (!appointment) {

            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Update status

        appointment.status = status;

        await appointment.save();

        res.status(200).json({
            success: true,
            message:
                `Appointment ${status} successfully`,
            appointment
        });

    } catch (error) {

        console.error(
            "Admin appointment status error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while updating appointment"
        });
    }
};

// ==========================================
// GET ALL USERS FOR ADMIN
// ==========================================

const getAllUsers = async (req, res) => {
    try {
        const { search = "", role = "all" } = req.query;

        const query = {};

        // Filter by role
        if (role !== "all") {
            query.role = role;
        }

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 });

        // Search by name, email or phone
        const filteredUsers = users.filter((user) => {
            const searchText = search.toLowerCase().trim();

            if (!searchText) {
                return true;
            }

            return (
                user.name?.toLowerCase().includes(searchText) ||
                user.email?.toLowerCase().includes(searchText) ||
                user.phone?.toLowerCase().includes(searchText)
            );
        });

        res.status(200).json({
            success: true,
            users: filteredUsers
        });

    } catch (error) {

        console.error(
            "Get users error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while loading users"
        });
    }
};


// ==========================================
// ACTIVATE / DEACTIVATE USER
// ==========================================

const updateUserStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { isActive } = req.body;

        // Validate status
        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Do not allow admin to deactivate himself
        if (
            user._id.toString() === req.user._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own status"
            });
        }

        user.isActive = isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: isActive
                ? "User activated successfully"
                : "User deactivated successfully",
            isActive
        });

    } catch (error) {

        console.error(
            "User status error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while updating user status"
        });
    }
};


// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Do not allow admin to delete himself
        if (
            user._id.toString() === req.user._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        // Do not delete another admin
        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Admin users cannot be deleted"
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while deleting user"
        });
    }
};

// ==========================================
// GET ADMIN REPORTS
// ==========================================

const getReports = async (req, res) => {
    try {
        // Total users
        const totalUsers = await User.countDocuments();

        // Total patients
        const totalPatients = await Patient.countDocuments();

        // Total doctors
        const totalDoctors = await Doctor.countDocuments();

        // Total departments
        const totalDepartments = await Department.countDocuments();

        // Total appointments
        const totalAppointments =
            await Appointment.countDocuments();

        // Appointment status counts
        const pendingAppointments =
            await Appointment.countDocuments({
                status: "pending"
            });

        const confirmedAppointments =
            await Appointment.countDocuments({
                status: "confirmed"
            });

        const completedAppointments =
            await Appointment.countDocuments({
                status: "completed"
            });

        const rejectedAppointments =
            await Appointment.countDocuments({
                status: "rejected"
            });

        const cancelledAppointments =
            await Appointment.countDocuments({
                status: "cancelled"
            });

        // Doctor approval counts
        const pendingDoctors =
            await Doctor.countDocuments({
                approvalStatus: "pending"
            });

        const approvedDoctors =
            await Doctor.countDocuments({
                approvalStatus: "approved"
            });

        const rejectedDoctors =
            await Doctor.countDocuments({
                approvalStatus: "rejected"
            });

        // Active / inactive users
        const activeUsers =
            await User.countDocuments({
                isActive: true
            });

        const inactiveUsers =
            await User.countDocuments({
                isActive: false
            });

        res.status(200).json({
            success: true,
            reports: {
                overview: {
                    totalUsers,
                    totalPatients,
                    totalDoctors,
                    totalDepartments,
                    totalAppointments
                },

                appointments: {
                    pending: pendingAppointments,
                    confirmed: confirmedAppointments,
                    completed: completedAppointments,
                    rejected: rejectedAppointments,
                    cancelled: cancelledAppointments
                },

                doctors: {
                    pending: pendingDoctors,
                    approved: approvedDoctors,
                    rejected: rejectedDoctors
                },

                users: {
                    active: activeUsers,
                    inactive: inactiveUsers
                }
            }
        });

    } catch (error) {
        console.error(
            "GET REPORTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to load reports"
        });
    }
};

module.exports = {
    getDashboardStats,

    // Doctor management
    getAllDoctors,
    updateDoctorApproval,
    updateDoctorStatus,

    // Patient management
    getAllPatients,
    updatePatientStatus,

    // Appointment management
    getAllAppointments,
    updateAdminAppointmentStatus,

    // User management
    getAllUsers,
    updateUserStatus,
    deleteUser,

    // Reports
    getReports
};