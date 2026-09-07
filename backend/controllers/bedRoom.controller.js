const Room = require("../models/room.model");
const Bed = require("../models/bed.model");
const Admission = require("../models/admission.model");
const Patient = require("../models/patient.model");
const Doctor = require("../models/doctor.model");


// =====================================================
// DASHBOARD
// =====================================================

const getBedRoomDashboard = async (req, res) => {
    try {
        const [
            totalRooms,
            totalBeds,
            availableBeds,
            occupiedBeds,
            maintenanceBeds,
            reservedBeds
        ] = await Promise.all([
            Room.countDocuments({ isActive: true }),

            Bed.countDocuments(),

            Bed.countDocuments({
                status: "available"
            }),

            Bed.countDocuments({
                status: "occupied"
            }),

            Bed.countDocuments({
                status: "maintenance"
            }),

            Bed.countDocuments({
                status: "reserved"
            })
        ]);

        const roomTypes = await Room.aggregate([
            {
                $match: {
                    isActive: true
                }
            },
            {
                $group: {
                    _id: "$roomType",
                    rooms: {
                        $sum: 1
                    },
                    capacity: {
                        $sum: "$capacity"
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const recentAdmissions =
            await Admission.find()
                .populate({
                    path: "patient",
                    populate: {
                        path: "user",
                        select: "name email phone"
                    }
                })
                .populate("room", "roomNumber roomType")
                .populate("bed", "bedNumber status")
                .populate({
                    path: "doctor",
                    populate: {
                        path: "user",
                        select: "name"
                    }
                })
                .sort({
                    createdAt: -1
                })
                .limit(10);

        return res.status(200).json({
            success: true,

            stats: {
                totalRooms,
                totalBeds,
                availableBeds,
                occupiedBeds,
                maintenanceBeds,
                reservedBeds
            },

            roomTypes,

            recentAdmissions
        });

    } catch (error) {
        console.error(
            "Bed room dashboard error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load bed and room dashboard"
        });
    }
};


// =====================================================
// GET ROOMS
// =====================================================

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .sort({
                roomType: 1,
                roomNumber: 1
            });

        return res.status(200).json({
            success: true,
            rooms
        });

    } catch (error) {
        console.error(
            "Get rooms error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load rooms"
        });
    }
};


// =====================================================
// CREATE ROOM
// =====================================================

const createRoom = async (req, res) => {
    try {
        const {
            roomNumber,
            roomType,
            floor,
            capacity,
            dailyRate,
            description
        } = req.body;

        if (
            !roomNumber ||
            !roomType ||
            !floor ||
            !capacity ||
            dailyRate === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Room number, type, floor, capacity and daily rate are required"
            });
        }

        const existingRoom =
            await Room.findOne({
                roomNumber: roomNumber.trim()
            });

        if (existingRoom) {
            return res.status(400).json({
                success: false,
                message:
                    "Room number already exists"
            });
        }

        const room = await Room.create({
            roomNumber: roomNumber.trim(),
            roomType,
            floor: floor.trim(),
            capacity,
            dailyRate,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Room created successfully",
            room
        });

    } catch (error) {
        console.error(
            "Create room error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create room"
        });
    }
};


// =====================================================
// GET BEDS
// =====================================================

const getBeds = async (req, res) => {
    try {
        const beds = await Bed.find()
            .populate(
                "room",
                "roomNumber roomType floor dailyRate"
            )
            .populate({
                path: "currentPatient",
                populate: {
                    path: "user",
                    select: "name email phone"
                }
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            beds
        });

    } catch (error) {
        console.error(
            "Get beds error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load beds"
        });
    }
};


// =====================================================
// CREATE BED
// =====================================================

const createBed = async (req, res) => {
    try {
        const {
            bedNumber,
            room,
            notes
        } = req.body;

        if (!bedNumber || !room) {
            return res.status(400).json({
                success: false,
                message:
                    "Bed number and room are required"
            });
        }

        const selectedRoom =
            await Room.findById(room);

        if (!selectedRoom) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        const bedCount =
            await Bed.countDocuments({
                room
            });

        if (
            bedCount >=
            selectedRoom.capacity
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Room has reached its bed capacity"
            });
        }

        const existingBed =
            await Bed.findOne({
                room,
                bedNumber: bedNumber.trim()
            });

        if (existingBed) {
            return res.status(400).json({
                success: false,
                message:
                    "Bed number already exists in this room"
            });
        }

        const bed = await Bed.create({
            bedNumber: bedNumber.trim(),
            room,
            notes
        });

        return res.status(201).json({
            success: true,
            message: "Bed created successfully",
            bed
        });

    } catch (error) {
        console.error(
            "Create bed error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create bed"
        });
    }
};


