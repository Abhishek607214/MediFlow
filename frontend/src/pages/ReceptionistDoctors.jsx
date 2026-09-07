import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/receptionist.css";

function ReceptionistDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // ================= LOAD DOCTORS =================

    const getDoctors = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/doctors");

            console.log(
                "RECEPTIONIST DOCTORS:",
                response.data
            );

            if (response.data.success) {
                setDoctors(response.data.doctors || []);
            } else {
                setError(
                    response.data.message ||
                    "Unable to load doctors"
                );
            }
        } catch (error) {
            console.error(
                "RECEPTIONIST DOCTORS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load doctors"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    // ================= SEARCH =================

    const filteredDoctors = doctors.filter((doctor) => {
        const name =
            doctor.user?.name ||
            doctor.name ||
            "";

        const specialization =
            doctor.specialization ||
            "";

        const qualification =
            doctor.qualification ||
            "";

        const hospital =
            doctor.hospital ||
            "";

        const city =
            doctor.city ||
            "";

        const searchText = search.toLowerCase();

        return (
            name.toLowerCase().includes(searchText) ||
            specialization.toLowerCase().includes(searchText) ||
            qualification.toLowerCase().includes(searchText) ||
            hospital.toLowerCase().includes(searchText) ||
            city.toLowerCase().includes(searchText)
        );
    });

    // ================= LOADING =================

    if (loading) {
        return (
            <AdminLayout
                title="Receptionist Doctors"
                role="receptionist"
            >
                <div className="receptionist-page">
                    <p>Loading doctors...</p>
                </div>
            </AdminLayout>
        );
    }

    // ================= UI =================

    return (
        <AdminLayout
            title="Receptionist Doctors"
            role="receptionist"
        >
            <div className="receptionist-page">

                {/* HEADER */}

                <div className="receptionist-intro">
                    <div>
                        <h1>Doctors</h1>

                        <p>
                            View all registered doctors
                            and their professional information.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={getDoctors}
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
                        placeholder="Search doctor, specialization, qualification, hospital or city..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                {/* COUNT */}

                <div className="receptionist-section-header">
                    <h2>All Doctors</h2>

                    <span>
                        {filteredDoctors.length}{" "}
                        {filteredDoctors.length === 1
                            ? "Doctor"
                            : "Doctors"}
                    </span>
                </div>

                {/* NO DOCTORS */}

                {filteredDoctors.length === 0 ? (
                    <div className="no-appointments">
                        <span>🩺</span>

                        <h3>
                            No doctors found
                        </h3>

                        <p>
                            No doctors match your search.
                        </p>
                    </div>
                ) : (

                    /* DOCTOR GRID */

                    <div className="receptionist-doctor-grid">

                        {filteredDoctors.map((doctor) => (

                            <div
                                className="receptionist-doctor-card"
                                key={doctor._id}
                            >

                                {/* DOCTOR HEADER */}

                                <div className="receptionist-doctor-header">

                                    <div className="receptionist-doctor-avatar">
                                        👨‍⚕️
                                    </div>

                                    <div>
                                        <h2>
                                            {doctor.user?.name ||
                                                doctor.name ||
                                                "Doctor"}
                                        </h2>

                                        <span>
                                            {doctor.specialization ||
                                                "General Physician"}
                                        </span>
                                    </div>

                                </div>

                                {/* DETAILS */}

                                <div className="receptionist-doctor-details">

                                    <div>
                                        <small>
                                            Qualification
                                        </small>

                                        <strong>
                                            {doctor.qualification ||
                                                "Not specified"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            Experience
                                        </small>

                                        <strong>
                                            {doctor.experience || 0} years
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            Hospital
                                        </small>

                                        <strong>
                                            {doctor.hospital ||
                                                "Not specified"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            Location
                                        </small>

                                        <strong>
                                            {doctor.city ||
                                                "Not specified"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            Consultation Fee
                                        </small>

                                        <strong>
                                            ₹{doctor.consultationFee || 0}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>
        </AdminLayout>
    );
}

export default ReceptionistDoctors;