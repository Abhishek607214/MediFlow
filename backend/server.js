const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const patientRoutes = require("./routes/patient.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const doctorRoutes = require("./routes/doctor.routes");
const adminRoutes = require("./routes/admin.routes");
const departmentRoutes = require("./routes/department.routes");
const receptionistRoutes = require("./routes/receptionist.routes");
const reportRoutes = require("./routes/report.routes");
const chatRoutes = require("./routes/chat.routes");
const bedRoomRoutes = require("./routes/bedRoom.routes");


connectDB();
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/receptionist", receptionistRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/bed-rooms",bedRoomRoutes);


// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "MediFlow API is running"
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`MediFlow server running on port ${PORT}`);
});