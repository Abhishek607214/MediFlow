import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../services/api";

import PersonalChatWindow from "../components/PersonalChatWindow";


const PatientPersonalChat = () => {

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
    // LOAD PATIENT APPOINTMENT
    // ==========================================

    useEffect(() => {

        const loadAppointment = async () => {

            try {

                const response =
                    await api.get(
                        "/appointments/patient"
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


                // Chat is only available for
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
                    "Load patient appointment error:",
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
                                "/appointments"
                            )
                        }
                    >
                        Back to Appointments
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // DOCTOR INFORMATION
    // ==========================================

    const doctorName =
        appointment.doctor?.user?.name ||
        appointment.doctor?.name ||
        "Doctor";


    const doctorEmail =
        appointment.doctor?.user?.email ||
        appointment.doctor?.email ||
        "";


    return (
        <div className="personal-chat-page">


            {/* ================================= */}
            {/* PAGE TOP BAR */}
            {/* ================================= */}

            <div className="personal-chat-page-header">

                <button
                    className="personal-chat-back"
                    onClick={() =>
                        navigate(
                            "/appointments"
                        )
                    }
                >
                    ← Back
                </button>


                <div>

                    <h1>
                        Chat with Doctor
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
                        Doctor
                    </strong>

                    <span>
                        {doctorName}
                    </span>

                </div>


                {doctorEmail && (
                    <div>

                        <strong>
                            Email
                        </strong>

                        <span>
                            {doctorEmail}
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
            {/* CHAT */}
            {/* ================================= */}
<PersonalChatWindow

    appointmentId={
        appointmentId
    }

    currentUserId={
        currentUserId
    }

    participantName={
        doctorName
    }

    participantRole="Doctor"

/>

        </div>
    );
};


export default PatientPersonalChat;