// =====================================================
// AVAILABLE BEDS
// =====================================================

const getAvailableBeds = async (req, res) => {
    try {
        const beds =
            await Bed.find({
                status: "available"
            })
                .populate(
                    "room",
                    "roomNumber roomType floor dailyRate"
                )
                .sort({
                    "room.roomType": 1,
                    bedNumber: 1
                });

        return res.status(200).json({
            success: true,
            beds
        });

    } catch (error) {
        console.error(
            "Available beds error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load available beds"
        });
    }
};


// =====================================================
// ADMIT PATIENT
// =====================================================

const admitPatient = async (req, res) => {
    try {
        const {
            patient,
            doctor,
            bed,
            admissionDate,
            admissionNotes
        } = req.body;

        if (!patient || !bed) {
            return res.status(400).json({
                success: false,
                message:
                    "Patient and bed are required"
            });
        }

        const selectedPatient =
            await Patient.findById(patient);

        if (!selectedPatient) {
            return res.status(404).json({
                success: false,
                message:
                    "Patient not found"
            });
        }

        const selectedBed =
            await Bed.findById(bed)
                .populate("room");

        if (!selectedBed) {
            return res.status(404).json({
                success: false,
                message: "Bed not found"
            });
        }

        if (
            selectedBed.status !==
            "available"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Selected bed is not available"
            });
        }

        const existingAdmission =
            await Admission.findOne({
                patient,
                status: "admitted"
            });

        if (existingAdmission) {
            return res.status(400).json({
                success: false,
                message:
                    "Patient is already admitted"
            });
        }

        let selectedDoctor = null;

        if (doctor) {
            selectedDoctor =
                await Doctor.findById(
                    doctor
                );

            if (!selectedDoctor) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Doctor not found"
                });
            }
        }
const finalAdmissionDate =
    admissionDate
        ? new Date(admissionDate)
        : new Date();

const admission =
    await Admission.create({
        patient,
        doctor: doctor || null,
        room: selectedBed.room._id,
        bed: selectedBed._id,
        admissionDate: finalAdmissionDate,
        admissionNotes,
        roomRate:
            selectedBed.room.dailyRate,

        billingSegments: [
            {
                room: selectedBed.room._id,
                bed: selectedBed._id,
                rate: selectedBed.room.dailyRate,
                startDate: finalAdmissionDate,
                endDate: null,
                days: 0,
                charges: 0
            }
        ]
    });

        selectedBed.status =
            "occupied";

        selectedBed.currentPatient =
            patient;

        await selectedBed.save();

        const populatedAdmission =
            await Admission.findById(
                admission._id
            )
                .populate({
                    path: "patient",
                    populate: {
                        path: "user",
                        select: "name email phone"
                    }
                })
                .populate(
                    "room",
                    "roomNumber roomType dailyRate"
                )
                .populate(
                    "bed",
                    "bedNumber status"
                )
                .populate({
                    path: "doctor",
                    populate: {
                        path: "user",
                        select: "name"
                    }
                });

        return res.status(201).json({
            success: true,
            message:
                "Patient admitted successfully",
            admission:
                populatedAdmission
        });

    } catch (error) {
        console.error(
            "Admit patient error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to admit patient"
        });
    }
};


// =====================================================
// DISCHARGE PATIENT
// =====================================================

