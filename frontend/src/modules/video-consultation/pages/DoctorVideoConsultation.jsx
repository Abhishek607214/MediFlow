import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../../../services/api";

import VideoCallWindow
    from "../components/VideoCallWindow";

import "../styles/Video.consultation.css";


const DoctorVideoConsultation = () => {

    const {
        appointmentId
    } = useParams();

    const navigate =
        useNavigate();


    // ==========================================
    // STATE
    // ==========================================

    const [appointment, setAppointment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // GET DOCTOR APPOINTMENT
    // ==========================================

    useEffect(() => {

        const fetchAppointment = async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await api.get(
                        "/appointments/doctor"
                    );


                const appointments =
                    response.data?.appointments ||
                    response.data?.data ||
                    [];


                const foundAppointment =
                    appointments.find(
                        (item) =>
                            item._id ===
                            appointmentId
                    );


                if (!foundAppointment) {

                    setError(
                        "Appointment not found"
                    );

                    return;
                }


                // ==================================
                // VIDEO ONLY FOR CONFIRMED
                // ==================================

                if (
                    foundAppointment.status !==
                    "confirmed"
                ) {

                    setError(
                        "Video consultation is available only for confirmed appointments."
                    );

                    return;
                }


                setAppointment(
                    foundAppointment
                );


            } catch (err) {

                console.error(
                    "Fetch doctor video appointment error:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    "Unable to load appointment"
                );


            } finally {

                setLoading(false);

            }

        };


        fetchAppointment();

    }, [appointmentId]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="video-page">

                <div className="video-page-loading">

                    <div className="video-loading-spinner">
                    </div>

                    <h2>
                        Loading Consultation
                    </h2>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="video-page">

                <div className="video-page-error">

                    <div className="video-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Open Video Consultation
                    </h2>

                    <p>
                        {error}
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/doctor-dashboard"
                            )
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // GET PATIENT INFORMATION
    // ==========================================

    const patient =
        appointment?.patient;


    const patientUser =
        patient?.user;


    const patientName =
        patientUser?.name ||
        patient?.name ||
        "Patient";


    // ==========================================
    // VIDEO CONSULTATION
    // ==========================================

    return (

        <div className="video-page">


            {/* ================================= */}
            {/* PAGE HEADER */}
            {/* ================================= */}

            <div className="video-page-header">

                <button
                    className="video-back-button"
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
                        Video Consultation
                    </h1>

                    <p>
                        Consultation with{" "}
                        {patientName}
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* VIDEO CALL */}
            {/* ================================= */}

            <VideoCallWindow

                appointmentId={
                    appointmentId
                }

                currentUserRole="doctor"

                currentUserName={
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        ) || "null"
                    )?.name || "Doctor"
                }

                otherParticipantName={
                    patientName
                }

            />

        </div>

    );

};


export default DoctorVideoConsultation;