import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function BookAppointment() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const doctorIdFromUrl = searchParams.get("doctor");

    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState(doctorIdFromUrl || "");

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");

    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Get doctors
    useEffect(() => {
        const getDoctors = async () => {
            try {
                const response = await api.get("/doctors");

                console.log("DOCTORS:", response.data);

                if (response.data.success) {
                    setDoctors(response.data.doctors || []);
                } else {
                    setError(
                        response.data.message ||
                        "Unable to load doctors"
                    );
                }

            } catch (error) {
                console.error("DOCTORS ERROR:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load doctors"
                );

            } finally {
                setLoadingDoctors(false);
            }
        };

        getDoctors();
    }, []);

    // Find selected doctor
    const selectedDoctor = doctors.find(
        (item) => item._id === doctor
    );

    // Get today's date in local time
    const getToday = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

const getAvailableSlots = async (selectedDate, selectedDoctor) => {
    if (!selectedDate || !selectedDoctor) {
        setAvailableSlots([]);
        setTime("");
        return;
    }

    setLoadingSlots(true);
    setTime("");
    setError("");

    try {
        const response = await api.get(
            `/appointments/availability/${selectedDoctor}`,
            {
                params: {
                    date: selectedDate
                }
            }
        );

        console.log("AVAILABLE SLOTS:", response.data);

        if (response.data.success) {
            setAvailableSlots(response.data.slots || []);

            if (
                response.data.slots &&
                response.data.slots.length === 0
            ) {
                setError(
                    response.data.message ||
                    "No slots available for this date"
                );
            }
        } else {
            setAvailableSlots([]);
            setError(
                response.data.message ||
                "Unable to load available slots"
            );
        }

    } catch (error) {
        console.error(
            "AVAILABLE SLOTS ERROR:",
            error
        );

        setAvailableSlots([]);

        setError(
            error.response?.data?.message ||
            "Unable to load available slots"
        );
    } finally {
        setLoadingSlots(false);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!doctor || !date || !time) {
            setError(
                "Please select doctor, date and time."
            );
            return;
        }
        if (!availableSlots.includes(time)) {
        setError(
        "This time slot is no longer available. Please select another slot."
        );
        return;
        }
        setLoading(true);

        try {
            const response = await api.post(
                "/appointments",
                {
                    doctor,
                    date,
                    time,
                    reason,
                }
            );

            console.log(
                "BOOK APPOINTMENT:",
                response.data
            );

            if (response.data.success) {

                setMessage(
                    "Appointment booked successfully!"
                );

                setDate("");
                setTime("");
                setReason("");

                setTimeout(() => {
                    navigate("/appointments");
                }, 1000);

            } else {
                setError(
                    response.data.message ||
                    "Unable to book appointment"
                );
            }

        } catch (error) {
            console.error(
                "BOOK APPOINTMENT ERROR:",
                error
            );

            if (error.response?.status === 409) {
             setError(
            "This slot was just booked by another patient. Please select another time."
            );

           // Refresh available slots
           getAvailableSlots(date, doctor);

          setTime("");
          } else {
          setError(
        error.response?.data?.message ||
        "Unable to book appointment"
    );
}

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-page">

            {/* Header */}

            <div className="booking-header">

                <h1>Book an Appointment</h1>

                <p>
                    Schedule a consultation with your
                    preferred doctor.
                </p>

            </div>


            {/* Messages */}

            {message && (
                <div className="success-message booking-message">
                    ✅ {message}
                </div>
            )}

            {error && (
                <div className="error-message booking-message">
                    {error}
                </div>
            )}


            <div className="booking-layout">

                {/* Left side - form */}

                <div className="booking-card">

                    <form onSubmit={handleSubmit}>

                        {/* Doctor */}

                        <div className="form-group">

                            <label>
                                Doctor
                            </label>

                            {loadingDoctors ? (

                                <div className="loading-box">
                                    Loading doctors...
                                </div>

                            ) : (

                              <select
                               value={doctor}
                               onChange={(e) => {
                               const selectedDoctor = e.target.value;

                               setDoctor(selectedDoctor);
                               setTime("");
                               setAvailableSlots([]);

                               if (date && selectedDoctor) {
                                getAvailableSlots(
                                date,
                                selectedDoctor
                               );
                               }
                            }}
                                required
                            >

                                    <option value="">
                                        Select Doctor
                                    </option>

                                    {doctors.map((item) => (

                                        <option
                                            key={item._id}
                                            value={item._id}
                                        >
                                            {item.user?.name ||
                                                item.name ||
                                                "Doctor"}
                                            {" - "}
                                            {item.specialization ||
                                                "General Physician"}
                                        </option>

                                    ))}

                                </select>

                            )}

                        </div>


                        {/* Selected Doctor */}

                        {selectedDoctor && (

                            <div className="selected-doctor">

                                <div className="selected-doctor-avatar">
                                    👨‍⚕️
                                </div>

                                <div>

                                    <small>
                                        Selected Doctor
                                    </small>

                                    <h3>
                                        {selectedDoctor.user?.name ||
                                            selectedDoctor.name ||
                                            "Doctor"}
                                    </h3>

                                    <span>
                                        {selectedDoctor.specialization ||
                                            "General Physician"}
                                    </span>

                                </div>

                            </div>

                        )}


                        {/* Date */}

                        <div className="form-group">

                            <label>
                                Appointment Date
                            </label>

                            <input
                             type="date"
                             value={date}
                             min={
                             getToday()
                            }
                            onChange={(e) => {
                            const selectedDate = e.target.value;

                        setDate(selectedDate);
                        setTime("");
                         setAvailableSlots([]);

        if (selectedDate && doctor) {
            getAvailableSlots(
                selectedDate,
                doctor
            );
        }
    }}
    required
/>

                        </div>


                        {/* Time */}

                        <div className="form-group">

                            <label>
                                Appointment Time
                            </label>

                            <select
    value={time}
    onChange={(e) =>
        setTime(e.target.value)
    }
    required
    disabled={
        !doctor ||
        !date ||
        loadingSlots
    }
>
    <option value="">
        {loadingSlots
            ? "Loading available slots..."
            : !doctor
            ? "Select doctor first"
            : !date
            ? "Select date first"
            : availableSlots.length === 0
            ? "No slots available"
            : "Select Time"}
    </option>

    {availableSlots.map((slot) => (
        <option
            key={slot}
            value={slot}
        >
            {slot}
        </option>
    ))}
</select>
                        </div>


                        {/* Reason */}

                        <div className="form-group">

                            <label>
                                Reason for Visit
                            </label>

                            <textarea
                                placeholder="Tell the doctor briefly about your reason for consultation..."
                                value={reason}
                                onChange={(e) =>
                                    setReason(
                                        e.target.value
                                    )
                                }
                                rows="5"
                            />

                        </div>


                        {/* Submit */}

                        <button
                            className="booking-button"
                            type="submit"
                            disabled={
                                loading ||
                                loadingDoctors
                            }
                        >

                            {loading
                                ? "Booking Appointment..."
                                : "Confirm Appointment"}

                        </button>

                    </form>

                </div>


                {/* Right side */}

                <div className="booking-summary">

                    <div className="summary-icon">
                        📅
                    </div>

                    <h2>
                        Appointment Summary
                    </h2>

                    <p>
                        Please review your appointment
                        details before confirming.
                    </p>


                    <div className="summary-item">

                        <span>
                            👨‍⚕️ Doctor
                        </span>

                        <strong>
                            {selectedDoctor
                                ? selectedDoctor.user?.name ||
                                  selectedDoctor.name
                                : "Not selected"}
                        </strong>

                    </div>


                    <div className="summary-item">

                        <span>
                            🩺 Specialization
                        </span>

                        <strong>
                            {selectedDoctor
                                ? selectedDoctor.specialization ||
                                  "General Physician"
                                : "Not selected"}
                        </strong>

                    </div>


                    <div className="summary-item">

                        <span>
                            📅 Date
                        </span>

                        <strong>
                            {date || "Not selected"}
                        </strong>

                    </div>


                    <div className="summary-item">

                        <span>
                            🕐 Time
                        </span>

                        <strong>
                            {time || "Not selected"}
                        </strong>

                    </div>


                    <div className="summary-fee">

                        <span>
                            Consultation Fee
                        </span>

                        <strong>
                            ₹
                            {selectedDoctor?.consultationFee ||
                                0}
                        </strong>

                    </div>


                    <div className="booking-note">

                        🔒 Your appointment information
                        is securely handled by MediFlow.

                    </div>

                </div>

            </div>

        </div>
    );
}

export default BookAppointment;