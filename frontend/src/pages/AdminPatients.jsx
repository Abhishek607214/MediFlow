import { useEffect, useState } from "react";
import api from "../services/api";

import AdminLayout from "../components/AdminLayout";

import "../styles/admin.css";

function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==============================
    // LOAD PATIENTS
    // ==============================

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/admin/patients"
            );

            console.log(
                "PATIENTS RESPONSE:",
                response.data
            );

            if (response.data.success) {
                setPatients(
                    response.data.patients
                );
            } else {
                setError(
                    response.data.message ||
                    "Failed to load patients"
                );
            }

        } catch (error) {
            console.error(
                "PATIENTS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load patients"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // ==============================
    // ACTIVATE / DEACTIVATE
    // ==============================

    const handleStatusChange = async (
        userId,
        currentStatus
    ) => {
        try {
            await api.patch(
                `/admin/patients/${userId}/status`,
                {
                    isActive: !currentStatus,
                }
            );

            await fetchPatients();

        } catch (error) {
            console.error(
                "PATIENT STATUS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update patient status"
            );
        }
    };

    // ==============================
    // SEARCH
    // ==============================

    const searchText = search
        .toLowerCase()
        .trim();

    const filteredPatients =
        patients.filter((patient) => {

            if (!searchText) {
                return true;
            }

            return (
                patient.user?.name
                    ?.toLowerCase()
                    .includes(searchText) ||

                patient.user?.email
                    ?.toLowerCase()
                    .includes(searchText) ||

                patient.user?.phone
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });

    return (
        <AdminLayout title="Patient Management">

            {/* PAGE INTRO */}

            <div className="admin-welcome">

                <h2>
                    Manage Patients
                </h2>

                <p>
                    View and manage MediFlow patients.
                </p>

            </div>


            {/* SEARCH */}

            <div className="admin-search-box">

                <input
                    type="text"
                    placeholder="Search patient..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button
                    type="button"
                    onClick={() => setSearch(search)}
                >
                    Search
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}


            {/* PATIENT TABLE */}

            <div className="admin-panel">

                <div className="admin-panel-header">

                    <h3>
                        Patients ({filteredPatients.length})
                    </h3>

                </div>


                {loading ? (

                    <p>
                        Loading patients...
                    </p>

                ) : filteredPatients.length === 0 ? (

                    <p>
                        No patients found.
                    </p>

                ) : (

                    <div className="patient-table-wrapper">

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th>
                                        Patient
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Phone
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

                                {filteredPatients.map(
                                    (patient) => (

                                        <tr
                                            key={
                                                patient._id
                                            }
                                        >

                                            {/* NAME */}

                                            <td>

                                                <strong>
                                                    {
                                                        patient.user
                                                            ?.name ||
                                                        "Unknown"
                                                    }
                                                </strong>

                                            </td>


                                            {/* EMAIL */}

                                            <td>
                                                {
                                                    patient.user
                                                        ?.email ||
                                                    "—"
                                                }
                                            </td>


                                            {/* PHONE */}

                                            <td>
                                                {
                                                    patient.user
                                                        ?.phone ||
                                                    "—"
                                                }
                                            </td>


                                            {/* ACCOUNT */}

                                            <td>

                                                <span
                                                    className={
                                                        patient.user
                                                            ?.isActive
                                                            ? "status active"
                                                            : "status inactive"
                                                    }
                                                >
                                                    {
                                                        patient.user
                                                            ?.isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                </span>

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <button
                                                    type="button"
                                                    className={
                                                        patient.user
                                                            ?.isActive
                                                            ? "action-btn deactivate"
                                                            : "action-btn activate"
                                                    }
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            patient.user?._id,
                                                            patient.user
                                                                ?.isActive
                                                        )
                                                    }
                                                >
                                                    {
                                                        patient.user
                                                            ?.isActive
                                                            ? "Deactivate"
                                                            : "Activate"
                                                    }
                                                </button>

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

export default AdminPatients;