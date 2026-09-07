import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

import "../styles/admin.css";

function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    // ==========================================
    // LOAD DOCTORS
    // ==========================================

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/admin/doctors?search=${encodeURIComponent(
                    search
                )}&status=${status}`
            );

            console.log(
                "DOCTORS RESPONSE:",
                response.data
            );

            if (response.data.success) {
                setDoctors(response.data.doctors);
            } else {
                setError(
                    response.data.message ||
                    "Failed to load doctors"
                );
            }

        } catch (error) {
            console.error(
                "DOCTORS ERROR:",
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
        fetchDoctors();
    }, [status]);

    // ==========================================
    // APPROVE / REJECT DOCTOR
    // ==========================================

    const updateApproval = async (
        doctorId,
        approvalStatus
    ) => {
        try {
            await api.patch(
                `/admin/doctors/${doctorId}/approval`,
                {
                    approvalStatus,
                }
            );

            await fetchDoctors();

        } catch (error) {
            console.error(
                "APPROVAL ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update doctor"
            );
        }
    };

    // ==========================================
    // ACTIVATE / DEACTIVATE DOCTOR
    // ==========================================

    const updateStatus = async (
        doctorId,
        isActive
    ) => {
        try {
            await api.patch(
                `/admin/doctors/${doctorId}/status`,
                {
                    isActive,
                }
            );

            await fetchDoctors();

        } catch (error) {
            console.error(
                "STATUS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update doctor status"
            );
        }
    };

    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = () => {
        fetchDoctors();
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchDoctors();
        }
    };

    return (
        <AdminLayout title="Doctor Management">

            {/* PAGE INTRO */}

            <div className="admin-welcome">

                <h2>
                    Manage Doctors
                </h2>

                <p>
                    Review, approve and manage
                    MediFlow doctors.
                </p>

            </div>


            {/* SEARCH + FILTER */}

            <div className="doctor-toolbar">

                <input
                    type="text"
                    placeholder="Search doctor..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    onKeyDown={handleSearchKeyDown}
                />

                <button
                    className="search-button"
                    onClick={handleSearch}
                >
                    Search
                </button>

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >
                    <option value="all">
                        All Doctors
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="approved">
                        Approved
                    </option>

                    <option value="rejected">
                        Rejected
                    </option>
                </select>

            </div>


            {/* ERROR */}

            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}


            {/* DOCTOR TABLE */}

            <div className="admin-panel">

                <div className="admin-panel-header">

                    <h3>
                        Doctors ({doctors.length})
                    </h3>

                </div>


                {loading ? (

                    <p>
                        Loading doctors...
                    </p>

                ) : doctors.length === 0 ? (

                    <p>
                        No doctors found.
                    </p>

                ) : (

                    <div className="doctor-table-wrapper">

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th>
                                        Doctor
                                    </th>

                                    <th>
                                        Specialization
                                    </th>

                                    <th>
                                        Experience
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Account
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {doctors.map(
                                    (doctor) => (

                                        <tr
                                            key={
                                                doctor._id
                                            }
                                        >

                                            {/* DOCTOR */}

                                            <td>

                                                <strong>
                                                    {
                                                        doctor.user
                                                            ?.name ||
                                                        "Unknown"
                                                    }
                                                </strong>

                                                <br />

                                                <small>
                                                    {
                                                        doctor.user
                                                            ?.email ||
                                                        ""
                                                    }
                                                </small>

                                            </td>


                                            {/* SPECIALIZATION */}

                                            <td>
                                                {
                                                    doctor.specialization ||
                                                    "—"
                                                }
                                            </td>


                                            {/* EXPERIENCE */}

                                            <td>
                                                {
                                                    doctor.experience ??
                                                    0
                                                }{" "}
                                                years
                                            </td>


                                            {/* APPROVAL STATUS */}

                                            <td>

                                                <span
                                                    className={`doctor-status ${doctor.approvalStatus}`}
                                                >
                                                    {
                                                        doctor.approvalStatus
                                                    }
                                                </span>

                                            </td>


                                            {/* ACCOUNT STATUS */}

                                            <td>

                                                <span
                                                    className={`doctor-status ${
                                                        doctor.user
                                                            ?.isActive
                                                            ? "active"
                                                            : "inactive"
                                                    }`}
                                                >
                                                    {
                                                        doctor.user
                                                            ?.isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="doctor-actions">

                                                    {/* PENDING */}

                                                    {doctor.approvalStatus ===
                                                        "pending" && (
                                                        <>
                                                            <button
                                                                className="approve-btn"
                                                                onClick={() =>
                                                                    updateApproval(
                                                                        doctor._id,
                                                                        "approved"
                                                                    )
                                                                }
                                                            >
                                                                ✓ Approve
                                                            </button>

                                                            <button
                                                                className="reject-btn"
                                                                onClick={() =>
                                                                    updateApproval(
                                                                        doctor._id,
                                                                        "rejected"
                                                                    )
                                                                }
                                                            >
                                                                ✕ Reject
                                                            </button>
                                                        </>
                                                    )}


                                                    {/* APPROVED */}

                                                    {doctor.approvalStatus ===
                                                        "approved" &&
                                                        doctor.user
                                                            ?.isActive && (
                                                            <button
                                                                className="deactivate-btn"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        doctor._id,
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                Deactivate
                                                            </button>
                                                        )}


                                                    {/* REJECTED */}

                                                    {doctor.approvalStatus ===
                                                        "rejected" && (
                                                        <button
                                                            className="approve-btn"
                                                            onClick={() =>
                                                                updateApproval(
                                                                    doctor._id,
                                                                    "approved"
                                                                )
                                                            }
                                                        >
                                                            ✓ Approve
                                                        </button>
                                                    )}


                                                    {/* INACTIVE */}

                                                    {!doctor.user
                                                        ?.isActive && (
                                                        <button
                                                            className="activate-btn"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    doctor._id,
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            Activate
                                                        </button>
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

export default AdminDoctors;
