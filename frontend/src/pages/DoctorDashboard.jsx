import { useEffect, useState } from "react";
import api from "../services/api";

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const getAppointments = async () => {
        try {
            setError("");

            const response = await api.get(
                "/appointments/doctor"
            );

            console.log(
                "DOCTOR APPOINTMENTS:",
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
                "DOCTOR APPOINTMENTS ERROR:",
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

    // ---------------------------------------
    // UPDATE APPOINTMENT STATUS
    // ---------------------------------------

    const updateStatus = async (
        appointmentId,
        status
    ) => {
        try {
            setError("");

            const response = await api.put(
                `/appointments/${appointmentId}/status`,
                {
                    status
                }
            );

            console.log(
                "UPDATE APPOINTMENT:",
                response.data
            );

            if (response.data.success) {

                // Refresh appointments
                await getAppointments();

            } else {
                setError(
                    response.data.message ||
                    "Unable to update appointment"
                );
            }

        } catch (error) {
            console.error(
                "UPDATE STATUS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update appointment"
            );
        }
    };

    // ---------------------------------------
    // COUNT APPOINTMENTS
    // ---------------------------------------

    const total = appointments.length;

    const pending = appointments.filter(
        (appointment) =>
            appointment.status === "pending"
    ).length;

    const confirmed = appointments.filter(
        (appointment) =>
            appointment.status === "confirmed"
    ).length;

    const completed = appointments.filter(
        (appointment) =>
            appointment.status === "completed"
    ).length;

    const rejected = appointments.filter(
        (appointment) =>
            appointment.status === "rejected"
    ).length;

    const cancelled = appointments.filter(
        (appointment) =>
            appointment.status === "cancelled"
    ).length;

    // ---------------------------------------
    // FILTER APPOINTMENTS
    // ---------------------------------------

    const filteredAppointments =
        activeFilter === "all"
            ? appointments
            : appointments.filter(
                (appointment) =>
                    appointment.status === activeFilter
            );

    // ---------------------------------------
    // LOADING
    // ---------------------------------------

    if (loading) {
        return (
            <div className="page-container">
                <h1>Doctor Dashboard</h1>
                <p>Loading appointments...</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <h1>Doctor Dashboard</h1>

            <p>
                Manage your patient appointments.
            </p>

            {/* Error */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* -------------------------------- */}
            {/* APPOINTMENT STATISTICS */}
            {/* -------------------------------- */}

            <div className="appointment-stats">

                <div className="stat-card">
                    <h3>Total</h3>
                    <strong>{total}</strong>
                </div>

                <div className="stat-card">
                    <h3>Pending</h3>
                    <strong>{pending}</strong>
                </div>

                <div className="stat-card">
                    <h3>Confirmed</h3>
                    <strong>{confirmed}</strong>
                </div>

                <div className="stat-card">
                    <h3>Completed</h3>
                    <strong>{completed}</strong>
                </div>

                <div className="stat-card">
                    <h3>Rejected</h3>
                    <strong>{rejected}</strong>
                </div>

                <div className="stat-card">
                    <h3>Cancelled</h3>
                    <strong>{cancelled}</strong>
                </div>

            </div>

            {/* -------------------------------- */}
            {/* FILTER BUTTONS */}
            {/* -------------------------------- */}

            <div className="appointment-filters">

                <button
                    className={
                        activeFilter === "all"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveFilter("all")
                    }
                >
                    All
                </button>

                <button
                    className={
                        activeFilter === "pending"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveFilter("pending")
                    }
                >
                    Pending
                </button>

                <button
                    className={
                        activeFilter === "confirmed"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveFilter("confirmed")
                    }
                >
                    Confirmed
                </button>

                <button
                    className={
                        activeFilter === "completed"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveFilter("completed")
                    }
                >
                    Completed
                </button>

                <button
                    className={
                        activeFilter === "rejected"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveFilter("rejected")
                    }
                >
                    Rejected
                </button>

                <button
                    className={
                        activeFilter === "cancelled"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveFilter("cancelled")
                    }
                >
                    Cancelled
                </button>

            </div>

            {/* -------------------------------- */}
            {/* NO APPOINTMENTS */}
            {/* -------------------------------- */}

            {filteredAppointments.length === 0 && (
                <p>
                    No {activeFilter === "all"
                        ? ""
                        : activeFilter} appointments found.
                </p>
            )}

            {/* -------------------------------- */}
            {/* APPOINTMENT LIST */}
            {/* -------------------------------- */}

            <div className="appointments-list">

                {filteredAppointments.map(
                    (appointment) => (

                        <div
                            className="appointment-card"
                            key={appointment._id}
                        >

                            <h2>
                                Patient Appointment
                            </h2>

                            <p>
                                <strong>
                                    Patient:
                                </strong>{" "}
                                {appointment.patient?.user?.name ||
                                    appointment.patient?.name ||
                                    "Patient"}
                            </p>

                            <p>
                                <strong>
                                    Email:
                                </strong>{" "}
                                {appointment.patient?.user?.email ||
                                    "Not available"}
                            </p>

                            <p>
                                <strong>
                                    Phone:
                                </strong>{" "}
                                {appointment.patient?.user?.phone ||
                                    "Not available"}
                            </p>

                            <p>
                                <strong>
                                    Date:
                                </strong>{" "}
                                {new Date(
                                    appointment.date
                                ).toLocaleDateString()}
                            </p>

                            <p>
                                <strong>
                                    Time:
                                </strong>{" "}
                                {appointment.time}
                            </p>

                            <p>
                                <strong>
                                    Reason:
                                </strong>{" "}
                                {appointment.reason ||
                                    "Not specified"}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}

                                <span
                                    className={`status ${appointment.status}`}
                                >
                                    {appointment.status}
                                </span>
                            </p>

                            {/* -------------------------------- */}
                            {/* PENDING ACTIONS */}
                            {/* -------------------------------- */}

                            {appointment.status ===
                                "pending" && (

                                <div className="appointment-actions">

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                appointment._id,
                                                "confirmed"
                                            )
                                        }
                                    >
                                        Confirm
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                appointment._id,
                                                "rejected"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                </div>
                            )}

                            {/* -------------------------------- */}
                            {/* CONFIRMED ACTION */}
                            {/* -------------------------------- */}

                            {appointment.status ===
                                "confirmed" && (

                                <div className="appointment-actions">

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                appointment._id,
                                                "completed"
                                            )
                                        }
                                    >
                                        Mark Completed
                                    </button>

                                </div>
                            )}

                        </div>
                    )
                )}

            </div>

        </div>
    );
}

export default DoctorDashboard;