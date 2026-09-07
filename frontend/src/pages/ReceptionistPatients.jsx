import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/receptionist.css";

function ReceptionistPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // ================= LOAD PATIENTS =================

    const getPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/receptionist/patients"
            );

            console.log(
                "RECEPTIONIST PATIENTS:",
                response.data
            );

            if (response.data.success) {
                setPatients(
                    response.data.patients || []
                );
            } else {
                setError(
                    response.data.message ||
                    "Unable to load patients"
                );
            }
        } catch (error) {
            console.error(
                "RECEPTIONIST PATIENTS ERROR:",
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
        getPatients();
    }, []);

    // ================= SEARCH =================

    const filteredPatients = patients.filter((patient) => {
        const name =
            patient.user?.name ||
            patient.name ||
            "";

        const email =
            patient.user?.email ||
            patient.email ||
            "";

        const phone =
            patient.user?.phone ||
            patient.phone ||
            "";

        const searchText = search.toLowerCase();

        return (
            name.toLowerCase().includes(searchText) ||
            email.toLowerCase().includes(searchText) ||
            phone.toLowerCase().includes(searchText)
        );
    });

    // ================= LOADING =================

    if (loading) {
        return (
            <AdminLayout
                title="Receptionist Patients"
                role="receptionist"
            >
                <div className="receptionist-page">
                    <p>Loading patients...</p>
                </div>
            </AdminLayout>
        );
    }

    // ================= UI =================

    return (
        <AdminLayout
            title="Receptionist Patients"
            role="receptionist"
        >
            <div className="receptionist-page">

                {/* HEADER */}

                <div className="receptionist-intro">
                    <div>
                        <h1>Patients</h1>

                        <p>
                            View and search registered
                            hospital patients.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={getPatients}
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
                        placeholder="Search patient by name, email or phone..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                {/* HEADER */}

                <div className="receptionist-section-header">
                    <h2>All Patients</h2>

                    <span>
                        {filteredPatients.length} Patients
                    </span>
                </div>

                {/* EMPTY */}

                {filteredPatients.length === 0 ? (
                    <div className="no-appointments">
                        <span>👤</span>

                        <h3>
                            No patients found
                        </h3>

                        <p>
                            No patients match your search.
                        </p>
                    </div>
                ) : (

                    /* TABLE */

                    <div className="receptionist-table-wrapper">

                        <table className="receptionist-table">

                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredPatients.map(
                                    (patient) => {

                                        const user =
                                            patient.user || {};

                                        return (
                                            <tr
                                                key={
                                                    patient._id
                                                }
                                            >

                                                <td>
                                                    {user.name ||
                                                        patient.name ||
                                                        "Patient"}
                                                </td>

                                                <td>
                                                    {user.email ||
                                                        patient.email ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {user.phone ||
                                                        patient.phone ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    <span className="receptionist-status confirmed">
                                                        Patient
                                                    </span>
                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>
        </AdminLayout>
    );
}

export default ReceptionistPatients;