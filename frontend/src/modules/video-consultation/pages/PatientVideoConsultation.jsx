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


const PatientVideoConsultation = () => {

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
    // GET APPOINTMENT
    // ==========================================

    useEffect(() => {

        const fetchAppointment = async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await api.get(
                        "/appointments/patient"
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
                    "Fetch patient video appointment error:",
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
                                "/appointments"
                            )
                        }
                    >
                        ← Back to Appointments
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // GET DOCTOR INFORMATION
    // ==========================================

    const doctor =
        appointment?.doctor;


    const doctorUser =
        doctor?.user;


    const doctorName =
        doctorUser?.name ||
        doctor?.name ||
        "Doctor";


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
                            "/appointments"
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
                        Consultation with Dr.{" "}
                        {doctorName}
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

                currentUserRole="patient"

                currentUserName={
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        ) || "null"
                    )?.name || "Patient"
                }

                otherParticipantName={
                    doctorName
                }

            />

        </div>

    );

};


export default PatientVideoConsultation;