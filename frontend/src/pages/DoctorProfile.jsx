import { useEffect, useState } from "react";
import api from "../services/api";

function DoctorProfile() {
    const [profile, setProfile] = useState({
        department:"",
        specialization: "",
        qualification: "",
        experience: "",
        hospital: "",
        clinicAddress: "",
        city: "",
        consultationFee: "",
        phone: "",
        bio: "",
        availableDays: [],
        availableTime: {
            start: "",
            end: ""
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const[departments,setDepartments] = useState([]);

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    useEffect(() => {
        getProfile();
        getDepartments();
    }, []);

 const getDepartments = async () => {
    try {
        const response = await api.get("/departments/active");
       console.log("Departments Response:",response.data)
        if (response.data.success) {
            setDepartments(response.data.departments);
        }
    } catch (error) {
        console.error(
            "DEPARTMENTS ERROR:",
            error
        );
    }
};   

    const getProfile = async () => {
        try {
            const response = await api.get("/doctors/me");

            console.log("DOCTOR PROFILE:", response.data);

            if (response.data.success) {
                const doctor = response.data.doctor;

                setProfile({
                    department:doctor.department?._id||doctor.department||"",
                    specialization: doctor.specialization || "",
                    qualification: doctor.qualification || "",
                    experience: doctor.experience || "",
                    hospital: doctor.hospital || "",
                    clinicAddress: doctor.clinicAddress || "",
                    city: doctor.city || "",
                    consultationFee:
                        doctor.consultationFee || "",
                    phone: doctor.phone || "",
                    bio: doctor.bio || "",
                    availableDays:
                        doctor.availableDays || [],
                    availableTime: {
                        start:
                            doctor.availableTime?.start || "",
                        end:
                            doctor.availableTime?.end || ""
                    }
                });
            }
        } catch (error) {
            console.error(
                "DOCTOR PROFILE ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load doctor profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTimeChange = (e) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            availableTime: {
                ...prev.availableTime,
                [name]: value
            }
        }));
    };

    const handleDayChange = (day) => {
        setProfile((prev) => {
            const exists =
                prev.availableDays.includes(day);

            return {
                ...prev,
                availableDays: exists
                    ? prev.availableDays.filter(
                          (item) => item !== day
                      )
                    : [...prev.availableDays, day]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setSaving(true);

        try {
            const response = await api.put(
                "/doctors/me",
                profile
            );

            console.log(
                "UPDATE DOCTOR PROFILE:",
                response.data
            );

            if (response.data.success) {
                setMessage(
                    "Doctor profile updated successfully."
                );
            } else {
                setError(
                    response.data.message ||
                    "Unable to update profile"
                );
            }
        } catch (error) {
            console.error(
                "UPDATE PROFILE ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <h1>Doctor Profile</h1>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="page-container doctor-profile-page">

            <h1>Doctor Profile</h1>

            <p>
                Manage your professional information and
                availability.
            </p>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            <form
                className="doctor-profile-form"
                onSubmit={handleSubmit}
            >

                {/* Professional Information */}

                <h2>Professional Information</h2>
            
            <div className="form-group">
             <label>
                 Department
             </label>

          <select
               name="department"
               value={profile.department}
               onChange={handleChange}
           >
        <option value="">
            Select Department
        </option>

        {departments.map((department) => (
            <option
                key={department._id}
                value={department._id}
            >
                {department.name}
                </option>
             ))}
        </select>
      </div>

                <div className="form-grid">

                    <div className="form-group">
                        <label>
                            Specialization
                        </label>

                        <input
                            type="text"
                            name="specialization"
                            value={
                                profile.specialization
                            }
                            onChange={handleChange}
                            placeholder="e.g. Cardiologist"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Qualification
                        </label>

                        <input
                            type="text"
                            name="qualification"
                            value={
                                profile.qualification
                            }
                            onChange={handleChange}
                            placeholder="e.g. MBBS, MD"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Experience (Years)
                        </label>

                        <input
                            type="number"
                            name="experience"
                            value={
                                profile.experience
                            }
                            onChange={handleChange}
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Consultation Fee (₹)
                        </label>

                        <input
                            type="number"
                            name="consultationFee"
                            value={
                                profile.consultationFee
                            }
                            onChange={handleChange}
                            min="0"
                        />
                    </div>

                </div>


                {/* Hospital Information */}

                <h2>Hospital Information</h2>

                <div className="form-grid">

                    <div className="form-group">
                        <label>
                            Hospital
                        </label>

                        <input
                            type="text"
                            name="hospital"
                            value={profile.hospital}
                            onChange={handleChange}
                            placeholder="Hospital name"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            City
                        </label>

                        <input
                            type="text"
                            name="city"
                            value={profile.city}
                            onChange={handleChange}
                            placeholder="City"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>
                            Clinic Address
                        </label>

                        <input
                            type="text"
                            name="clinicAddress"
                            value={
                                profile.clinicAddress
                            }
                            onChange={handleChange}
                            placeholder="Clinic address"
                        />
                    </div>

                </div>


                {/* Contact */}

                <h2>Contact Information</h2>

                <div className="form-group">

                    <label>
                        Phone
                    </label>

                    <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                    />

                </div>


                {/* Bio */}

                <h2>About You</h2>

                <div className="form-group">

                    <label>
                        Professional Bio
                    </label>

                    <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Tell patients about yourself..."
                        rows="5"
                    />

                </div>


                {/* Available Days */}

                <h2>Available Days</h2>

                <div className="days-container">

                    {days.map((day) => (
                        <label
                            className="day-checkbox"
                            key={day}
                        >

                            <input
                                type="checkbox"
                                checked={profile.availableDays.includes(
                                    day
                                )}
                                onChange={() =>
                                    handleDayChange(day)
                                }
                            />

                            {day}

                        </label>
                    ))}

                </div>


                {/* Available Time */}

                <h2>Available Time</h2>

                <div className="time-grid">

                    <div className="form-group">

                        <label>
                            Start Time
                        </label>

                        <input
                            type="time"
                            name="start"
                            value={
                                profile.availableTime
                                    .start
                            }
                            onChange={
                                handleTimeChange
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            End Time
                        </label>

                        <input
                            type="time"
                            name="end"
                            value={
                                profile.availableTime
                                    .end
                            }
                            onChange={
                                handleTimeChange
                            }
                        />

                    </div>

                </div>


                {/* Save */}

                <button
                    type="submit"
                    className="save-profile-btn"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Profile"}
                </button>

            </form>

        </div>
    );
}

export default DoctorProfile;