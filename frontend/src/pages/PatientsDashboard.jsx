import { useNavigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";

function PatientsDashboard() {

    const navigate = useNavigate();

    return (

        <div className="dashboard-page">

            <div className="dashboard-header">

                <div>

                    <h1>Patient Dashboard</h1>

                    <p>Welcome back to MediFlow 👋</p>

                </div>

            </div>


            <div className="dashboard-cards">

                {/* MY APPOINTMENTS */}

                <div className="dashboard-card">

                    <div className="card-icon">📅</div>

                    <h2>My Appointments</h2>

                    <p>
                        View and manage your upcoming
                        and previous appointments.
                    </p>

                    <button
                        onClick={() => navigate("/appointments")}
                    >
                        View Appointments
                    </button>

                </div>


                {/* FIND DOCTORS */}

                <div className="dashboard-card">

                    <div className="card-icon">👨‍⚕️</div>

                    <h2>Find Doctors</h2>

                    <p>
                        Browse available doctors and
                        find the right specialist for you.
                    </p>

                    <button
                        onClick={() => navigate("/doctors")}
                    >
                        Find a Doctor
                    </button>

                </div>


                {/* BOOK APPOINTMENT */}

                <div className="dashboard-card">

                    <div className="card-icon">➕</div>

                    <h2>Book Appointment</h2>

                    <p>
                        Choose a doctor and schedule
                        your next consultation.
                    </p>

                    <button
                        onClick={() => navigate("/book-appointment")}
                    >
                        Book Now
                    </button>

                </div>


                {/* NEW — MEDICAL REPORTS */}

                <div className="dashboard-card">

                    <div className="card-icon">📋</div>

                    <h2>Medical Reports</h2>

                    <p>
                        View reports, prescriptions,
                        diagnoses, and test results
                        provided by your doctor.
                    </p>

                    <button
                        onClick={() => navigate("/medical-reports")}
                    >
                        View Reports
                    </button>

                </div>

            </div>



            <div className="dashboard-info">

                <h2>Why use MediFlow?</h2>

                <div className="info-grid">

                    <div>

                        <span>🔒</span>

                        <h3>Secure</h3>

                        <p>
                            Your healthcare information
                            is handled securely.
                        </p>

                    </div>


                    <div>

                        <span>⚡</span>

                        <h3>Easy Booking</h3>

                        <p>
                            Book appointments quickly
                            with your preferred doctor.
                        </p>

                    </div>


                    <div>

                        <span>📋</span>

                        <h3>Track Appointments</h3>

                        <p>
                            Easily track your appointment
                            status.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default PatientsDashboard;