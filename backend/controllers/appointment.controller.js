const Appointment = require("../models/appointment.model");
const Patient = require("../models/patient.model");
const Doctor = require("../models/doctor.model");

// Create appointment
const createAppointment = async (req, res) => {
    try {
        const { doctor, date, time, reason } = req.body;

        const doctorId = String(doctor).replace(/^"|"$/g, "");

        console.log("DOCTOR FROM BODY:", doctor);
        console.log("DOCTOR ID:", doctorId);

        // Required fields
        if (!doctor || !date || !time) {
            return res.status(400).json({
                success: false,
                message: "Doctor, date and time are required"
            });
        }

        // Find logged-in patient's profile
        const patient = await Patient.findOne({
            user: req.user._id
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient profile not found"
            });
        }

        // Find doctor
        const doctorProfile = await Doctor.findById(doctorId);

        if (!doctorProfile) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found"
            });
        }

        // ---------------------------------------
        // CHECK DATE
        // ---------------------------------------

        const selectedDate = new Date(date);

        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date"
            });
        }

        // ---------------------------------------
        // CHECK DOCTOR AVAILABLE DAY
        // ---------------------------------------

        const dayName = selectedDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                timeZone: "UTC"
            }
        );

        const isAvailableDay =
            doctorProfile.availableDays &&
            doctorProfile.availableDays.some(
                (day) =>
                    day.toLowerCase() === dayName.toLowerCase()
            );

        if (!isAvailableDay) {
            return res.status(400).json({
                success: false,
                message: `Doctor is not available on ${dayName}`
            });
        }

        // ---------------------------------------
        // CHECK DOCTOR AVAILABLE TIME
        // ---------------------------------------

        if (
            !doctorProfile.availableTime ||
            !doctorProfile.availableTime.start ||
            !doctorProfile.availableTime.end
        ) {
            return res.status(400).json({
                success: false,
                message: "Doctor has no available time configured"
            });
        }

        const start = doctorProfile.availableTime.start;
        const end = doctorProfile.availableTime.end;

        // ---------------------------------------
        // CONVERT TIME TO MINUTES
        // ---------------------------------------

        const timeToMinutes = (value) => {
            const [hours, minutes] = value
                .split(":")
                .map(Number);

            return hours * 60 + minutes;
        };

        const startMinutes = timeToMinutes(start);
        const endMinutes = timeToMinutes(end);
        const selectedMinutes = timeToMinutes(time);

        // ---------------------------------------
        // VALIDATE TIME FORMAT
        // ---------------------------------------

        if (
            !/^\d{2}:\d{2}$/.test(time)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid time format"
            });
        }

        // ---------------------------------------
        // CHECK TIME IS WITHIN WORKING HOURS
        // ---------------------------------------

        if (
            selectedMinutes < startMinutes ||
            selectedMinutes >= endMinutes
        ) {
            return res.status(400).json({
                success: false,
                message: `Doctor is available from ${start} to ${end}`
            });
        }

        // ---------------------------------------
        // CHECK 30-MINUTE SLOT
        // ---------------------------------------

        if (
            (selectedMinutes - startMinutes) % 30 !== 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid 30-minute appointment slot"
            });
        }

        // ---------------------------------------
        // CHECK IF SLOT IS ALREADY BOOKED
        // ---------------------------------------

        const existingAppointment =
            await Appointment.findOne({
                doctor: doctorProfile._id,
                date: selectedDate,
                time,
                status: {
                    $in: ["pending", "confirmed"]
                }
            });

        if (existingAppointment) {
            return res.status(409).json({
                success: false,
                message:
                    "Doctor is already booked for this date and time"
            });
        }

        // ---------------------------------------
        // CREATE APPOINTMENT
        // ---------------------------------------

        const appointment = await Appointment.create({
            patient: patient._id,
            doctor: doctorProfile._id,
            date: selectedDate,
            time,
            reason
        });

        return res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            appointment
        });

    } catch (error) {
        console.error(
            "Create appointment error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get available appointment slots for a doctor
const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;

        // Check date
        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required"
            });
        }

        // Check doctor
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found"
            });
        }

        // Check available days
        if (
            !doctor.availableDays ||
            doctor.availableDays.length === 0
        ) {
            return res.status(200).json({
                success: true,
                slots: [],
                bookedSlots: [],
                message: "Doctor has no available days configured"
            });
        }

        // Validate date
        const selectedDate = new Date(`${date}T00:00:00.000Z`);

        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date"
            });
        }

        // Get day name
        const dayName = selectedDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                timeZone: "UTC"
            }
        );

        // Check doctor's working day
        const isAvailableDay = doctor.availableDays.some(
            (day) =>
                day.toLowerCase().trim() ===
                dayName.toLowerCase()
        );

        if (!isAvailableDay) {
            return res.status(200).json({
                success: true,
                date,
                day: dayName,
                slots: [],
                bookedSlots: [],
                message: `Doctor is not available on ${dayName}`
            });
        }

        // Check working hours
        if (
            !doctor.availableTime ||
            !doctor.availableTime.start ||
            !doctor.availableTime.end
        ) {
            return res.status(200).json({
                success: true,
                date,
                day: dayName,
                slots: [],
                bookedSlots: [],
                message: "Doctor has no available time configured"
            });
        }

        const start = doctor.availableTime.start;
        const end = doctor.availableTime.end;

        // Convert HH:mm to minutes
        const timeToMinutes = (time) => {
            const [hours, minutes] = time
                .split(":")
                .map(Number);

            return hours * 60 + minutes;
        };

        // Convert minutes to HH:mm
        const minutesToTime = (minutes) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;

            return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
        };

        const startMinutes = timeToMinutes(start);
        const endMinutes = timeToMinutes(end);

        // Generate 30-minute slots
        const allSlots = [];

        for (
            let minutes = startMinutes;
            minutes < endMinutes;
            minutes += 30
        ) {
            allSlots.push(
                minutesToTime(minutes)
            );
        }

        // Create start/end range for selected date
        const startOfDay = new Date(
            `${date}T00:00:00.000Z`
        );

        const endOfDay = new Date(
            `${date}T23:59:59.999Z`
        );

        // Find booked appointments
        const appointments = await Appointment.find({
            doctor: doctor._id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: {
                $in: ["pending", "confirmed"]
            }
        });

        // Get booked times
        const bookedTimes = appointments.map(
            (appointment) => appointment.time
        );

        // Remove booked slots
        const availableSlots = allSlots.filter(
            (slot) => !bookedTimes.includes(slot)
        );

        return res.status(200).json({
            success: true,
            date,
            day: dayName,
            slots: availableSlots,
            bookedSlots: bookedTimes
        });

    } catch (error) {
        console.error(
            "Get available slots error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get patient's appointments
const getPatientAppointments = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            user: req.user._id
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient profile not found"
            });
        }

        const appointments = await Appointment.find({
            patient: patient._id
        })
            .populate({
                path: "doctor",
                populate: {
                    path: "user",
                    select: "name email phone"
                }
            })
            .sort({ date: 1 });

        return res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            user: req.user._id
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found"
            });
        }

        const appointments = await Appointment.find({
            doctor: doctor._id
        })
            .populate({
                path: "patient",
                populate: {
                    path: "user",
                    select: "name email phone"
                }
            })
            .sort({ date: 1 });

        return res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "confirmed",
            "rejected",
            "completed"
        ];

        // Check requested status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment status"
            });
        }

        // Find logged-in doctor
        const doctor = await Doctor.findOne({
            user: req.user._id
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found"
            });
        }

        // Find appointment belonging to this doctor
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            doctor: doctor._id
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Only pending appointments can be confirmed/rejected
        if (appointment.status === "pending") {

            if (
                status !== "confirmed" &&
                status !== "rejected"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Pending appointment can only be confirmed or rejected"
                });
            }
        }

        // Only confirmed appointments can be completed
        else if (appointment.status === "confirmed") {

            if (status !== "completed") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Confirmed appointment can only be marked completed"
                });
            }
        }

        // Rejected/cancelled/completed appointments cannot change
        else {
            return res.status(400).json({
                success: false,
                message:
                    `Appointment is already ${appointment.status} and cannot be changed`
            });
        }

        // Update status
        appointment.status = status;

        await appointment.save();

        return res.status(200).json({
            success: true,
            message:
                "Appointment status updated successfully",
            appointment
        });

    } catch (error) {
        console.error(
            "Update appointment status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Patient cancels their appointment
const cancelAppointment = async (req, res) => {
    try {
        // Find logged-in patient's profile
        const patient = await Patient.findOne({
            user: req.user._id
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient profile not found"
            });
        }

        // Find appointment belonging to this patient
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            patient: patient._id
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Prevent cancelling already completed/rejected/cancelled appointments
        if (
            appointment.status === "completed" ||
            appointment.status === "rejected" ||
            appointment.status === "cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: `Appointment cannot be cancelled because it is already ${appointment.status}`
            });
        }

        // Cancel appointment
        appointment.status = "cancelled";

        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            appointment
        });

    } catch (error) {
        console.error("Cancel appointment error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getAvailableSlots,
    getPatientAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    cancelAppointment
};
