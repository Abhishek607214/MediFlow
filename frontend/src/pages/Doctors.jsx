import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Doctors() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get("/doctors");

                console.log("DOCTORS RESPONSE:", response.data);

                if (response.data.success) {
                    setDoctors(response.data.doctors || []);
                } else {
                    setError(
                        response.data.message ||
                        "Unable to load doctors"
                    );
                }

            } catch (err) {
                console.error("DOCTORS ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load doctors"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <div className="doctors-page">
                <div className="doctors-header">
                    <h1>Our Doctors</h1>
                    <p>Loading available doctors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="doctors-page">

            {/* Header */}

            <div className="doctors-header">

                <div>
                    <h1>Find a Doctor</h1>

                    <p>
                        Choose from our qualified healthcare
                        professionals and book your appointment.
                    </p>
                </div>

                <div className="doctor-count">
                    <strong>{doctors.length}</strong>
                    <span>
                        {doctors.length === 1
                            ? "Doctor Available"
                            : "Doctors Available"}
                    </span>
                </div>

            </div>


            {/* Error */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* No doctors */}

            {!error && doctors.length === 0 && (
                <div className="no-doctors">
                    <div className="no-doctors-icon">
                        👨‍⚕️
                    </div>

                    <h2>No doctors available</h2>

                    <p>
                        There are currently no doctors
                        available for appointments.
                    </p>
                </div>
            )}


            {/* Doctors */}

            {!error && doctors.length > 0 && (

                <div className="doctor-grid">

                    {doctors.map((doctor) => (

                        <div
                            className="doctor-card"
                            key={doctor._id}
                        >

                            {/* Doctor Avatar */}

                            <div className="doctor-top">

                                <div className="doctor-avatar">
                                    👨‍⚕️
                                </div>

                                <div className="doctor-basic">

                                    <h2>
                                        {doctor.user?.name ||
                                            doctor.name ||
                                            "Doctor"}
                                    </h2>

                                    <span className="doctor-specialization">
                                        {doctor.specialization ||
                                            "General Physician"}
                                    </span>

                                </div>

                            </div>


                            {/* Doctor Information */}

                            <div className="doctor-details">

                                <div className="doctor-detail">

                                    <span className="detail-icon">
                                        🎓
                                    </span>

                                    <div>
                                        <small>
                                            Qualification
                                        </small>

                                        <strong>
                                            {doctor.qualification ||
                                                "Not specified"}
                                        </strong>
                                    </div>

                                </div>


                                <div className="doctor-detail">

                                    <span className="detail-icon">
                                        💼
                                    </span>

                                    <div>
                                        <small>
                                            Experience
                                        </small>

                                        <strong>
                                            {doctor.experience || 0} years
                                        </strong>
                                    </div>

                                </div>


                                <div className="doctor-detail">

                                    <span className="detail-icon">
                                        🏥
                                    </span>

                                    <div>
                                        <small>
                                            Hospital
                                        </small>

                                        <strong>
                                            {doctor.hospital ||
                                                "Not specified"}
                                        </strong>
                                    </div>

                                </div>


                                <div className="doctor-detail">

                                    <span className="detail-icon">
                                        📍
                                    </span>

                                    <div>
                                        <small>
                                            Location
                                        </small>

                                        <strong>
                                            {doctor.city ||
                                                "Not specified"}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            {/* Footer */}

                            <div className="doctor-footer">

                                <div className="consultation-fee">

                                    <small>
                                        Consultation Fee
                                    </small>

                                    <strong>
                                        ₹{doctor.consultationFee || 0}
                                    </strong>

                                </div>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/book-appointment?doctor=${doctor._id}`
                                        )
                                    }
                                >
                                    Book Appointment
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Doctors;