const dischargePatient = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            dischargeDate,
            dischargeNotes
        } = req.body;

        const admission =
            await Admission.findById(id);

        if (!admission) {
            return res.status(404).json({
                success: false,
                message: "Admission not found"
            });
        }

        if (admission.status === "discharged") {
            return res.status(400).json({
                success: false,
                message:
                    "Patient is already discharged"
            });
        }

        // =================================================
        // FINAL DISCHARGE DATE
        // =================================================

        const finalDate = dischargeDate
            ? new Date(dischargeDate)
            : new Date();

        if (isNaN(finalDate.getTime())) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid discharge date"
            });
        }

        if (
            finalDate <
            new Date(admission.admissionDate)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Discharge date cannot be before admission date"
            });
        }

        // =================================================
        // BILLING SEGMENTS
        // =================================================

        let totalRoomCharges = 0;

        if (
            admission.billingSegments &&
            admission.billingSegments.length > 0
        ) {
            for (
                let i = 0;
                i <
                admission.billingSegments.length;
                i++
            ) {
                const segment =
                    admission.billingSegments[i];

                const startDate =
                    new Date(
                        segment.startDate
                    );

                const endDate =
                    segment.endDate
                        ? new Date(
                              segment.endDate
                          )
                        : finalDate;

                // -----------------------------------------
                // Calendar-day billing
                // -----------------------------------------

                const start = new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate()
                );

                const end = new Date(
                    endDate.getFullYear(),
                    endDate.getMonth(),
                    endDate.getDate()
                );

                const difference =
                    end.getTime() -
                    start.getTime();

                let days = Math.round(
                    difference /
                        (1000 *
                            60 *
                            60 *
                            24)
                );

                if (days < 1) {
                    days = 1;
                }

                const rate =
                    Number(
                        segment.rate || 0
                    );

                const charges =
                    days * rate;

                segment.endDate =
                    endDate;

                segment.days = days;

                segment.charges =
                    charges;

                totalRoomCharges +=
                    charges;
            }
        } else {
            // =================================================
            // FALLBACK FOR OLD ADMISSIONS
            // =================================================

            const startDate =
                new Date(
                    admission.admissionDate
                );

            const start = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()
            );

            const end = new Date(
                finalDate.getFullYear(),
                finalDate.getMonth(),
                finalDate.getDate()
            );

            let totalDays = Math.round(
                (
                    end.getTime() -
                    start.getTime()
                ) /
                    (1000 *
                        60 *
                        60 *
                        24)
            );

            if (totalDays < 1) {
                totalDays = 1;
            }

            totalRoomCharges =
                totalDays *
                Number(
                    admission.roomRate || 0
                );

            admission.totalDays =
                totalDays;
        }

        // =================================================
        // TOTAL DAYS
        // =================================================

        const admissionStart =
            new Date(
                admission.admissionDate
            );

        const startCalendar =
            new Date(
                admissionStart.getFullYear(),
                admissionStart.getMonth(),
                admissionStart.getDate()
            );

        const endCalendar =
            new Date(
                finalDate.getFullYear(),
                finalDate.getMonth(),
                finalDate.getDate()
            );

        let totalDays = Math.round(
            (
                endCalendar.getTime() -
                startCalendar.getTime()
            ) /
                (1000 *
                    60 *
                    60 *
                    24)
        );

        if (totalDays < 1) {
            totalDays = 1;
        }

        // =================================================
        // SAVE DISCHARGE
        // =================================================

        admission.dischargeDate =
            finalDate;

        admission.status =
            "discharged";

        admission.dischargeNotes =
            dischargeNotes || "";

        admission.totalDays =
            totalDays;

        admission.roomCharges =
            totalRoomCharges;

        await admission.save();

        // =================================================
        // FREE CURRENT BED
        // =================================================

        await Bed.findByIdAndUpdate(
            admission.bed,
            {
                status: "available",
                currentPatient: null
            }
        );

        // =================================================
        // RETURN UPDATED ADMISSION
        // =================================================

        const updatedAdmission =
            await Admission.findById(
                admission._id
            )
                .populate({
                    path: "patient",
                    populate: {
                        path: "user",
                        select:
                            "name email phone"
                    }
                })
                .populate(
                    "room",
                    "roomNumber roomType dailyRate"
                )
                .populate(
                    "bed",
                    "bedNumber status"
                )
                .populate({
                    path: "doctor",
                    populate: {
                        path: "user",
                        select: "name"
                    }
                })
                .populate(
                    "billingSegments.room",
                    "roomNumber roomType dailyRate"
                )
                .populate(
                    "billingSegments.bed",
                    "bedNumber status"
                )
                .populate(
                    "transfers.fromRoom",
                    "roomNumber roomType"
                )
                .populate(
                    "transfers.toRoom",
                    "roomNumber roomType"
                )
                .populate(
                    "transfers.fromBed",
                    "bedNumber"
                )
                .populate(
                    "transfers.toBed",
                    "bedNumber"
                );

        return res.status(200).json({
            success: true,
            message:
                "Patient discharged successfully",
            admission:
                updatedAdmission
        });

    } catch (error) {

        console.error(
            "Discharge patient error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to discharge patient",
            error: error.message
        });
    }
};
// =====================================================
// TRANSFER PATIENT
// =====================================================

