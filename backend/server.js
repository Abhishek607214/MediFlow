const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const setupPersonalChatSocket = require(
    "./sockets/Personal.chat.socket"
);

const setupVideoConsultationSocket = require(
    "./sockets/Video.consultation.socket"
);

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
const personalChatRoutes = require(
    "./routes/Personal.chat.routes"
);

const videoConsultationRoutes = require(
    "./routes/Video.consultation.routes"
);


connectDB();


const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(cookieParser());


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/patients",
    patientRoutes
);

app.use(
    "/api/appointments",
    appointmentRoutes
);

app.use(
    "/api/doctors",
    doctorRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/departments",
    departmentRoutes
);

app.use(
    "/api/receptionist",
    receptionistRoutes
);

app.use(
    "/api/reports",
    reportRoutes
);

app.use(
    "/api/chat",
    chatRoutes
);

app.use(
    "/api/bed-rooms",
    bedRoomRoutes
);

app.use(
    "/api/personal-chat",
    personalChatRoutes
);

app.use(
    "/api/video-consultation",
    videoConsultationRoutes
);


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "MediFlow API is running"
    });

});


// ==========================================
// PORT
// ==========================================

const PORT =
    process.env.PORT || 5000;


// ==========================================
// HTTP SERVER
// ==========================================

const server =
    http.createServer(app);


// ==========================================
// SOCKET.IO SERVER
// ==========================================

const io =
    new Server(server, {

        cors: {
            origin:
                "http://localhost:5173",

            credentials: true
        }

    });


// ==========================================
// PERSONAL CHAT SOCKET
// ==========================================

setupPersonalChatSocket(io);


// ==========================================
// VIDEO CONSULTATION SOCKET
// ==========================================

setupVideoConsultationSocket(io);


// ==========================================
// START SERVER
// ==========================================

server.listen(
    PORT,
    () => {

        console.log(
            `MediFlow server running on port ${PORT}`
        );

    }
);