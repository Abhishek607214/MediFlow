import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../services/api";

import PersonalChatWindow from "../components/PersonalChatWindow";


const DoctorPersonalChat = () => {

    const { appointmentId } = useParams();

    const navigate = useNavigate();
    const user =
    JSON.parse(
        localStorage.getItem("user") || "null"
    );

const currentUserId = user?.id;

    const [appointment, setAppointment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD DOCTOR APPOINTMENT
    // ==========================================

    useEffect(() => {

        const loadAppointment = async () => {

            try {

                const response =
                    await api.get(
                        "/appointments/doctor"
                    );


                const appointments =
                    response.data.appointments || [];


                const foundAppointment =
                    appointments.find(
                        (item) =>
                            item._id === appointmentId
                    );


                if (!foundAppointment) {

                    setError(
                        "Appointment not found"
                    );

                    return;
                }


                // Chat is available only for
                // confirmed or completed appointments
                if (
                    foundAppointment.status !==
                        "confirmed" &&
                    foundAppointment.status !==
                        "completed"
                ) {

                    setError(
                        "Chat is available only for confirmed or completed appointments"
                    );

                    return;
                }


                setAppointment(
                    foundAppointment
                );


            } catch (error) {

                console.error(
                    "Load doctor appointment error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load appointment"
                );


            } finally {

                setLoading(false);
            }
        };


        loadAppointment();

    }, [appointmentId]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="personal-chat-page">

                <div className="personal-chat-page-loading">
                    Loading consultation...
                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !appointment) {

        return (
            <div className="personal-chat-page">

                <div className="personal-chat-page-error">

                    <h2>
                        Unable to open chat
                    </h2>

                    <p>
                        {error ||
                            "Appointment not found"}
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/doctor-dashboard"
                            )
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // PATIENT INFORMATION
    // ==========================================

    const patientName =
        appointment.patient?.user?.name ||
        appointment.patient?.name ||
        "Patient";


    const patientEmail =
        appointment.patient?.user?.email ||
        appointment.patient?.email ||
        "";


    return (
        <div className="personal-chat-page">


            {/* ================================= */}
            {/* PAGE HEADER */}
            {/* ================================= */}

            <div className="personal-chat-page-header">

                <button
                    className="personal-chat-back"
                    onClick={() =>
                        navigate(
                            "/doctor-dashboard"
                        )
                    }
                >
                    ← Back
                </button>


                <div>

                    <h1>
                        Chat with Patient
                    </h1>

                    <p>
                        Secure consultation
                        conversation
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* APPOINTMENT INFORMATION */}
            {/* ================================= */}

            <div className="personal-chat-appointment-info">

                <div>

                    <strong>
                        Patient
                    </strong>

                    <span>
                        {patientName}
                    </span>

                </div>


                {patientEmail && (
                    <div>

                        <strong>
                            Email
                        </strong>

                        <span>
                            {patientEmail}
                        </span>

                    </div>
                )}


                <div>

                    <strong>
                        Status
                    </strong>

                    <span className="personal-chat-confirmed">
                        {appointment.status}
                    </span>

                </div>

            </div>


            {/* ================================= */}
            {/* PERSONAL CHAT */}
            {/* ================================= */}

<PersonalChatWindow

    appointmentId={
        appointmentId
    }

    currentUserId={
        currentUserId
    }

    participantName={
        patientName
    }

    participantRole="Patient"

/>

        </div>
    );
};


export default DoctorPersonalChat;