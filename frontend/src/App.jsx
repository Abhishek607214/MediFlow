import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import PatientsDashboard from "./pages/PatientsDashboard";
import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfile from "./pages/DoctorProfile";
import Register from "./pages/Register";
import PatientProfile from "./pages/PatientProfile";
import Home from "./pages/Home";

import AdminDashboard from "./pages/AdminDashboard";
import AdminDoctors from "./pages/AdminDoctors";
import AdminPatients from "./pages/AdminPatients";
import AdminAppointments from "./pages/AdminAppointments";
import AdminDepartments from "./pages/AdminDepartments";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import ReceptionistAppointments from "./pages/ReceptionistAppointments";
import ReceptionistPatients from "./pages/ReceptionistPatients";
import ReceptionistDoctors from "./pages/ReceptionistDoctors";
import ReceptionistProfile from "./pages/ReceptionistProfile";
import ReceptionistSettings from "./pages/ReceptionistSettings";
import MedicalReports from "./pages/MedicalReports";
import BedRoomManagement from "./pages/BedRoomManagement";

import "./App.css";


function Navbar() {

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const role = user?.role;


    const handleLogout = () => {

        localStorage.removeItem("user");

        window.location.href = "/";

    };


    if (!user) {
        return null;
    }


    return (

        <nav className="navbar">

            <div className="navbar-brand">
                🏥 MediFlow
            </div>


            <div className="navbar-links">

                {/* ================= PATIENT ================= */}

                {role === "patient" && (
                    <>
                        <a href="/dashboard">
                            Dashboard
                        </a>

                        <a href="/doctors">
                            Doctors
                        </a>

                        <a href="/appointments">
                            Appointments
                        </a>

                        <a href="/patient-profile">
                            Profile
                        </a>
                    </>
                )}


                {/* ================= DOCTOR ================= */}

                {role === "doctor" && (
                    <>
                        <a href="/doctor-dashboard">
                            Dashboard
                        </a>

                        <a href="/doctor-dashboard">
                            Appointments
                        </a>

                        <a href="/doctor-profile">
                            Profile
                        </a>
                    </>
                )}


                {/* ================= ADMIN ================= */}

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>

    );
}


function App() {

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    return (

        <BrowserRouter>

      {user &&
    (user.role === "patient" || user.role === "doctor") && (  <Navbar /> )}

            <Routes>

                {/* ================= PUBLIC ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================= PATIENT ================= */}

                <Route
                    path="/dashboard"
                    element={<PatientsDashboard />}
                />

                <Route
                    path="/patient-profile"
                    element={<PatientProfile />}
                />

                <Route
                    path="/doctors"
                    element={<Doctors />}
                />

                <Route
                    path="/book-appointment"
                    element={<BookAppointment />}
                />

                <Route
                    path="/appointments"
                    element={<Appointments />}
                />


                {/* ================= DOCTOR ================= */}

                <Route
                    path="/doctor-dashboard"
                    element={<DoctorDashboard />}
                />

                <Route
                    path="/doctor-profile"
                    element={<DoctorProfile />}
                />


                {/* ================= ADMIN ================= */}

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/doctors"
                    element={<AdminDoctors />}
                />

                <Route
                   path="/admin/patients"
                   element={<AdminPatients />}
                />

                {/* ================= FALLBACK ================= */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
                <Route
                    path="/admin/appointments"
                    element={<AdminAppointments />}
                />

                <Route
                   path="/admin/departments"
                   element={<AdminDepartments />}
                />

                <Route
                  path="/admin/users"
                  element={<AdminUsers />}
                />

                <Route
                   path="/admin/reports"
                  element={<AdminReports />}
                />

                <Route
                  path="/admin/settings"
                element={<AdminSettings />}
                />

                <Route
                path="/receptionist-dashboard"
                element={<ReceptionistDashboard />}
                />

               <Route
                path="/receptionist/appointments"
                element={<ReceptionistAppointments />}
                />

               <Route
                path="/receptionist/patients"
               element={<ReceptionistPatients />}
               />

               <Route
                path="/receptionist/doctors"
                element={<ReceptionistDoctors />}
               />

               <Route
                path="/receptionist-profile"
               element={<ReceptionistProfile />}
               />

               <Route
               path="/receptionist-settings"
               element={<ReceptionistSettings />}
               />

               <Route
                path="/medical-reports"
                element={<MedicalReports />}
               />

               <Route
               path="/bed-room-management"
               element={<BedRoomManagement />}
               />

            </Routes>

        </BrowserRouter>

    );
}


export default App;