// =====================================================
// TRANSFER PATIENT
// =====================================================

const transferPatient = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            newBed,
            reason
        } = req.body;

        if (!newBed) {
            return res.status(400).json({
                success: false,
                message:
                    "New bed is required"
            });
        }

        const admission =
            await Admission.findById(id);

        if (!admission) {
            return res.status(404).json({
                success: false,
                message:
                    "Admission not found"
            });
        }

        if (
            admission.status !==
            "admitted"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Only admitted patients can be transferred"
            });
        }

        // Prevent transferring to the same bed
        if (
            admission.bed.toString() ===
            newBed.toString()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Patient is already assigned to this bed"
            });
        }

        // =================================================
        // DESTINATION BED
        // =================================================

        const destinationBed =
            await Bed.findById(newBed)
                .populate("room");

        if (!destinationBed) {
            return res.status(404).json({
                success: false,
                message:
                    "Destination bed not found"
            });
        }

        if (
            destinationBed.status !==
            "available"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Destination bed is not available"
            });
        }

        // =================================================
        // CURRENT BED
        // =================================================

        const oldBed =
            await Bed.findById(
                admission.bed
            );

        if (!oldBed) {
            return res.status(404).json({
                success: false,
                message:
                    "Current bed not found"
            });
        }

        // =================================================
        // TRANSFER DATE
        // =================================================

        const transferDate =
            new Date();

        // =================================================
        // BILLING HISTORY
        // =================================================

        if (
            !Array.isArray(
                admission.billingSegments
            )
        ) {
            admission.billingSegments = [];
        }

        // If this admission was created before
        // billingSegments were introduced,
        // create the initial segment automatically.

        if (
            admission.billingSegments.length ===
            0
        ) {
            admission.billingSegments.push({
                room: admission.room,
                bed: admission.bed,
                rate: admission.roomRate,
                startDate:
                    admission.admissionDate,
                endDate: transferDate
            });
        } else {
            const currentSegment =
                admission.billingSegments[
                    admission.billingSegments.length -
                        1
                ];

            if (
                !currentSegment.endDate
            ) {
                currentSegment.endDate =
                    transferDate;

                let days = Math.ceil(
                    (
                        transferDate.getTime() -
                        new Date(
                            currentSegment.startDate
                        ).getTime()
                    ) /
                        (1000 *
                            60 *
                            60 *
                            24)
                );

                if (days < 1) {
                    days = 1;
                }

                currentSegment.days = days;
                currentSegment.charges =
                    days *
                    Number(
                        currentSegment.rate ||  0
                    );
            }
        }

        // Add new billing segment
        admission.billingSegments.push({
            room:
                destinationBed.room._id,
            bed:
                destinationBed._id,
            rate:
                destinationBed.room.dailyRate,
            startDate:
                transferDate,
            endDate: null,
            days: 0,
            charges: 0
        });
// =================================================
// UPDATE ESTIMATED ROOM CHARGES
// =================================================

let estimatedCharges = 0;

admission.billingSegments.forEach(
    (segment) => {
        estimatedCharges +=
            Number(segment.charges || 0);
    }
);

admission.roomCharges =
    estimatedCharges;
        // =================================================
        // TRANSFER HISTORY
        // =================================================

        admission.transfers.push({
            fromRoom:
                admission.room,

            fromBed:
                admission.bed,

            toRoom:
                destinationBed.room._id,

            toBed:
                destinationBed._id,

            transferDate,
            reason: reason || ""
        });
// =====================================================
// CLOSE CURRENT BILLING SEGMENT
// =====================================================

