import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin-settings.css";

function AdminSettings() {
    const [settings, setSettings] = useState({
        hospitalName: "MediFlow Hospital",
        hospitalEmail: "admin@mediflow.com",
        hospitalPhone: "9876543210",
        address: "Sector 62, Noida",
        emailNotifications: true,
        appointmentNotifications: true,
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setSettings({
            ...settings,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSave = (e) => {
        e.preventDefault();

        localStorage.setItem(
            "mediflowSettings",
            JSON.stringify(settings)
        );

        setMessage("Settings saved successfully.");

        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

    return (
        <AdminLayout title="Settings">

            <div className="settings-page">

                <div className="settings-intro">
                    <h1>Settings</h1>
                    <p>
                        Manage MediFlow system and notification settings.
                    </p>
                </div>

                {message && (
                    <div className="settings-success">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSave}>

                    {/* HOSPITAL INFORMATION */}

                    <div className="settings-section">

                        <h2>Hospital Information</h2>

                        <div className="settings-grid">

                            <div className="settings-field">
                                <label>Hospital Name</label>

                                <input
                                    type="text"
                                    name="hospitalName"
                                    value={settings.hospitalName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="settings-field">
                                <label>Hospital Email</label>

                                <input
                                    type="email"
                                    name="hospitalEmail"
                                    value={settings.hospitalEmail}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="settings-field">
                                <label>Hospital Phone</label>

                                <input
                                    type="text"
                                    name="hospitalPhone"
                                    value={settings.hospitalPhone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="settings-field">
                                <label>Address</label>

                                <input
                                    type="text"
                                    name="address"
                                    value={settings.address}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                    </div>


                    {/* NOTIFICATIONS */}

                    <div className="settings-section">

                        <h2>Notifications</h2>

                        <label className="settings-toggle">

                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={settings.emailNotifications}
                                onChange={handleChange}
                            />

                            <div>
                                <strong>Email Notifications</strong>

                                <p>
                                    Receive important system notifications
                                    through email.
                                </p>
                            </div>

                        </label>


                        <label className="settings-toggle">

                            <input
                                type="checkbox"
                                name="appointmentNotifications"
                                checked={settings.appointmentNotifications}
                                onChange={handleChange}
                            />

                            <div>
                                <strong>Appointment Notifications</strong>

                                <p>
                                    Receive notifications about new and
                                    updated appointments.
                                </p>
                            </div>

                        </label>

                    </div>


                    {/* SAVE */}

                    <div className="settings-actions">

                        <button
                            type="submit"
                            className="settings-save"
                        >
                            Save Settings
                        </button>

                    </div>

                </form>

            </div>

        </AdminLayout>
    );
}

export default AdminSettings;