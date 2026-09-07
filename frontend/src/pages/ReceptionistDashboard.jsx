import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/receptionist.css";

function ReceptionistDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= LOAD DATA =================

    const getDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            // Temporary endpoints
            // We will create receptionist backend APIs next

const appointmentResponse = await api.get(
    "/receptionist/appointments"
);

const patientResponse = await api.get(
    "/receptionist/patients"
);

            if (appointmentResponse.data.success) {
                setAppointments(
                    appointmentResponse.data.appointments || []
                );
            }

            if (patientResponse.data.success) {
                setPatients(
                    patientResponse.data.patients || []
                );
            }

        } catch (error) {
            console.error(
                "RECEPTIONIST DASHBOARD ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    // ================= TODAY =================

    const today = new Date().toDateString();

    const todayAppointments = appointments.filter(
        (appointment) =>
            new Date(
                appointment.date
            ).toDateString() === today
    );

    // ================= STATISTICS =================

    const pendingAppointments =
        todayAppointments.filter(
            (appointment) =>
                appointment.status === "pending"
        );

    const confirmedAppointments =
        todayAppointments.filter(
            (appointment) =>
                appointment.status === "confirmed"
        );

    const completedAppointments =
        todayAppointments.filter(
            (appointment) =>
                appointment.status === "completed"
        );

    // ================= LOADING =================

    if (loading) {
        return (
            <AdminLayout
                title="Receptionist Dashboard"
                role="receptionist"
            >
                <p>Loading dashboard...</p>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Receptionist Dashboard"
            role="receptionist"
        >
            <div className="receptionist-dashboard">

                {/* INTRO */}

                <div className="receptionist-intro">
                    <div>
                        <h1>Receptionist Dashboard</h1>

                        <p>
                            Manage appointments, patients,
                            and daily hospital activities.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={getDashboardData}
                    >
                        ↻ Refresh
                    </button>
                </div>

                {/* ERROR */}

                {error && (
                    <div className="receptionist-error">
                        {error}
                    </div>
                )}

                {/* STATISTICS */}

                <div className="receptionist-stats">

                    <div className="receptionist-stat-card">
                        <span className="stat-icon">
                            📅
                        </span>

                        <div>
                            <span className="stat-label">
                                Today's Appointments
                            </span>

                            <strong>
                                {todayAppointments.length}
                            </strong>
                        </div>
                    </div>

                    <div className="receptionist-stat-card">
                        <span className="stat-icon">
                            ⏳
                        </span>

                        <div>
                            <span className="stat-label">
                                Pending
                            </span>

                            <strong>
                                {pendingAppointments.length}
                            </strong>
                        </div>
                    </div>

                    <div className="receptionist-stat-card">
                        <span className="stat-icon">
                            ✓
                        </span>

                        <div>
                            <span className="stat-label">
                                Confirmed
                            </span>

                            <strong>
                                {confirmedAppointments.length}
                            </strong>
                        </div>
                    </div>

                    <div className="receptionist-stat-card">
                        <span className="stat-icon">
                            ✓
                        </span>

                        <div>
                            <span className="stat-label">
                                Completed
                            </span>

                            <strong>
                                {completedAppointments.length}
                            </strong>
                        </div>
                    </div>

                    <div className="receptionist-stat-card">
                        <span className="stat-icon">
                            👤
                        </span>

                        <div>
                            <span className="stat-label">
                                Total Patients
                            </span>

                            <strong>
                                {patients.length}
                            </strong>
                        </div>
                    </div>

                </div>

                {/* TODAY'S APPOINTMENTS */}

                <div className="today-appointments-section">

                    <div className="section-header">

                        <div>
                            <h2>
                                Today's Appointments
                            </h2>

                            <p>
                                View all appointments scheduled for today.
                            </p>
                        </div>

                        <span className="appointment-count">
                            {todayAppointments.length} Appointments
                        </span>

                    </div>

                    {todayAppointments.length === 0 ? (

                        <div className="no-appointments">
                            <span>📅</span>

                            <h3>
                                No appointments today
                            </h3>

                            <p>
                                There are no appointments
                                scheduled for today.
                            </p>
                        </div>

                    ) : (

                        <div className="receptionist-table-wrapper">

                            <table className="receptionist-table">

                                <thead>

                                    <tr>
                                        <th>Patient</th>
                                        <th>Doctor</th>
                                        <th>Specialization</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {todayAppointments.map(
                                        (appointment) => (

                                            <tr
                                                key={
                                                    appointment._id
                                                }
                                            >

                                                <td>
                                                    {appointment
                                                        .patient
                                                        ?.name ||
                                                        "Patient"}
                                                </td>

                                                <td>
                                                    {appointment
                                                        .doctor
                                                        ?.user
                                                        ?.name ||
                                                        "Doctor"}
                                                </td>

                                                <td>
                                                    {appointment
                                                        .doctor
                                                        ?.specialization ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {appointment.time}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            `receptionist-status ${appointment.status}`
                                                        }
                                                    >
                                                        {
                                                            appointment.status
                                                        }
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>
        </AdminLayout>
    );
}

export default ReceptionistDashboard;
