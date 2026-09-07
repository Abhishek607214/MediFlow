import { useEffect, useState } from "react";
import api from "../services/api";

function MedicalReports() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getReports = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/reports/patient"
            );

            if (response.data.success) {

                setReports(
                    response.data.reports || []
                );

            } else {

                setError(
                    response.data.message ||
                    "Unable to load medical reports"
                );

            }

        } catch (error) {

            console.error(
                "GET PATIENT REPORTS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load medical reports"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getReports();

    }, []);


    const formatDate = (date) => {

        if (!date) return "N/A";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    if (loading) {

        return (

            <div className="page-container">

                <h1>Medical Reports</h1>

                <p>
                    Loading your medical reports...
                </p>

            </div>

        );

    }


    return (

        <div className="page-container">

            <div className="dashboard-header">

                <div>

                    <h1>Medical Reports</h1>

                    <p>
                        View medical reports provided by
                        your doctors.
                    </p>

                </div>

            </div>


            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {!error && reports.length === 0 && (

                <div className="dashboard-card">

                    <div className="card-icon">
                        📋
                    </div>

                    <h2>No Medical Reports Yet</h2>

                    <p>
                        Your doctor will provide a medical
                        report after completing your
                        appointment.
                    </p>

                </div>

            )}


            <div className="reports-container">

                {reports.map((report) => (

                    <div
                        className="report-card"
                        key={report._id}
                    >

                        <div className="report-header">

                            <div>

                                <h2>
                                    Medical Report
                                </h2>

                                <p>
                                    Report Date:{" "}
                                    {formatDate(
                                        report.reportDate
                                    )}
                                </p>

                            </div>

                            <span className="report-icon">
                                📋
                            </span>

                        </div>


                        <div className="report-doctor">

                            <strong>
                                Doctor
                            </strong>

                            <p>
                                {report.doctor?.user?.name ||
                                    "Doctor"}
                            </p>

                            {report.doctor?.specialization && (

                                <small>
                                    {
                                        report.doctor
                                            .specialization
                                    }
                                </small>

                            )}

                        </div>


                        <div className="report-section">

                            <h3>Diagnosis</h3>

                            <p>
                                {report.diagnosis ||
                                    "Not provided"}
                            </p>

                        </div>


                        <div className="report-section">

                            <h3>Symptoms</h3>

                            <p>
                                {report.symptoms ||
                                    "Not provided"}
                            </p>

                        </div>


                        <div className="report-section">

                            <h3>Test Results</h3>

                            <p>
                                {report.testResults ||
                                    "Not provided"}
                            </p>

                        </div>


                        <div className="report-section">

                            <h3>Prescription</h3>

                            <p>
                                {report.prescription ||
                                    "Not provided"}
                            </p>

                        </div>


                        <div className="report-section">

                            <h3>Doctor's Notes</h3>

                            <p>
                                {report.doctorNotes ||
                                    "Not provided"}
                            </p>

                        </div>


                        <div className="report-actions">

                            <button
                                onClick={() =>
                                    window.print()
                                }
                            >
                                🖨 Print Report
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default MedicalReports;