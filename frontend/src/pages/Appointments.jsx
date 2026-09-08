import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Appointments() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getAppointments = async () => {
        try {
            const response = await api.get("/appointments/patient");

            console.log("APPOINTMENTS:", response.data);

            if (response.data.success) {
                setAppointments(response.data.appointments || []);
            } else {
                setError(
                    response.data.message ||
                    "Unable to load appointments"
                );
            }
        } catch (error) {
            console.error("APPOINTMENTS ERROR:", error);

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

    if (loading) {
        return (
            <div className="page-container">
                <h1>My Appointments</h1>
                <p>Loading appointments...</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <h1>My Appointments</h1>

            <p>
                View and manage your upcoming and previous appointments.
            </p>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {!error && appointments.length === 0 && (
                <p>You don't have any appointments yet.</p>
            )}

            <div className="appointments-list">

                {appointments.map((appointment) => (

                    <div
                        className="appointment-card"
                        key={appointment._id}
                    >

                        <h2>Doctor Appointment</h2>

                        {/* Doctor Information */}
                        <div className="doctor-info">

                            <p>
                                <strong>Doctor:</strong>{" "}
                                {appointment.doctor?.user?.name ||
                                    "Doctor"}
                            </p>

                            <p>
                                <strong>Specialization:</strong>{" "}
                                {appointment.doctor?.specialization ||
                                    "General Physician"}
                            </p>

                        </div>

                        <hr />

                        {/* Appointment Information */}

                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(
                                appointment.date
                            ).toLocaleDateString()}
                        </p>

                        <p>
                            <strong>Time:</strong>{" "}
                            {appointment.time}
                        </p>

                        <p>
                            <strong>Reason:</strong>{" "}
                            {appointment.reason ||
                                "Not specified"}
                        </p>

                       <p>
    <strong>Status:</strong>{" "}
    <span
        className={`status ${appointment.status}`}
    >
        {appointment.status}
    </span>
</p>

{(appointment.status === "confirmed" ||
    appointment.status === "completed") && (
    <button
        className="personal-chat-button"
        onClick={() =>
            navigate(
                `/patient-personal-chat/${appointment._id}`
            )
        }
    >
        💬 Chat Doctor
    </button>
)}
{appointment.status === "confirmed" && (
    <button
        className="video-consultation-button"
        onClick={() =>
            navigate(
                `/patient-video-consultation/${appointment._id}`
            )
        }
    >
        📹 Join Video Consultation
    </button>
)}

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Appointments;