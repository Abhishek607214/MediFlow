import { useEffect, useState } from "react";
import api from "../services/api";

function PatientProfile() {
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        bloodPressure: "",
        heartRate: "",

        emergencyContact: {
            name: "",
            relationship: "",
            phone: ""
        },

        insurance: {
            providerName: "",
            memberId: "",
            groupNumber: ""
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================
    // GET PATIENT PROFILE
    // =========================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/patients/profile");

                console.log("PATIENT PROFILE:", response.data);

                if (response.data.success) {
                    const patient = response.data.patient;

                    setProfile(patient);

                    setFormData({
                        dateOfBirth: patient.dateOfBirth
                            ? patient.dateOfBirth.substring(0, 10)
                            : "",

                        gender: patient.gender || "",
                        address: patient.address || "",
                        city: patient.city || "",
                        state: patient.state || "",
                        zipCode: patient.zipCode || "",

                        bloodPressure:
                            patient.bloodPressure || "",

                        heartRate:
                            patient.heartRate ?? "",

                        emergencyContact: {
                            name:
                                patient.emergencyContact?.name || "",

                            relationship:
                                patient.emergencyContact?.relationship || "",

                            phone:
                                patient.emergencyContact?.phone || ""
                        },

                        insurance: {
                            providerName:
                                patient.insurance?.providerName || "",

                            memberId:
                                patient.insurance?.memberId || "",

                            groupNumber:
                                patient.insurance?.groupNumber || ""
                        }
                    });
                }
            } catch (error) {
                console.error("GET PROFILE ERROR:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // =========================
    // NORMAL INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // EMERGENCY CONTACT
    // =========================

    const handleEmergencyChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,

            emergencyContact: {
                ...prev.emergencyContact,
                [name]: value
            }
        }));
    };

    // =========================
    // INSURANCE
    // =========================

    const handleInsuranceChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,

            insurance: {
                ...prev.insurance,
                [name]: value
            }
        }));
    };

    // =========================
    // SAVE PROFILE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const response = await api.put(
                "/patients/profile",
                {
                    ...formData,

                    heartRate:
                        formData.heartRate === ""
                            ? null
                            : Number(formData.heartRate)
                }
            );

            console.log("UPDATE PROFILE:", response.data);

            if (response.data.success) {
                setSuccess("Profile updated successfully.");

                setProfile(response.data.patient);
            } else {
                setError(
                    response.data.message ||
                    "Failed to update profile"
                );
            }
        } catch (error) {
            console.error("UPDATE PROFILE ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="page-container">
                <h1>Patient Profile</h1>
                <p>Loading profile...</p>
            </div>
        );
    }

    // =========================
    // MAIN PROFILE PAGE
    // =========================

    return (
        <div className="page-container">

            <h1>Patient Profile</h1>

            <p>
                Manage your personal and medical information.
            </p>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* =========================
                    PERSONAL INFORMATION
                ========================= */}

                <div className="profile-section">

                    <h2>Personal Information</h2>

                    <div className="profile-info">

                        <div>
                            <strong>Name</strong>
                            <span>
                                {profile?.user?.name || "-"}
                            </span>
                        </div>

                        <div>
                            <strong>Email</strong>
                            <span>
                                {profile?.user?.email || "-"}
                            </span>
                        </div>

                        <div>
                            <strong>Phone</strong>
                            <span>
                                {profile?.user?.phone || "-"}
                            </span>
                        </div>

                    </div>

                    <div className="profile-form">

                        <div className="profile-field">
                            <label htmlFor="dateOfBirth">
                                Date of Birth
                            </label>

                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="gender">
                                Gender
                            </label>

                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select Gender
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="female">
                                    Female
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>
                        </div>

                        <div className="profile-field full-width">
                            <label htmlFor="address">
                                Address
                            </label>

                            <input
                                id="address"
                                name="address"
                                type="text"
                                placeholder="Enter your address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="city">
                                City
                            </label>

                            <input
                                id="city"
                                name="city"
                                type="text"
                                placeholder="Enter city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="state">
                                State
                            </label>

                            <input
                                id="state"
                                name="state"
                                type="text"
                                placeholder="Enter state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="zipCode">
                                ZIP Code
                            </label>

                            <input
                                id="zipCode"
                                name="zipCode"
                                type="text"
                                placeholder="Enter ZIP code"
                                value={formData.zipCode}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                </div>

                {/* =========================
                    MEDICAL INFORMATION
                ========================= */}

                <div className="profile-section">

                    <h2>Medical Information</h2>

                    <div className="profile-form">

                        <div className="profile-field">
                            <label htmlFor="bloodPressure">
                                Blood Pressure
                            </label>

                            <input
                                id="bloodPressure"
                                name="bloodPressure"
                                type="text"
                                placeholder="Example: 120/80"
                                value={formData.bloodPressure}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="heartRate">
                                Heart Rate
                            </label>

                            <input
                                id="heartRate"
                                name="heartRate"
                                type="number"
                                min="0"
                                placeholder="Example: 72"
                                value={formData.heartRate}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                </div>

                {/* =========================
                    EMERGENCY CONTACT
                ========================= */}

                <div className="profile-section">

                    <h2>Emergency Contact</h2>

                    <div className="profile-form">

                        <div className="profile-field">
                            <label htmlFor="emergencyName">
                                Name
                            </label>

                            <input
                                id="emergencyName"
                                name="name"
                                type="text"
                                placeholder="Emergency contact name"
                                value={
                                    formData.emergencyContact.name
                                }
                                onChange={handleEmergencyChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="emergencyRelationship">
                                Relationship
                            </label>

                            <input
                                id="emergencyRelationship"
                                name="relationship"
                                type="text"
                                placeholder="Example: Father"
                                value={
                                    formData.emergencyContact.relationship
                                }
                                onChange={handleEmergencyChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="emergencyPhone">
                                Phone
                            </label>

                            <input
                                id="emergencyPhone"
                                name="phone"
                                type="tel"
                                placeholder="Emergency contact phone"
                                value={
                                    formData.emergencyContact.phone
                                }
                                onChange={handleEmergencyChange}
                            />
                        </div>

                    </div>
                </div>

                {/* =========================
                    INSURANCE INFORMATION
                ========================= */}

                <div className="profile-section">

                    <h2>Insurance Information</h2>

                    <div className="profile-form">

                        <div className="profile-field">
                            <label htmlFor="providerName">
                                Provider Name
                            </label>

                            <input
                                id="providerName"
                                name="providerName"
                                type="text"
                                placeholder="Insurance provider"
                                value={
                                    formData.insurance.providerName
                                }
                                onChange={handleInsuranceChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="memberId">
                                Member ID
                            </label>

                            <input
                                id="memberId"
                                name="memberId"
                                type="text"
                                placeholder="Member ID"
                                value={
                                    formData.insurance.memberId
                                }
                                onChange={handleInsuranceChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="groupNumber">
                                Group Number
                            </label>

                            <input
                                id="groupNumber"
                                name="groupNumber"
                                type="text"
                                placeholder="Group number"
                                value={
                                    formData.insurance.groupNumber
                                }
                                onChange={handleInsuranceChange}
                            />
                        </div>

                    </div>
                </div>

                {/* =========================
                    SAVE BUTTON
                ========================= */}

                <div className="profile-actions">

                    <button
                        type="submit"
                        className="profile-save-btn"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Profile"}
                    </button>

                </div>

            </form>
        </div>
    );
}

export default PatientProfile;