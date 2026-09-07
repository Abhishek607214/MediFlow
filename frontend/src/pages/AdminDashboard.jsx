import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

import "../styles/admin.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        pendingDoctors: 0,
        recentAppointments: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/admin/dashboard");

                console.log(
                    "ADMIN DASHBOARD RESPONSE:",
                    response.data
                );

                if (response.data.success) {
                    setStats(response.data.data);
                } else {
                    setError(
                        response.data.message ||
                        "Unable to load dashboard"
                    );
                }
            } catch (error) {
                console.error(
                    "ADMIN DASHBOARD ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <AdminLayout title="Admin Dashboard">
                <div className="admin-loading">
                    Loading dashboard...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Admin Dashboard">

            {/* ERROR */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* WELCOME */}

            <div className="admin-welcome">
                <h2>
                    Welcome back, Admin 👋
                </h2>

                <p>
                    Here's what's happening in MediFlow today.
                </p>
            </div>

            {/* STATISTICS */}

            <div className="admin-stats">

                <div className="admin-stat-card">

                    <div className="stat-icon">
                        👤
                    </div>

                    <div className="stat-info">
                        <p>Total Patients</p>
                        <h3>
                            {stats.totalPatients}
                        </h3>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="stat-icon">
                        🩺
                    </div>

                    <div className="stat-info">
                        <p>Total Doctors</p>
                        <h3>
                            {stats.totalDoctors}
                        </h3>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="stat-icon">
                        📅
                    </div>

                    <div className="stat-info">
                        <p>Total Appointments</p>
                        <h3>
                            {stats.totalAppointments}
                        </h3>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="stat-icon">
                        ⏳
                    </div>

                    <div className="stat-info">
                        <p>Pending Doctors</p>
                        <h3>
                            {stats.pendingDoctors}
                        </h3>
                    </div>

                </div>

            </div>

            {/* LOWER SECTION */}

            <div className="admin-dashboard-grid">

                {/* RECENT APPOINTMENTS */}

                <div className="admin-panel">

                    <div className="admin-panel-header">

                        <h3>
                            Recent Appointments
                        </h3>

                        <button
                            className="view-all"
                            onClick={() =>
                                navigate(
                                    "/admin/appointments"
                                )
                            }
                        >
                            View All
                        </button>

                    </div>

                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {stats.recentAppointments.length === 0 ? (

                                <tr>
                                    <td colSpan="4">
                                        No appointments found
                                    </td>
                                </tr>

                            ) : (

                                stats.recentAppointments.map(
                                    (appointment) => (

                                        <tr
                                            key={
                                                appointment._id
                                            }
                                        >

                                            <td>
                                                {appointment.patient?.user?.name ||
                                                    "Unknown Patient"}
                                            </td>

                                            <td>
                                                {appointment.doctor?.user?.name ||
                                                    "Unknown Doctor"}
                                            </td>

                                            <td>
                                                {new Date(
                                                    appointment.date
                                                ).toLocaleDateString()}
                                            </td>

                                            <td>
                                                <span
                                                    className={`status ${appointment.status}`}
                                                >
                                                    {
                                                        appointment.status
                                                    }
                                                </span>
                                            </td>

                                        </tr>
                                    )
                                )
                            )}

                        </tbody>

                    </table>

                </div>

                {/* QUICK ACTIONS */}

                <div className="admin-panel">

                    <div className="admin-panel-header">

                        <h3>
                            Quick Actions
                        </h3>

                    </div>

                    <div className="quick-actions">

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/admin/doctors"
                                )
                            }
                        >
                            🩺 Manage Doctors
                        </button>

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/admin/patients"
                                )
                            }
                        >
                            👤 Manage Patients
                        </button>

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/admin/appointments"
                                )
                            }
                        >
                            📅 Manage Appointments
                        </button>

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate(
                                    "/admin/departments"
                                )
                            }
                        >
                            🏥 Manage Departments
                        </button>

                    </div>

                </div>

            </div>

        </AdminLayout>
    );
}

export default AdminDashboard;