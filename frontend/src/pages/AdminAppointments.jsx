import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/appointment.css";

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================
    // FETCH APPOINTMENTS
    // =========================================

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/appointments");

            console.log(
                "ADMIN APPOINTMENTS:",
                response.data
            );

            if (response.data.success) {
                setAppointments(
                    response.data.appointments ||
                    response.data.data ||
                    []
                );
            } else {
                setError(
                    response.data.message ||
                    "Unable to load appointments"
                );
            }
        } catch (error) {
            console.error(
                "APPOINTMENTS ERROR:",
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
        fetchAppointments();
    }, []);

    // =========================================
    // SEARCH + FILTER
    // =========================================

    const filteredAppointments = appointments.filter(
        (appointment) => {
            const searchText = search
                .toLowerCase()
                .trim();

            const patientName =
                appointment.patient?.user?.name ||
                "";

            const doctorName =
                appointment.doctor?.user?.name ||
                "";

            const patientEmail =
                appointment.patient?.user?.email ||
                "";

            const doctorEmail =
                appointment.doctor?.user?.email ||
                "";

            const matchesSearch =
                !searchText ||
                patientName
                    .toLowerCase()
                    .includes(searchText) ||
                doctorName
                    .toLowerCase()
                    .includes(searchText) ||
                patientEmail
                    .toLowerCase()
                    .includes(searchText) ||
                doctorEmail
                    .toLowerCase()
                    .includes(searchText);

            const matchesFilter =
                filter === "all" ||
                appointment.status === filter;

            return (
                matchesSearch &&
                matchesFilter
            );
        }
    );

    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(
            date
        ).toLocaleDateString();
    };

    // =========================================
    // FORMAT TIME
    // =========================================

    const formatTime = (time) => {
        if (!time) {
            return "—";
        }

        return time;
    };

    // =========================================
    // STATUS CLASS
    // =========================================

    const getStatusClass = (status) => {
        if (!status) {
            return "";
        }

        return status
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    // =========================================
    // CANCEL APPOINTMENT
    // =========================================

    const handleCancel = async (appointmentId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            await api.patch(
                `/admin/appointments/${appointmentId}/status`,
                {
                    status: "cancelled",
                }
            );

            await fetchAppointments();
        } catch (error) {
            console.error(
                "CANCEL APPOINTMENT ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to cancel appointment"
            );
        }
    };

const handleStatusChange = async (appointmentId, status) => {
    const confirmAction = window.confirm(
        `Are you sure you want to mark this appointment as ${status}?`
    );

    if (!confirmAction) {
        return;
    }

    try {
        await api.patch(
            `/admin/appointments/${appointmentId}/status`,
            {
                status: status,
            }
        );

        await fetchAppointments();
    } catch (error) {
        console.error(
            "APPOINTMENT STATUS ERROR:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Unable to update appointment status"
        );
    }
};

    return (
        <AdminLayout
            title="Appointment Management"
            role="admin"
        >

            <div className="appointment-page">

                {/* =====================================
                    INTRO
                ===================================== */}

                <div className="appointment-page-intro">

                    <h1>
                        Manage Appointments
                    </h1>

                    <p>
                        View and manage all MediFlow appointments.
                    </p>

                </div>


                {/* =====================================
                    SEARCH + FILTER
                ===================================== */}

                <div className="appointment-search-box">

                    <input
                        type="text"
                        placeholder="Search patient or doctor..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <button
                        className="appointment-search-btn"
                    >
                        Search
                    </button>

                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                    >

                        <option value="all">
                            All Appointments
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="confirmed">
                            Confirmed
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="rejected">
                            Rejected
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>

                    </select>

                </div>


                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {/* =====================================
                    TABLE
                ===================================== */}

                <div className="appointment-table-card">

                    <h2>
                        Appointments (
                        {filteredAppointments.length}
                        )
                    </h2>

                    {loading ? (

                        <p>
                            Loading appointments...
                        </p>

                    ) : filteredAppointments.length === 0 ? (

                        <p>
                            No appointments found.
                        </p>

                    ) : (

                        <div className="appointment-table-wrapper">

                            <table className="appointment-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Patient
                                        </th>

                                        <th>
                                            Doctor
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Time
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

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

                                                    <div className="appointment-person">

                                                        <strong>
                                                            {appointment.patient?.user?.name ||
                                                                "Unknown Patient"}
                                                        </strong>

                                                        <span>
                                                            {appointment.patient?.user?.email ||
                                                                "—"}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* DOCTOR */}

                                                <td>

                                                    <div className="appointment-person">

                                                        <strong>
                                                            {appointment.doctor?.user?.name ||
                                                                "Unknown Doctor"}
                                                        </strong>

                                                        <span>
                                                            {appointment.doctor?.specialization ||
                                                                "Doctor"}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* DATE */}

                                                <td>

                                                    {formatDate(
                                                        appointment.date
                                                    )}

                                                </td>


                                                {/* TIME */}

                                                <td>

                                                    {formatTime(
                                                        appointment.time
                                                    )}

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`appointment-status ${getStatusClass(
                                                            appointment.status
                                                        )}`}
                                                    >
                                                        {appointment.status ||
                                                            "Unknown"}
                                                    </span>

                                                </td>


                                             {/* ACTION */}

<td>
    <div className="appointment-actions">

        {/* PENDING */}
        {appointment.status === "pending" && (
            <>
                <button
                    className="appointment-action-btn confirm"
                    onClick={() =>
                        handleStatusChange(
                            appointment._id,
                            "confirmed"
                        )
                    }
                >
                    Confirm
                </button>

                <button
                    className="appointment-action-btn reject"
                    onClick={() =>
                        handleStatusChange(
                            appointment._id,
                            "rejected"
                        )
                    }
                >
                    Reject
                </button>
            </>
        )}

        {/* CONFIRMED */}
        {appointment.status === "confirmed" && (
            <>
                <button
                    className="appointment-action-btn complete"
                    onClick={() =>
                        handleStatusChange(
                            appointment._id,
                            "completed"
                        )
                    }
                >
                    Complete
                </button>

                <button
                    className="appointment-action-btn cancel"
                    onClick={() =>
                        handleStatusChange(
                            appointment._id,
                            "cancelled"
                        )
                    }
                >
                    Cancel
                </button>
            </>
        )}

        {/* REJECTED */}
        {appointment.status === "rejected" && (
            <button
                className="appointment-action-btn cancel"
                onClick={() =>
                    handleStatusChange(
                        appointment._id,
                        "cancelled"
                    )
                }
            >
                Cancel
            </button>
        )}

        {/* COMPLETED / CANCELLED */}
        {(appointment.status === "completed" ||
            appointment.status === "cancelled") && (
            <span className="appointment-no-action">
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

            </div>

        </AdminLayout>
    );
}

export default AdminAppointments; 