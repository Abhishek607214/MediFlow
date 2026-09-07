import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/receptionist.css";

function ReceptionistAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // ================= LOAD APPOINTMENTS =================

    const getAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/receptionist/appointments"
            );

            console.log(
                "RECEPTIONIST APPOINTMENTS:",
                response.data
            );

            if (response.data.success) {
                setAppointments(
                    response.data.appointments || []
                );
            } else {
                setError(
                    response.data.message ||
                    "Unable to load appointments"
                );
            }
        } catch (error) {
            console.error(
                "RECEPTIONIST APPOINTMENTS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load appointments"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    // ================= UPDATE STATUS =================

    const updateStatus = async (appointmentId, status) => {
        try {
            const response = await api.put(
                `/receptionist/appointments/${appointmentId}/status`,
                { status }
            );

            if (response.data.success) {
                getAppointments();
            } else {
                alert(
                    response.data.message ||
                    "Unable to update appointment"
                );
            }
        } catch (error) {
            console.error(
                "UPDATE APPOINTMENT ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update appointment"
            );
        }
    };

    // ================= SEARCH =================

    const filteredAppointments = appointments.filter(
        (appointment) => {
            const patientName =
                appointment.patient?.name || "";

            const doctorName =
                appointment.doctor?.user?.name || "";

            const specialization =
                appointment.doctor?.specialization || "";

            const searchText = search.toLowerCase();

            return (
                patientName.toLowerCase().includes(searchText) ||
                doctorName.toLowerCase().includes(searchText) ||
                specialization
                    .toLowerCase()
                    .includes(searchText) ||
                appointment.status
                    ?.toLowerCase()
                    .includes(searchText)
            );
        }
    );

    // ================= LOADING =================

    if (loading) {
        return (
            <AdminLayout
                title="Receptionist Appointments"
                role="receptionist"
            >
                <div className="receptionist-page">
                    <p>Loading appointments...</p>
                </div>
            </AdminLayout>
        );
    }

    // ================= UI =================

    return (
        <AdminLayout
            title="Receptionist Appointments"
            role="receptionist"
        >
            <div className="receptionist-page">

                {/* HEADER */}

                <div className="receptionist-intro">
                    <div>
                        <h1>Appointments</h1>

                        <p>
                            View and manage all hospital
                            appointments.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={getAppointments}
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

                {/* SEARCH */}

                <div className="receptionist-search">
                    <input
                        type="text"
                        placeholder="Search patient, doctor, specialization or status..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                {/* APPOINTMENT COUNT */}

                <div className="receptionist-section-header">
                    <h2>All Appointments</h2>

                    <span>
                        {filteredAppointments.length} Appointments
                    </span>
                </div>

                {/* EMPTY */}

                {filteredAppointments.length === 0 ? (
                    <div className="no-appointments">
                        <span>📅</span>

                        <h3>
                            No appointments found
                        </h3>

                        <p>
                            There are currently no appointments
                            matching your search.
                        </p>
                    </div>
                ) : (

                    /* TABLE */

                    <div className="receptionist-table-wrapper">

                        <table className="receptionist-table">

                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Specialization</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredAppointments.map(
                                    (appointment) => (

                                        <tr
                                            key={
                                                appointment._id
                                            }
                                        >

                                            {/* PATIENT */}

                                            <td>
                                                {appointment.patient?.name ||
                                                    "Patient"}
                                            </td>

                                            {/* DOCTOR */}

                                            <td>
                                                {appointment.doctor
                                                    ?.user?.name ||
                                                    "Doctor"}
                                            </td>

                                            {/* SPECIALIZATION */}

                                            <td>
                                                {appointment.doctor
                                                    ?.specialization ||
                                                    "-"}
                                            </td>

                                            {/* DATE */}

                                            <td>
                                                {appointment.date
                                                    ? new Date(
                                                        appointment.date
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            {/* TIME */}

                                            <td>
                                                {appointment.time ||
                                                    "-"}
                                            </td>

                                            {/* REASON */}

                                            <td>
                                                {appointment.reason ||
                                                    "Not specified"}
                                            </td>

                                            {/* STATUS */}

                                            <td>
                                                <span
                                                    className={`receptionist-status ${appointment.status}`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="appointment-actions">

                                                    {appointment.status ===
                                                        "pending" && (
                                                            <button
                                                                className="action-btn confirm"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        appointment._id,
                                                                        "confirmed"
                                                                    )
                                                                }
                                                            >
                                                                Confirm
                                                            </button>
                                                        )}

                                                    {appointment.status ===
                                                        "confirmed" && (
                                                            <button
                                                                className="action-btn complete"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        appointment._id,
                                                                        "completed"
                                                                    )
                                                                }
                                                            >
                                                                Complete
                                                            </button>
                                                        )}

                                                    {(appointment.status ===
                                                        "pending" ||
                                                        appointment.status ===
                                                        "confirmed") && (
                                                            <button
                                                                className="action-btn cancel"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        appointment._id,
                                                                        "cancelled"
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}

                                                    {(appointment.status ===
                                                        "completed" ||
                                                        appointment.status ===
                                                        "cancelled") && (
                                                            <span>
                                                                —
                                                            </span>
                                                        )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>
        </AdminLayout>
    );
}

export default ReceptionistAppointments;