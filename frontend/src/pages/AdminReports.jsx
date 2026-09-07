import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/reports.css";

function AdminReports() {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getReports = async () => {
        try {
            const response = await api.get("/admin/reports");

            console.log("REPORTS RESPONSE:", response.data);

            if (response.data.success) {
                setReports(response.data.reports);
            }
        } catch (error) {
            console.error("REPORTS ERROR:", error);
            setError("Unable to load reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getReports();
    }, []);

if (loading) {
    return (
        <AdminLayout title="Reports">
            <div className="reports-page">
                <p>Loading reports...</p>
            </div>
        </AdminLayout>
    );
}

if (error) {
    return (
        <AdminLayout title="Reports">
            <div className="reports-page">
                <div className="reports-error">
                    {error}
                </div>
            </div>
        </AdminLayout>
    );
}

if (!reports) {
    return (
        <AdminLayout title="Reports">
            <div className="reports-page">
                <p>No report data available.</p>
            </div>
        </AdminLayout>
    );
}
    return (
        <AdminLayout title="Reports">
        <div className="reports-page">

            <div className="reports-intro">
                <h1>Reports</h1>
                <p>
                    View MediFlow statistics and system reports.
                </p>
            </div>

            {/* OVERVIEW */}

            <div className="reports-section">

                <h2>Overview</h2>

                <div className="reports-cards">

                    <div className="report-card">
                        <span className="report-card-title">
                            Total Users
                        </span>
                        <strong>
                            {reports.overview.totalUsers}
                        </strong>
                    </div>

                    <div className="report-card">
                        <span className="report-card-title">
                            Total Patients
                        </span>
                        <strong>
                            {reports.overview.totalPatients}
                        </strong>
                    </div>

                    <div className="report-card">
                        <span className="report-card-title">
                            Total Doctors
                        </span>
                        <strong>
                            {reports.overview.totalDoctors}
                        </strong>
                    </div>

                    <div className="report-card">
                        <span className="report-card-title">
                            Departments
                        </span>
                        <strong>
                            {reports.overview.totalDepartments}
                        </strong>
                    </div>

                    <div className="report-card">
                        <span className="report-card-title">
                            Appointments
                        </span>
                        <strong>
                            {reports.overview.totalAppointments}
                        </strong>
                    </div>

                </div>

            </div>

            {/* APPOINTMENT REPORT */}

            <div className="reports-section">

                <h2>Appointment Overview</h2>

                <div className="report-list">

                    <div>
                        <span>Pending</span>
                        <strong>
                            {reports.appointments.pending}
                        </strong>
                    </div>

                    <div>
                        <span>Confirmed</span>
                        <strong>
                            {reports.appointments.confirmed}
                        </strong>
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>
                            {reports.appointments.completed}
                        </strong>
                    </div>

                    <div>
                        <span>Rejected</span>
                        <strong>
                            {reports.appointments.rejected}
                        </strong>
                    </div>

                    <div>
                        <span>Cancelled</span>
                        <strong>
                            {reports.appointments.cancelled}
                        </strong>
                    </div>

                </div>

            </div>

            {/* DOCTOR REPORT */}

            <div className="reports-section">

                <h2>Doctor Approval</h2>

                <div className="report-list">

                    <div>
                        <span>Approved Doctors</span>
                        <strong>
                            {reports.doctors.approved}
                        </strong>
                    </div>

                    <div>
                        <span>Pending Doctors</span>
                        <strong>
                            {reports.doctors.pending}
                        </strong>
                    </div>

                    <div>
                        <span>Rejected Doctors</span>
                        <strong>
                            {reports.doctors.rejected}
                        </strong>
                    </div>

                </div>

            </div>

            {/* USER REPORT */}

            <div className="reports-section">

                <h2>User Accounts</h2>

                <div className="report-list">

                    <div>
                        <span>Active Users</span>
                        <strong>
                            {reports.users.active}
                        </strong>
                    </div>

                    <div>
                        <span>Inactive Users</span>
                        <strong>
                            {reports.users.inactive}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
        </AdminLayout>
    );
}

export default AdminReports;