if (
    admission.billingSegments &&
    admission.billingSegments.length > 0
) {
    const currentSegment =
        admission.billingSegments[
            admission.billingSegments.length - 1
        ];

    if (!currentSegment.endDate) {
        currentSegment.endDate =
            transferDate;

        const startDate =
            new Date(
                currentSegment.startDate
            );

        let days = Math.ceil(
            (
                transferDate.getTime() -
                startDate.getTime()
            ) /
                (1000 * 60 * 60 * 24)
        );

        if (days < 1) {
            days = 1;
        }

        currentSegment.days = days;

        currentSegment.charges =
            days *
            Number(
                currentSegment.rate || 0
            );
    }
}
        // =================================================
        // UPDATE ADMISSION
        // =================================================

        admission.room =
            destinationBed.room._id;

        admission.bed =
            destinationBed._id;

        admission.roomRate =
            destinationBed.room.dailyRate;

        await admission.save();

        // =================================================
        // FREE OLD BED
        // =================================================

        oldBed.status =
            "available";

        oldBed.currentPatient =
            null;

        await oldBed.save();

        // =================================================
        // OCCUPY NEW BED
        // =================================================

        destinationBed.status =
            "occupied";

        destinationBed.currentPatient =
            admission.patient;

        await destinationBed.save();

        // =================================================
        // RETURN UPDATED ADMISSION
        // =================================================

        const updatedAdmission =
            await Admission.findById(
                admission._id
            )
                .populate({
                    path: "patient",
                    populate: {
                        path: "user",
                        select:
                            "name email phone"
                    }
                })
                .populate(
                    "room",
                    "roomNumber roomType dailyRate"
                )
                .populate(
                    "bed",
                    "bedNumber status"
                )
                .populate({
                    path: "doctor",
                    populate: {
                        path: "user",
                        select: "name"
                    }
                })
                .populate(
                    "billingSegments.room",
                    "roomNumber roomType dailyRate"
                )
                .populate(
                    "billingSegments.bed",
                    "bedNumber"
                );

        return res.status(200).json({
            success: true,
            message:
                "Patient transferred successfully",
            admission:
                updatedAdmission
        });
    } catch (error) {
        console.error(
            "Transfer patient error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to transfer patient",
            error: error.message
        });
    }
};

// =====================================================
// GET ADMISSIONS
// =====================================================

const getAdmissions = async (req, res) => {
    try {
        const {
            status = "admitted"
        } = req.query;

        const query =
            status === "all"
                ? {}
                : { status };

        const admissions =
            await Admission.find(query)
                .populate({
                    path: "patient",
                    populate: {
                        path: "user",
                        select:
                            "name email phone"
                    }
                })
                .populate(
                    "room",
                    "roomNumber roomType dailyRate"
                )
                .populate(
                    "bed",
                    "bedNumber status"
                )
                .populate({
                    path: "doctor",
                    populate: {
                        path: "user",
                        select: "name"
                    }
                })
                .sort({
                    admissionDate: -1
                });

        return res.status(200).json({
            success: true,
            admissions
        });

    } catch (error) {
        console.error(
            "Get admissions error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load admissions"
        });
    }
};


// =====================================================
// GET SINGLE ADMISSION
// =====================================================

const getAdmissionById = async (req, res) => {
    try {
        const admission =
            await Admission.findById(
                req.params.id
            )
                .populate({
                    path: "patient",
                    populate: {
                        path: "user",
                        select:
                            "name email phone"
                    }
                })
                .populate(
                    "room",
                    "roomNumber roomType dailyRate"
                )
                .populate(
                    "bed",
                    "bedNumber status"
                )
                .populate(
    "billingSegments.room",
    "roomNumber roomType dailyRate"
)
.populate(
    "billingSegments.bed",
    "bedNumber status"
)
                .populate({
                    path: "doctor",
                    populate: {
                        path: "user",
                        select: "name"
                    }
                })
                .populate(
                    "transfers.fromRoom",
                    "roomNumber roomType"
                )
                .populate(
                    "transfers.toRoom",
                    "roomNumber roomType"
                )
                .populate(
                    "transfers.fromBed",
                    "bedNumber"
                )
                .populate(
                    "transfers.toBed",
                    "bedNumber"
                );

        if (!admission) {
            return res.status(404).json({
                success: false,
                message:
                    "Admission not found"
            });
        }

        return res.status(200).json({
            success: true,
            admission
        });

    } catch (error) {
        console.error(
            "Get admission error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load admission"
        });
    }
};


module.exports = {
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
};