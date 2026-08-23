import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

    // Don't show navbar on login page
    if (!user) {
        return null;
    }

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                🏥 MediFlow
            </div>

            <div className="navbar-links">

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

            {user && <Navbar />}

            <Routes>

                <Route 
                   path="/"
                   element={<Home/>}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

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

                <Route
                    path="/doctor-dashboard"
                    element={<DoctorDashboard />}
                />

                <Route
                    path="/doctor-profile"
                    element={<DoctorProfile />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;